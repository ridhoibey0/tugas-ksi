const express = require('express');
const router = express.Router();
const { isGuest } = require('../middleware/auth');

// Show login form
router.get('/login', isGuest, (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    error: req.query.error || null
  });
});

// Process login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = req.db;
    
    const user = await db('users')
      .where({ username, password })
      .first();
    
    if (user) {
      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.userRole = user.role;
      res.redirect('/');
    } else {
      res.redirect('/login?error=invalid');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/login?error=server');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
