const mongoose = require('mongoose');

const schema = {
  username: String,
  unity: Number, // campus
  password: String,
  cookie: String,
  isValidCookie: Boolean,
  createdAt: Date,
  lastSearch: Date,
};


const alunoSchema = mongoose.Schema(schema);

module.exports = mongoose.model('Aluno', alunoSchema);
