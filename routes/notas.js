'use strict';

var express = require('express');
var jwt = require('jsonwebtoken');
var Nota = require('../models/nota');
var Auth = require('../config/auth');
var router = express.Router();

const getToken = (req) => {
  let auth = req.headers.authorization;
  let reg = /Bearer (.*)/ig;
  let matched = reg.exec(auth);
  return matched[1];
};

router.get('/', (req, res) => {
  const token = getToken(req);
  const payload = jwt.verify(token, Auth.jwtSecret);
  const filterFields = {alunoId: 0, _id: 0, __v: 0};
  let queryFalta = { alunoId: payload.id };

  if(req.query.ano)
    queryFalta.ano = req.query.ano;

  if(req.query.semestre)
    queryFalta.semestre = req.query.semestre;

  Nota.find(queryFalta, filterFields, (err, faltas) => {
    if(err) res.status(400).send(err);
    res.send(faltas);
  });

});

module.exports = router;
