const express = require('express');
const router = express.Router();
const { format, parse } = require('date-fns');
const { Parser } = require('json2csv');

// Show reports page
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    const { start_date, end_date, export_format } = req.query;
    
    let query = db('sales')
      .select('sales.*')
      .orderBy('sales.created_at', 'desc');
    
    if (start_date) {
      query = query.where('sales.created_at', '>=', start_date);
    }
    
    if (end_date) {
      const endDateTime = `${end_date} 23:59:59`;
      query = query.where('sales.created_at', '<=', endDateTime);
    }
    
    const sales = await query;
    
    // Calculate summary
    const summary = {
      total_sales: sales.length,
      total_revenue: sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0),
      cash_sales: sales.filter(s => s.payment_method === 'cash').length,
      non_cash_sales: sales.filter(s => s.payment_method !== 'cash').length
    };
    
    // If export requested
    if (export_format === 'csv') {
      const fields = [
        { label: 'No Invoice', value: 'invoice_number' },
        { label: 'Tanggal', value: 'created_at' },
        { label: 'Customer', value: 'customer_name' },
        { label: 'Total', value: 'total_amount' },
        { label: 'Bayar', value: 'paid_amount' },
        { label: 'Kembali', value: 'change_amount' },
        { label: 'Metode', value: 'payment_method' }
      ];
      
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(sales);
      
      res.header('Content-Type', 'text/csv');
      res.attachment(`laporan-penjualan-${format(new Date(), 'yyyyMMdd')}.csv`);
      return res.send(csv);
    }
    
    res.render('reports/index', {
      title: 'Laporan Penjualan',
      page: 'reports',
      sales,
      summary,
      start_date: start_date || '',
      end_date: end_date || ''
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Product report
router.get('/products', async (req, res) => {
  try {
    const db = req.db;
    
    const products = await db('products')
      .select('products.*')
      .orderBy('name');
    
    const productsWithSales = await Promise.all(
      products.map(async (product) => {
        const salesData = await db('sale_items')
          .where('product_id', product.id)
          .sum('quantity as total_sold')
          .sum('subtotal as total_revenue')
          .first();
        
        return {
          ...product,
          total_sold: salesData.total_sold || 0,
          total_revenue: salesData.total_revenue || 0
        };
      })
    );
    
    res.render('reports/products', {
      title: 'Laporan Produk',
      page: 'reports',
      products: productsWithSales
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
