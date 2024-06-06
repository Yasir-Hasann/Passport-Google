// module imports
const express = require('express');
const passport = require('passport');

// file imports
const { checkAuthenticated } = require('../middlewares/auth');

// variable initializations
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.route('/logout').get((req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect('/api/v1/auth/login');
  });
});

router.get('/dashboard', checkAuthenticated, (req, res) => {
  res.render('dashboard', { name: req.user.name, email: req.user.email });
});

router.get('/register', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get(
  '/register/callback',
  passport.authenticate('google', {
    successRedirect: '/api/v1/auth/dashboard',
    failureRedirect: '/api/v1/auth/login',
  })
);

module.exports = router;
