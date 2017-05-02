/* eslint no-underscore-dangle: ["error", { "allow": ["_doc", "_id"] }],
          no-param-reassign: ["error", {
            "props": true,
            "ignorePropertyModificationsFor": ["newerData"]
          }]
*/
const debug = require('debug')('easyacapi');
const deepEqual = require('deep-equal');
const UserModel = require('../../models/user');
const ClassModel = require('../../models/class');
// const queue = require('../../config/queue');

module.exports = (job, done) => {
  const { username, data } = job.data;

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

  function normalizeClasses(turmas, userId) {
    const disciplinas = [];
    turmas.forEach((turma) => {
      const { codigo, codigoEnturmacao, cursoId, ano, semestre, periodo, descricao } = turma;
      const turmaDisciplinas = turma.disciplinas || [];

      turmaDisciplinas.forEach((d) => {
        const disciplina = {
          codigo,
          codigoEnturmacao,
          cursoId,
          ano,
          semestre,
          periodo,
          descricao,
          userId,
        };
        Object.assign(disciplina, d);

        disciplinas.push(disciplina);
      });
    });

    return disciplinas;
  }

  function findClass(query, fields) {
    return new Promise((resolve, reject) => {
      ClassModel.findOne(query, fields, (findErr, classData) => {
        if (findErr) reject(findErr);
        else resolve(classData);
      });
    });
  }

  function verifyAbsenses(olderData, newerData, cb) {
    const isEqualTotalFaltas = olderData.faltas.total === newerData.faltas.total;
    const isEqualApsFaltas = olderData.faltas.aps === newerData.faltas.aps;

    if (!isEqualTotalFaltas || !isEqualApsFaltas) {
      cb(newerData);
    }
  }

  function updateAbsenses(query, newerData) {
    const update = {
      $set: {
        'faltas.total': newerData.faltas.total,
        'faltas.aps': newerData.faltas.aps,
      },
    };
    ClassModel.update(query, update, (err) => {
      if (err) debug(err);
      debug('[%s] new absense %s (APS: %s) for User(%s)',
        newerData.descricaoDisciplina,
        newerData.faltas.total,
        newerData.faltas.aps,
        newerData.userId);
    });
  }

  function verifyGrades(olderData, newerData, cb) {
    const olderDataObject = olderData.toObject();
    const isEqualPartials = deepEqual(olderDataObject.notas, newerData.notas);
    const isEqualFinalGrade = olderData.notas.conceito === newerData.notas.conceito;
    if (!isEqualPartials || !isEqualFinalGrade) {
      cb(newerData);
    }
  }

  function updateGrades(query, newerData) {
    const update = { $set: { notas: newerData.notas } };
    ClassModel.update(query, update, (err) => {
      if (err) debug(err);
      debug('[%s] new grade value (%s) for User(%s)',
        newerData.descricaoDisciplina,
        newerData.notas.conceito,
        newerData.userId);
    });
  }

  UserModel.findByUsername(username, (userErr, user) => {
    if (!user || userErr) {
      debug(userErr);
      return;
    }

    const disciplinas = normalizeClasses(data.turmas, user._id);
    disciplinas.forEach((newerData) => {
      const { ano, semestre, userId, descricaoDisciplina } = newerData;
      const query = { ano, semestre, userId, descricaoDisciplina };
      const fields = { 'notas.parciais._id': 0 };
      if (!newerData.notas.parciais) newerData.notas.parciais = [];

      // Verify if class already exists
      findClass(query, fields)
      .then((classData) => {
        // create one if not
        if (!classData) {
          const classModel = new ClassModel(newerData);
          classModel.save();
          done();
        } else {
          verifyAbsenses(classData, newerData, () => {
            updateAbsenses(query, newerData);
          });

          verifyGrades(classData, newerData, () => {
            updateGrades(query, newerData);
          });
          done();
        }
      })
      .catch(debug);
    });

    updateSyncStatus(user._id);
  });
};
