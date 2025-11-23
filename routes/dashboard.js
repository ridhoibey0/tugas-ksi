const express = require('express');
const router = express.Router();
const { format, subDays } = require('date-fns');

router.get('/', async (req, res) => {
  try {
    const db = req.db;
    
    // Get total products
    const totalProducts = await db('products').count('id as count').first();
    
    // Get today's sales
    const today = format(new Date(), 'yyyy-MM-dd');
    const todaySales = await db('sales')
      .whereRaw('DATE(created_at) = ?', [today])
      .sum('total_amount as total')
      .first();
    
    // Get critical stock items
    const criticalStock = await db('products')
      .where('stock', '<=', db.raw('min_stock'))
      .count('id as count')
      .first();
    
    // Get total suppliers/customers (simplified - just count sales with customer names)
    const totalCustomers = await db('sales')
      .whereNotNull('customer_name')
      .countDistinct('customer_name as count')
      .first();
    
    // Get sales trend for last 7 days
    const salesTrend = await db('sales')
      .select(db.raw('DATE(created_at) as date'))
      .sum('total_amount as total')
      .whereRaw('created_at >= ?', [format(subDays(new Date(), 6), 'yyyy-MM-dd')])
      .groupByRaw('DATE(created_at)')
      .orderByRaw('DATE(created_at)');
    
    // Get best selling products
    const bestSelling = await db('sale_items')
      .select('products.name', 'products.unit')
      .sum('sale_items.quantity as total_sold')
      .join('products', 'sale_items.product_id', 'products.id')
      .groupBy('products.id', 'products.name', 'products.unit')
      .orderBy('total_sold', 'desc')
      .limit(5);
    
    res.render('dashboard', {
      title: 'Dashboard',
      page: 'dashboard',
      stats: {
        totalProducts: totalProducts.count || 0,
        todaySales: todaySales.total || 0,
        criticalStock: criticalStock.count || 0,
        totalCustomers: totalCustomers.count || 0
      },
      salesTrend: salesTrend,
      bestSelling: bestSelling
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
