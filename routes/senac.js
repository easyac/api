/* eslint no-underscore-dangle: ["error", { "allow": ["_doc", "_id"] }] */
const debug = require('debug')('easyacapi');
const express = require('express');
const HttpStatus = require('http-status-codes');
const NRP = require('../config/nrp');
const UserModel = require('../models/user');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password, unity } = req.body;

  if (!username || !password || !unity) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  NRP.emit('worker:login', { username, password, unity });
  res.sendStatus(HttpStatus.OK);
});

router.post('/sync', (req, res) => {
  UserModel.isSyncing(res.locals.token, (err, user) => {
    if (err || !user) {
      res.send(HttpStatus.BAD_REQUEST);
      return;
    }

    const { isSyncing, username, cookie } = user.senacCredentials;
    if (!isSyncing) {
      const query = { _id: user._id };
      NRP.emit('worker:sync', { cookie, username });
      UserModel.update(query, { 'senacCredentials.isSyncing': true }, (updateErr, data) => {
        debug(updateErr, data);
        res.send({ status: 'pending' });
      });
    } else {
      res.send({ status: 'pending' });
    }
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
