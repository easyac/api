'use strict';

const mongoose = require('mongoose');

const schema = {
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
};

const notaSchema = mongoose.Schema(schema);
notaSchema.index({ alunoId: 1 });

module.exports = mongoose.model('Nota', notaSchema);
