/* eslint no-underscore-dangle: ["error", { "allow": ["_doc", "_id"] }] */
const debug = require('debug')('easyacapi');
const express = require('express');
const HttpStatus = require('http-status-codes');
const queue = require('../config/queue');
const UserModel = require('../models/user');

const SIX_HOURS = 1000 * 60 * 6;
const router = express.Router();

router.put('/associate', (req, res) => {
  const { token } = res.locals;
  const { username, password, unity, storePassword } = req.body;

  if (!username || !unity) {
    res.send(HttpStatus.UnprocessableEntity);
    return;
  }

  UserModel.findOne({ webToken: token }, (err, user) => {
    if (err || !user) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }
    const query = { _id: user._id };
    const updatedUser = Object.assign(user._doc, {
      senacCredentials: {
        username,
        unity,
        password,
        storePassword,
      },
    });

    UserModel.update(query, updatedUser, (updateErr) => {
      if (updateErr) res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      else res.sendStatus(HttpStatus.OK);
    });
  });
});

router.post('/login', (req, res) => {
  const { username, password, unity } = req.body;

  if (!username || !password || !unity) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  queue.create('worker:login', { username, password, unity })
    .ttl(SIX_HOURS)
    .priority('high')
    .save((err) => {
      if (err) debug(err);
      debug('JOB %s for %s sent', 'worker:login', username);
    });

  res.sendStatus(HttpStatus.OK);
});

router.post('/sync', (req, res) => {
  UserModel.isSyncing(res.locals.token, (err, user) => {
    if (err || !user) {
      res.send(HttpStatus.BAD_REQUEST);
      return;
    }

    const { username, cookie } = user.senacCredentials;
    const query = { _id: user._id };

    queue.create('worker:sync', { cookie, username })
      .ttl(SIX_HOURS)
      .priority('high')
      .save((jobErr) => {
        if (jobErr) debug(jobErr);
        debug('JOB %s for %s sent', 'worker:sync', username);
      });

    UserModel.update(query, { 'senacCredentials.isSyncing': true }, (updateErr, data) => {
      debug(updateErr, data);
      res.send({ status: 'pending' });
    });
  });
});

router.post('/sync/status', (req, res) => {
  UserModel.isSyncing(res.locals.token, (err, user) => {
    if (err || !user) {
      res.send(HttpStatus.BAD_REQUEST);
      return;
    }

    const { isSyncing } = user.senacCredentials;
    const status = isSyncing ? 'pending' : 'complete';
    res.send({ status });
  });
});

module.exports = router;
