const express = require('express');
const router = express.Router();
const { format } = require('date-fns');

// List all sales
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    const { date } = req.query;
    
    let query = db('sales').orderBy('created_at', 'desc');
    
    if (date) {
      query = query.whereRaw('DATE(created_at) = ?', [date]);
    }
    
    const sales = await query;
    
    res.render('sales/index', {
      title: 'Penjualan',
      page: 'sales',
      sales,
      selectedDate: date || ''
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show create form
router.get('/create', async (req, res) => {
  try {
    const db = req.db;
    const products = await db('products')
      .where('stock', '>', 0)
      .orderBy('name');
    
    res.render('sales/create', {
      title: 'Input Penjualan',
      page: 'sales',
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Create new sale
router.post('/', async (req, res) => {
  const trx = await req.db.transaction();
  
  try {
    const { customer_name, payment_method, paid_amount, items } = req.body;
    
    // Calculate total
    let total = 0;
    const itemsArray = JSON.parse(items);
    
    for (const item of itemsArray) {
      total += item.price * item.quantity;
    }
    
    const change = parseFloat(paid_amount) - total;
    
    // Generate invoice number
    const date = format(new Date(), 'yyyyMMdd');
    const lastSale = await trx('sales')
      .where('invoice_number', 'like', `INV-${date}%`)
      .orderBy('invoice_number', 'desc')
      .first();
    
    let invoiceNum = 1;
    if (lastSale) {
      const lastNum = parseInt(lastSale.invoice_number.split('-')[2]);
      invoiceNum = lastNum + 1;
    }
    
    const invoice_number = `INV-${date}-${String(invoiceNum).padStart(4, '0')}`;
    
    // Insert sale
    const [saleRecord] = await trx('sales').insert({
      invoice_number,
      total_amount: total,
      paid_amount: parseFloat(paid_amount),
      change_amount: change,
      payment_method,
      customer_name: customer_name || null
    }).returning('id');
    
    const saleId = saleRecord.id;
    
    // Insert sale items and update stock
    for (const item of itemsArray) {
      // Insert sale item
      await trx('sale_items').insert({
        sale_id: saleId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      });
      
      // Get current stock
      const product = await trx('products')
        .where('id', item.product_id)
        .first();
      
      // Update product stock
      await trx('products')
        .where('id', item.product_id)
        .decrement('stock', item.quantity);
      
      // Record stock movement
      await trx('stock_movements').insert({
        product_id: item.product_id,
        type: 'out',
        quantity: item.quantity,
        before_stock: product.stock,
        after_stock: product.stock - item.quantity,
        reference_type: 'sale',
        reference_id: saleId,
        notes: `Penjualan ${invoice_number}`
      });
    }
    
    await trx.commit();
    res.redirect('/sales');
  } catch (error) {
    await trx.rollback();
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// View sale detail
router.get('/:id', async (req, res) => {
  try {
    const db = req.db;
    const sale = await db('sales').where('id', req.params.id).first();
    
    if (!sale) {
      return res.status(404).send('Penjualan tidak ditemukan');
    }
    
    const items = await db('sale_items')
      .select('sale_items.*', 'products.name', 'products.unit')
      .join('products', 'sale_items.product_id', 'products.id')
      .where('sale_id', req.params.id);
    
    res.render('sales/detail', {
      title: 'Detail Penjualan',
      page: 'sales',
      sale,
      items
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
