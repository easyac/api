'use strict';

var express = require('express');
var Easyac = require('easyac-crawler');
var jwt = require('jsonwebtoken');
var Aluno = require('../models/aluno');
var Auth = require('../config/auth');
var router = express.Router();

router.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let unidade = req.body.unidade;

  if(!username || !password || !unidade){
    res.status(400).send('Request mal formatada');
    return;
  }

  Easyac
    .login(username, password, unidade)
    .then(function(cookie){
      const query = { username: username, unity: unidade };

      Aluno.findOne(query, (err, aluno) => {
        if(aluno) {
          let token = jwt.sign({ username: username, id: aluno._id }, Auth.jwtSecret);
          Aluno.update(query, { cookie: cookie }, {multi: true}, (err, data) =>{
            console.log(err, data);
          });
          res.json({ token: token });
        }
        else{
          aluno = new Aluno({
            'username': username,
            'unity': unidade,
            'cookie': cookie,
            'isValidCookie': true,
            'createdAt': new Date(),
          });
          aluno.save((err, aluno) => {
            let token = jwt.sign({ username: username, id: aluno._id }, Auth.jwtSecret);
            if(err) throw err;
            Aluno.update(query, { webToken: token }, {multi: true}, (err, al) => {
              console.log(err, al);
              res.json({token: token});
            });
          });
        }

      });
    })
    .catch(function(err){
      res.status(400).send(err);
    });
});


module.exports = router;
