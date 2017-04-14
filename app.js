'use strict';

var express = require('express');
var cors = require('cors');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

const Config = require('./config');
mongoose.connect(Config.database.url);

var routes = require('./routes/index');
var users = require('./routes/user');
var senac = require('./routes/senac');
require('./routes/worker');

var app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'PUT', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressJWT({ secret: Config.auth.jwtSecret }).unless({ path: ['/users', '/users/auth'] }));

app.options('*', cors());
app.use(function (req, res, next) {
  let {authorization} = req.headers;
  let reg = /Bearer (.*)/ig;

  if(authorization) {
    let matched = reg.exec(authorization);
    let token = matched[1];
    jwt.verify(token, Config.auth.jwtSecret);
    res.locals.token = token;
  }

  next();
});
app.use('/', routes);
app.use('/users', users);
app.use('/senac', senac);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.send(err);
  });
}

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
