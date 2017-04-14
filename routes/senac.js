const express = require('express');
const HttpStatus = require('http-status-code');
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
      NRP.emit('worker:sync', { cookie, username });
      res.sendStatus(HttpStatus.OK);
    }
  });
});


module.exports = router;
