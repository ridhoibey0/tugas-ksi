const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const knex = require('./db/knex');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(session({
  secret: 'warung-pos-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make knex available in all routes
app.use((req, res, next) => {
  req.db = knex;
  next();
});

// Middleware auth
const { isAuthenticated } = require('./middleware/auth');

// Routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const stockRoutes = require('./routes/stock');
const reportRoutes = require('./routes/reports');

// Public routes (no auth required)
app.use('/', authRoutes);

// Protected routes (auth required)
app.use('/', isAuthenticated, dashboardRoutes);
app.use('/products', isAuthenticated, productRoutes);
app.use('/sales', isAuthenticated, salesRoutes);
app.use('/stock', isAuthenticated, stockRoutes);
app.use('/reports', isAuthenticated, reportRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
