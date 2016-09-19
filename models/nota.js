'use strict';

var mongoose = require('mongoose');
var notaSchema = mongoose.Schema({
  'alunoId': String,
  'cursoId': Number,
  'disciplina': String,
  'ano': Number,
  'semestre': Number,
  'conceito': String,
  'parciais': [
    {
      'descricao': String,
      'ordemParcial': Number,
      'valorAvaliacaoParcial': String,
    }
  ]
});

notaSchema.index({ alunoId: 1 });

module.exports = mongoose.model('Nota', notaSchema);
