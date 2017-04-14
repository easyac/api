const mongoose = require('mongoose');

const schema = {
  alunoId: String,
  cursoId: Number,
  disciplina: String,
  ano: Number,
  semestre: Number,
  faltas: Number,
};

const faltaSchema = mongoose.Schema(schema);

faltaSchema.index({ alunoId: 1, ano: 1, semester: 1 });

module.exports = mongoose.model('Falta', faltaSchema);
