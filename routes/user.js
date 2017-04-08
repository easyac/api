const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const Auth = require('../config/auth');

const router = express.Router();

const getToken = (req) => {
  let auth = req.headers.authorization;
  let reg = /Bearer (.*)/ig;
  let matched = reg.exec(auth);
  return matched[1];
};

const Status = {
  OK: 200,
  Conflict: 409,
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500,
}

router.post('/', (req, res) => {
  const {password, email} = req.body;

  if(!email || !password){
    res.sendStatus(Status.BadRequest);
    return;
  }

  UserModel.exists(email, (err, exists) => {
    if(exists.length === 0){
      // password =
      let user = new UserModel({ email, password });
      user.save((err) => {
        if(err){
          res.sendStatus(Status.InternalServerError);
        }else{
          res.sendStatus(Status.OK);
        }
      });
    }else{
      res.sendStatus(Status.Conflict);
    }
  });
});

router.post('/auth', (req, res) => {
  const {password, email} = req.body;

  if(!email || !password){
    res.sendStatus(Status.BadRequest);
    return;
  }

  UserModel.authenticate({email, password}, (valid, user) => {
    if(!valid){
      res.sendStatus(Status.NotFound);
      return;
    }

    let webToken = jwt.sign({email}, Auth.jwtSecret);
    let query = {email: user.email, password: user.password};

    UserModel.update(query, { webToken }, {multi: true}, (err, data) => {
      res.send({err, data});
    });

  });
});

router.post('/revalidade', (req, res) => {
  res.send(Status.OK);
})

module.exports = router;
