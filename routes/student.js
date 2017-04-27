/* eslint no-underscore-dangle: ["error", { "allow": ["_doc", "_id"] }] */
const debug = require('debug')('easyacapi');
const express = require('express');
const HttpStatus = require('http-status-codes');
const Classes = require('../models/class');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({
    docs: 'https://docs.easyac.xyz/',
    version: '0.1.0',
  });
});

router.get('/healthcheck', (req, res) => {
  res.send({ alive: true });
});

router.get('/classes', (req, res) => {
  const { ano, semestre } = req.query;
  User.findOne({ webToken: res.locals.token }, (err, user) => {
    if (err || !user) {
      res.sendStatus(HttpStatus.INTERNAL_ERROR);
    }

    const query = { userId: user._id };

    if (ano) {
      query.ano = Number.parseInt(ano, 10);
    }

    if (semestre) {
      query.semestre = Number.parseInt(semestre, 10);
    }

    Classes.get(query, (findErr, faltas) => {
      if (findErr) {
        debug('Error to find classes for %s: %o', res.locals.token, findErr);
        res.sendStatus(HttpStatus);
      }
      res.send(faltas);
    });
  });
});

module.exports = router;
