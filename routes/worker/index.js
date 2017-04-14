/* eslint no-underscore-dangle: ["error", { "allow": ["_doc", "_id"] }],
          no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["d"] }]
*/
const debug = require('debug')('easyacapi');
const deepEqual = require('deep-equal');
// const diff = require('deep-diff');
const UserModel = require('../../models/user');
const ClassModel = require('../../models/class');
const NRP = require('../../config/nrp');

function updateSyncStatus(userId) {
  const query = { _id: userId };
  const update = {
    $currentDate: {
      lastModified: true,
      'senacCredentials.lastSync': { $type: 'date' },
    },
    $set: {
      'senacCredentials.isSyncing': false,
    },
  };
  UserModel.update(query, update, debug);
}

NRP.on('api:save-cookie', (data) => {
  const query = { 'senacCredentials.username': data.username };
  const update = {
    $set: {
      'senacCredentials.cookie': data.cookie,
    },
  };

  UserModel.update(query, update, (err) => {
    if (err) debug(err);
    else debug(`Saved cookie for ${data.username}`);
  });
});


NRP.on('api:save-classes', (res) => {
  const { username, data } = res;

  // Find User by Username
  UserModel.findByUsername(username, (userErr, user) => {
    if (userErr) debug(userErr);
    const disciplinas = [];

    // Normalize Classes
    data.turmas.forEach((turma) => {
      const { codigo, codigoEnturmacao, cursoId, ano, semestre, periodo, descricao } = turma;

      turma.disciplinas.forEach((d) => {
        const disciplina = {
          codigo,
          codigoEnturmacao,
          cursoId,
          ano,
          semestre,
          periodo,
          descricao,
          userId: user._id,
        };
        Object.assign(disciplina, d);

        disciplinas.push(disciplina);
      });
    });

    disciplinas.forEach((d) => {
      const { ano, semestre, userId, codigoDisciplina } = d;
      const query = { ano, semestre, userId, codigoDisciplina };
      const fields = { 'notas.parciais._id': 0 };

      // Verify if class already exists
      ClassModel.findOne(query, fields, (findErr, classData) => {
        if (findErr) debug(findErr);
        if (!d.notas.parciais) d.notas.parciais = [];

        // create one if not
        if (!classData) {
          const classModel = new ClassModel(d);
          classModel.save(debug);
        } else {
          // verify if absenses are the same and update if needed
          if (classData.faltas.total !== d.faltas.total) {
            const update = { $set: { 'faltas.total': d.faltas.total } };
            debug('New absense value (%s) for User(%s)', d.faltas.total, d.userId);
            ClassModel.update(query, update, debug);
          }

          // verify if final grade or partials needs update
          const classDataObject = classData.toObject();
          const isEqualPartials = deepEqual(classDataObject.notas, d.notas, { strict: true });
          const isEqualFinalGrade = classData.notas.conceito === d.notas.conceito;
          if (!isEqualPartials || !isEqualFinalGrade) {
            const update = { $set: { notas: d.notas } };
            debug('New grade value (%s) for User(%s)', d.notas.conceito, d.userId);
            ClassModel.update(query, update, debug);
          }
        }
      });
    });
    updateSyncStatus(user._id);
  });
});
