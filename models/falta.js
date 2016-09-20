'use strict';

var mongoose = require('mongoose');
var faltaSchema = mongoose.Schema({
  'alunoId': String,
  'cursoId': Number,
  'disciplina': String,
  'ano': Number,
  'semestre': Number,
  'faltas': Number
});

faltaSchema.index({ alunoId: 1, ano: 1, semester: 1 });

module.exports = mongoose.model('Falta', faltaSchema);
