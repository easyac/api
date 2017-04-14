const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const Auth = require('../config').auth;
const HttpStatus = require('http-status-codes');

const router = express.Router();

router.post('/', (req, res) => {
  const {password, email} = req.body;

  if(!email || !password){
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  UserModel.exists(email, (err, exists) => {
    if(exists.length === 0){
      // password =
      let user = new UserModel({ email, password });
      user.save((err) => {
        if(err){
          res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        }else{
          res.sendStatus(HttpStatus.OK);
        }
      });
    }else{
      res.sendStatus(HttpStatus.CONFLICT);
    }
  });
});

router.post('/auth', (req, res) => {
  const {password, email} = req.body;

  if(!email || !password){
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  UserModel.authenticate({email, password}, (valid, user) => {
    if(!valid){
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    let webToken = jwt.sign({email}, Auth.jwtSecret);
    let query = {email: user.email, password: user.password};

    UserModel.update(query, { webToken }, {multi: true}, (err, data) => {
      if(err){
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        return;
      }

      res.send({token: webToken});
    });

  });
});

router.put('/associate', (req, res) => {
  let {token} = res.locals;
  let {username, password, unity, storePassword} = req.body;

  if(!username || !unity){
    res.send(HttpStatus.UnprocessableEntity);
    return;
  }

  UserModel.findOne({webToken:token}, (err, user) => {
    if(err || !user){
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    let query = {_id: user._id};
    let updatedUser = Object.assign(user._doc, {
      senacCredentials: {
        username,
        unity,
        password,
        storePassword
      }
    });

    UserModel.update(query, updatedUser, err => {
      if(err) res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      else res.sendStatus(HttpStatus.OK);
    })
  });

});

router.delete('/associate', (req, res) => {
  let {token} = res.locals;
  res.send(HttpStatus.OK)
});


router.post('/revalidade', (req, res) => {
  res.send(HttpStatus.OK);
})

module.exports = router;
