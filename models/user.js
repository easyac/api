const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const schema = {
  email: String,
  password: String,
  webToken: String,
  senacCredentials: {
    username: String,
    unity: Number,
    password: String,
    storePassword: Boolean,
    cookie: { type: String, default: '' },
    lastSync: Date,
    isSyncing: { type: Boolean, default: false },
  },
};

const userSchema = mongoose.Schema(schema);

/**
 * HOOKS
 */
userSchema.pre('save', function preSave(next) {
  const { password } = this;

  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(password, salt, (hashEerr, hash) => {
      this.password = hash;
      next();
    });
  });
});

/**
 * METHODS
 */
userSchema.statics.exists = function exists(email, cb) {
  return this.find({ email }, cb);
};

userSchema.statics.findByUsername = function findByUsername(username, cb) {
  return this.findOne({ 'senacCredentials.username': username }, cb);
};


userSchema.statics.get = function get(webToken, cb) {
  const fields = {
    _id: 0,
    password: 0,
    'senacCredentials.password': 0,
    'senacCredentials.cookie': 0,
    __v: 0,
  };
  return this.findOne({ webToken }, fields, cb);
};

userSchema.statics.isSyncing = function isSyncing(webToken, cb) {
  return this.findOne({ webToken }, cb);
};


userSchema.statics.authenticate = function authenticate(user, cb) {
  const { email, password } = user;
  this.findOne({ email }, (err, foundUser) => {
    if (err || !foundUser) {
      cb(false, {});
      return;
    }

    bcrypt
      .compare(password, foundUser.password)
      .then(res => cb(res, foundUser));
  });
};

module.exports = mongoose.model('User', userSchema);
