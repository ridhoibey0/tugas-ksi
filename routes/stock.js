const express = require('express');
const router = express.Router();

// Stock movements list
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    const { type, product_id } = req.query;
    
    let query = db('stock_movements')
      .select('stock_movements.*', 'products.name as product_name', 'products.unit')
      .join('products', 'stock_movements.product_id', 'products.id')
      .orderBy('stock_movements.created_at', 'desc')
      .limit(100);
    
    if (type) {
      query = query.where('stock_movements.type', type);
    }
    
    if (product_id) {
      query = query.where('stock_movements.product_id', product_id);
    }
    
    const movements = await query;
    
    const products = await db('products')
      .select('id', 'name')
      .orderBy('name');
    
    res.render('stock/index', {
      title: 'Riwayat Stok',
      page: 'stock',
      movements,
      products,
      selectedType: type || '',
      selectedProduct: product_id || ''
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show add stock form
router.get('/add', async (req, res) => {
  try {
    const db = req.db;
    const products = await db('products').orderBy('name');
    
    res.render('stock/add', {
      title: 'Tambah Stok',
      page: 'stock',
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Add stock
router.post('/add', async (req, res) => {
  const trx = await req.db.transaction();
  
  try {
    const { product_id, quantity, notes } = req.body;
    const qty = parseInt(quantity);
    
    // Get current stock
    const product = await trx('products')
      .where('id', product_id)
      .first();
    
    if (!product) {
      await trx.rollback();
      return res.status(404).send('Produk tidak ditemukan');
    }
    
    // Update stock
    await trx('products')
      .where('id', product_id)
      .increment('stock', qty);
    
    // Record movement
    await trx('stock_movements').insert({
      product_id,
      type: 'in',
      quantity: qty,
      before_stock: product.stock,
      after_stock: product.stock + qty,
      notes: notes || 'Penambahan stok'
    });
    
    await trx.commit();
    res.redirect('/stock');
  } catch (error) {
    await trx.rollback();
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show adjustment form
router.get('/adjustment', async (req, res) => {
  try {
    const db = req.db;
    const products = await db('products').orderBy('name');
    
    res.render('stock/adjustment', {
      title: 'Penyesuaian Stok',
      page: 'stock',
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Stock adjustment
router.post('/adjustment', async (req, res) => {
  const trx = await req.db.transaction();
  
  try {
    const { product_id, new_stock, notes } = req.body;
    const newStock = parseInt(new_stock);
    
    // Get current stock
    const product = await trx('products')
      .where('id', product_id)
      .first();
    
    if (!product) {
      await trx.rollback();
      return res.status(404).send('Produk tidak ditemukan');
    }
    
    const difference = newStock - product.stock;
    
    // Update stock
    await trx('products')
      .where('id', product_id)
      .update({ stock: newStock });
    
    // Record movement
    await trx('stock_movements').insert({
      product_id,
      type: 'adjustment',
      quantity: Math.abs(difference),
      before_stock: product.stock,
      after_stock: newStock,
      notes: notes || 'Penyesuaian stok'
    });
    
    await trx.commit();
    res.redirect('/stock');
  } catch (error) {
    await trx.rollback();
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
