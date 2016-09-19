'use strict';

var express   = require('express');
var router    = express.Router();
const Easyac  = require('easyac-crawler');
var Aluno = require('../models/aluno');

const getToken = (req) => {
  let auth = req.headers.authorization;
  let reg = /Bearer (.*)/ig;
  let matched = reg.exec(auth);
  return matched[1];
};

router.get('/turmas', (req, res) => {
  let token = getToken(req);

  Aluno.findOne({webToken: token}, (err, aluno) => {
    if(err || !aluno.cookie) throw err;
    let AlunoBot = Easyac.aluno(aluno.cookie);

    AlunoBot.get()
    .then(() => {
      return AlunoBot.getTurmas();
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.log(err));

  });
});


router.get('/scrap/turmas', (req, res) => {
  let token = getToken(req);

  Aluno.findOne({webToken: token}, (err, aluno) => {
    if(err || !aluno.cookie) throw err;
    let AlunoBot = Easyac.aluno(aluno.cookie);

    AlunoBot.get()
    .then(() => {
      return AlunoBot.getTurmas();
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.log(err));

  });
});



module.exports = router;


