// Middleware untuk cek authentication
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

// Middleware untuk redirect jika sudah login
function isGuest(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  next();
}

module.exports = { isAuthenticated, isGuest };
