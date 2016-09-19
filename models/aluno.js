var mongoose = require('mongoose');

var alunoSchema = mongoose.Schema({
  'username': String,
  'unity': Number,
  'password': String,
  'cookie': String,
  'webToken': String,
  'deviceTokens': [
  {
    'type': String,
    'value': String
  }
  ],
  'isValidCookie': Boolean,
  'createdAt': Date,
  'lastSearch': Date
});

// alunoSchema.methods.validPassword = function(password) {
//     return true;
// };

module.exports = mongoose.model('Aluno', alunoSchema);
