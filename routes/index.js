'use strict';

var express   = require('express');
var router    = express.Router();
const Easyac  = require('easyac-crawler');
var jwt   = require('jsonwebtoken');
var Aluno = require('../models/aluno');

router.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let unidade  = req.body.unidade;

  Easyac
    .login(username, password, unidade)
    .then(function(cookie){
      let token = jwt.sign({ username: username, cookie: cookie }, 'icarolindao');
      let query = { username: username, unity: unidade };

      Aluno.findOne(query, (err, aluno) => {
        if(aluno) Aluno.update(query, { cookie: cookie }, console.log);
        else{
          aluno = new Aluno({
            'username': username,
            'unity': unidade,
            'cookie': cookie,
            'webToken': token,
            'isValidCookie': true,
            'createdAt': new Date(),
          });
          aluno.save();
        }



        res.json(token);
      });

    })
    .catch(function(err){
      res.status(400).send(err);
    });
});


module.exports = router;
