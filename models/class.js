const mongoose = require('mongoose');

const schema = {
  userId: String,
  codigo: String,
  codigoEnturmacao: String,
  cursoId: String,
  ano: Number,
  semestre: Number,
  periodo: String,
  descricao: String,
  codigoDisciplina: Number,
  descricaoDisciplina: String,
  descricaoReduzidaDisciplina: String,
  faltas: {
    total: { type: String, default: '0' },
  },
  notas: {
    conceito: { type: String, default: 'S/N' },
    parciais: {
      type: [
        {
          descricao: String,
          descricaoReduzida: String,
          ordemParcial: Number,
          valorAvaliacaoParcial: String,
          pesoParcial: String,
          descricaoDispensaParcial: { type: String, default: '' },
          legendaDispensaParcial: { type: String, default: '' },
          divulgaNotas: String,
          codigoAvaliacaoParcial: Number,
          disciplina: String,
          subParciais: { type: Array, default: [] },
        },
      ],
      default: [],
    },
  },
};

const classSchema = mongoose.Schema(schema);

classSchema.index({ userId: 1, ano: 1, semester: 1 });

classSchema.statics.get = function get(query, cb) {
  const fields = {
    __v: 0,
    userId: 0,
    codigo: 0,
    codigoEnturmacao: 0,
    cursoId: 0,
    codigoDisciplina: 0,
    'notas.parciais.pesoParcial': 0,
    'notas.parciais.divulgaNotas': 0,
    'notas.parciais.codigoAvaliacaoParcial': 0,
    'notas.parciais.disciplina': 0,
    'notas.parciais._id': 0,
    'notas.parciais.subParciais': 0,
    'notas.parciais.legendaDispensaParcial': 0,
    'notas.parciais.descricaoDispensaParcial': 0,
  };

  return this.find(query, fields, cb);
};

module.exports = mongoose.model('Class', classSchema);
