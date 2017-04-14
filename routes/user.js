/* eslint no-underscore-dangle: ["error", { "allow": ["_doc", "_id"] }] */
const express = require('express');
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const UserModel = require('../models/user');
const Auth = require('../config').auth;

const router = express.Router();

router.post('/', (req, res) => {
  const { password, email } = req.body;

  if (!email || !password) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  UserModel.exists(email, (err, exists) => {
    if (exists.length === 0) {
      const user = new UserModel({ email, password });
      user.save((saveErr) => {
        if (saveErr) {
          res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
          res.sendStatus(HttpStatus.OK);
        }
      });
    } else {
      res.sendStatus(HttpStatus.CONFLICT);
    }
  });
});

router.post('/auth', (req, res) => {
  const { password, email } = req.body;

  if (!email || !password) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  UserModel.authenticate({ email, password }, (valid, user) => {
    if (!valid) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    const webToken = jwt.sign({ email }, Auth.jwtSecret);
    const query = { email: user.email, password: user.password };

    UserModel.update(query, { webToken }, { multi: true }, (err) => {
      if (err) {
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        return;
      }

      res.send({ token: webToken });
    });
  });
});

router.put('/associate', (req, res) => {
  const { token } = res.locals;
  const { username, password, unity, storePassword } = req.body;

  if (!username || !unity) {
    res.send(HttpStatus.UnprocessableEntity);
    return;
  }

  UserModel.findOne({ webToken: token }, (err, user) => {
    if (err || !user) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }
    const query = { _id: user._id };
    const updatedUser = Object.assign(user._doc, {
      senacCredentials: {
        username,
        unity,
        password,
        storePassword,
      },
    });

    UserModel.update(query, updatedUser, (updateErr) => {
      if (updateErr) res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      else res.sendStatus(HttpStatus.OK);
    });
  });
});

router.delete('/associate', (req, res) => {
  res.send(HttpStatus.OK);
});


router.post('/revalidade', (req, res) => {
  res.send(HttpStatus.OK);
});

module.exports = router;
