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
      defaults: [],
    },
  },
};

const classSchema = mongoose.Schema(schema);

classSchema.index({ userId: 1, ano: 1, semester: 1 });

module.exports = mongoose.model('Class', classSchema);
