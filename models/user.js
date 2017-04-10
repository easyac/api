const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const schema = {
  'email': String,
  'password': String,
  'alunoId': String,
  'webToken': String,
  'senacCredentials' : {
    'username': String,
    'unity': Number,
    'password': String,
    'storePassword': Boolean,
    'cookie': {type: String, default: ''},
    'lastSync': Date,
    'isSyncing': {type: Boolean, default: false}
  }
};

const userSchema = mongoose.Schema(schema);

/**
 * HOOKS
 */
userSchema.pre('save', function(next) {
  let {password} = this;

  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      this.password = hash;
      next();
    });
  });
});

/**
 * METHODS
 */
userSchema.statics.exists = function(email, cb){
  return this.find({ email }, cb);
};

userSchema.statics.isSyncing = function(webToken, cb){
  return this.findOne({ webToken }, cb);
};


userSchema.statics.authenticate = function(user, cb){
  let {email, password} = user;
  this.findOne({email}, function(err, foundUser){
    if(err || !foundUser) cb(false, {});
    bcrypt
      .compare(password, foundUser.password)
      .then(res => cb(res, foundUser));

  });
};

module.exports = mongoose.model('User', userSchema);
