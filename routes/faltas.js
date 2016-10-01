'use strict';

var express = require('express');
var jwt = require('jsonwebtoken');
var Falta = require('../models/falta');
var Auth = require('../config/auth');
var router = express.Router();

const getToken = (req) => {
  let auth = req.headers.authorization;
  let reg = /Bearer (.*)/ig;
  let matched = reg.exec(auth);
  return matched[1];
};

router.get('/', (req, res) => {
  let token = getToken(req);
  let payload = jwt.verify(token, Auth.jwtSecret);
  let queryFalta = { alunoId: payload.alunoId };
  let filterFields = {alunoId: 0, _id: 0, __v: 0};

  Falta.find(queryFalta, filterFields, (err, faltas) => {
    if(err) res.status(400).send(err);
    res.send(faltas);
  });

});

module.exports = router;
