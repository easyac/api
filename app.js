const express = require('express');
const debug = require('debug')('easyacapi');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Config = require('./config');

debug('Starting Easyac API');

mongoose.connect(Config.database.url);

const users = require('./routes/user');
const senac = require('./routes/senac');
require('./routes/worker');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'PUT', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressJWT({ secret: Config.auth.jwtSecret }).unless({ path: ['/users', '/users/auth'] }));

app.options('*', cors());
app.use((req, res, next) => {
  const { authorization } = req.headers;
  const reg = /Bearer (.*)/ig;

  if (authorization) {
    const matched = reg.exec(authorization);
    const token = matched[1];
    jwt.verify(token, Config.auth.jwtSecret);
    res.locals.token = token;
  }

  next();
});

app.use('/users', users);
app.use('/senac', senac);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.send(err);
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
