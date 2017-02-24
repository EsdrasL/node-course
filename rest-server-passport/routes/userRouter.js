const express = require('express');
const passport = require('passport');

const User = require('../models/users');
const Verify = require('./verify');

const userRouter = express.Router();

userRouter.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function(req, res, next) {
  User.find({}, function(err, user) {
    if(err) throw err;
    res.json(user);
  });
});

userRouter.post('/register', function(req, res, next) {
  User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
    if(err) return res.status(500).json({err: err});

    passport.authenticate('local')(req, res, function() {
      return res.status(200).json({status: 'Registration Successful!'});
    });
  });
});

userRouter.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if(err) return next(err);

    if(!user) {
      return res.status(401).json({
        err: info
      });
    }

    req.logIn(user, function(err) {
      if(err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }

      console.log('Users in users: ', user);

      const token = Verify.getToken(user);

      res.status(200).json({
        status: 'Login successful',
        success: true,
        token: token
      });
    });
  })(req, res, next);
});

userRouter.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = userRouter;
