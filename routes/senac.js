const express = require('express');
const jwt = require('jsonwebtoken');
const Auth = require('../config');
const NRP = require('../config/nrp');
const UserModel = require('../models/user');

const router = express.Router();

router.post('/login', (req, res) => {
  const {username, password, unity} = req.body;

  if(!username || !password || !unity){
    res.sendStatus(Status.BadRequest);
    return;
  }

  NRP.emit('worker:login', {username, password, unity});
  res.sendStatus(200);
});

router.post('/sync', (req, res) => {

  UserModel.isSyncing(res.locals.token, (err, user) => {
    if(err || !user){
      res.send(400);
      return;
    }

    const {isSyncing, username, cookie} = user.senacCredentials
    if(!isSyncing){
      NRP.emit('worker:sync', {cookie, username});
      res.sendStatus(200);
    }
  })


  // res.sendStatus(200);
});


module.exports = router;
