const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Leadership = require('../models/leadership');
const Verify = require('./verify');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
  .get(Verify.verifyOrdinaryUser, function(req, res, next) {

    Leadership.find({}, function(err, leadership) {
      if(err) throw err;
      res.json(leadership);
    });

  })
  .post(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function(req, res, next) {

    Leadership.create(req.body, function(err, leadership) {
      if(err) throw err;
      console.log('Leadership created!');
      const id = leadership._id;

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Added the leadership with id: ' + id);
    });

  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function(req, res, next) {

    Leadership.remove({}, function(err, resp) {
      if(err) throw err;
      res.json(resp);
    })

  });

leaderRouter.route('/:leadershipId')
  .get(Verify.verifyOrdinaryUser, function(req, res, next) {

    Leadership.findById(req.params.leadershipId, function(err, leadership) {
      if(err) throw err;
      res.json(leadership);
    });

  })
  .put(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function(req, res, next) {

    Leadership.findByIdAndUpdate(req.params.leadershipId, {
      $set: req.body
    }, {
      new: true
    }, function(err, leadership) {
      if(err) throw err;
      res.json(leadership);
    });

  })
  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdminUser, function(req, res, next) {

    Leadership.findByIdAndRemove(req.params.leadershipId, function(err, resp) {
      if(err) throw err;
      res.json(resp);
    });

  });

module.exports = leaderRouter;
