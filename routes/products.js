const express = require('express');
const router = express.Router();

// List all products
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    const { search, category } = req.query;
    
    let query = db('products').orderBy('created_at', 'desc');
    
    if (search) {
      query = query.where('name', 'ilike', `%${search}%`);
    }
    
    if (category) {
      query = query.where('category', category);
    }
    
    const products = await query;
    const categories = await db('products')
      .distinct('category')
      .whereNotNull('category')
      .orderBy('category');
    
    res.render('products/index', {
      title: 'Data Produk',
      page: 'products',
      products,
      categories: categories.map(c => c.category),
      search: search || '',
      selectedCategory: category || ''
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show create form
router.get('/create', (req, res) => {
  res.render('products/create', {
    title: 'Tambah Produk',
    page: 'products'
  });
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const db = req.db;
    const { name, category, price, stock, min_stock, unit, description } = req.body;
    
    await db('products').insert({
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      min_stock: parseInt(min_stock) || 5,
      unit,
      description
    });
    
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show edit form
router.get('/:id/edit', async (req, res) => {
  try {
    const db = req.db;
    const product = await db('products').where('id', req.params.id).first();
    
    if (!product) {
      return res.status(404).send('Produk tidak ditemukan');
    }
    
    res.render('products/edit', {
      title: 'Edit Produk',
      page: 'products',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const db = req.db;
    const { name, category, price, stock, min_stock, unit, description } = req.body;
    
    await db('products')
      .where('id', req.params.id)
      .update({
        name,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        min_stock: parseInt(min_stock),
        unit,
        description
      });
    
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const db = req.db;
    await db('products').where('id', req.params.id).del();
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
