var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var mongoose = require('mongoose');
const configDB = require('./config/database.js');

mongoose.connect(configDB.url);

var routes = require('./routes/index');
var users = require('./routes/users');
var aluno = require('./routes/aluno');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressJWT({ secret: 'icarolindao' }).unless({ path: ['/login'] }));

app.use('/', routes);
app.use('/users', users);
app.use('/aluno', aluno);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err);
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


module.exports = app;
