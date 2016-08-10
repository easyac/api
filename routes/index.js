'use strict';

var express   = require('express');
var router    = express.Router();
const Easyac  = require('easyac-crawler');


router.post('/login', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let unidade  = req.body.unidade;

    Easyac
        .login(username, password, unidade)
        .then(function(cookie){
            res.send({
                cookie: cookie[0]
            });
        })
        .catch(function(err){
            res.status(400).send(err);
        });
});


module.exports = router;

