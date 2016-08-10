'use strict';

var express   = require('express');
var router    = express.Router();
const Easyac  = require('easyac-crawler');

const token = (req) => {
    let auth = req.headers.authorization;
    let reg = /Token="(.*)"/ig;
    let matched = reg.exec(auth);
    return matched[1];
}

router.get('/codigo', (req, res, next) => {
    let cookie = token(req);

    Easyac
    .getCodigoAluno(cookie)
    .then(function(codigo){
        res.send({
            codigo: codigo
        });
    })
    .catch(function(err){
        res.status(400).send(err);
    });
});

router.get('/titulos', (req, res, next) => {
    let cookie = token(req);

    Easyac
        .getTitulos(cookie)
        .then(function(titulos){
            res.send({
                titulos: titulos
            });
        })
        .catch(function(err){
            res.status(400).send(err);
        });
});


module.exports = router;

