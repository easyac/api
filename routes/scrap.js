'use strict';

var express = require('express');
var jwt = require('jsonwebtoken');
var Auth = require('../config/auth');
var Aluno = require('../models/aluno');
var Nota = require('../models/nota');
var Falta = require('../models/falta');
const Easyac = require('easyac-crawler');
var router = express.Router();

const getToken = (req) => {
  let auth = req.headers.authorization;
  let reg = /Bearer (.*)/ig;
  let matched = reg.exec(auth);
  return matched[1];
};

router.get('/notas', (req, res) => {
  const token = getToken(req);
  const payload = jwt.verify(token, Auth.jwtSecret);
  let query = { _id: payload.id };


  Aluno.findOne(query, (err, alunoDB) => {
    if(err || !alunoDB || !alunoDB.cookie) {
      res.status(404).send('Aluno not Found');
      return;
    }

    let AlunoBot = Easyac.aluno(alunoDB.cookie);

    AlunoBot.get()
    .then(() => {
      return AlunoBot.getTurmas();
    })
    .then((data) => {
      Aluno.update(query, { code: data.codigo }, { multi: true });

      data.turmas.forEach((turma) => {
        turma.disciplinas.forEach((disc) => {
          let parciais = [];

          if(disc.notas.parciais){
            parciais = disc.notas.parciais.map((nota) => {
              return {
                'descricao': nota.descricao,
                'ordemParcial': nota.ordemParcial,
                'valorAvaliacaoParcial': nota.valorAvaliacaoParcial,
              };
            });
          }

          const notaData = {
            'alunoId': alunoDB._id,
            'cursoId': turma.cursoId,
            'ano': turma.ano,
            'semestre': turma.semestre,
            'disciplina': disc.descricaoDisciplina,
            'conceito': disc.notas.conceito,
            'parciais': parciais
          };

          let nota = new Nota(notaData);

          nota.save();
        });
      });

      Aluno.update(query, { lastSearch: new Date() }, { multi: true });
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        msg: err
      });
    });
  });


});

router.get('/faltas', (req, res) => {
  const token = getToken(req);
  const payload = jwt.verify(token, Auth.jwtSecret);
  let query = { _id: payload.id };

  Aluno.findOne(query, (err, alunoDB) => {
    if(err || !alunoDB || !alunoDB.cookie) {
      res.status(404).send('Aluno not Found');
      return;
    }

    let AlunoBot = Easyac.aluno(alunoDB.cookie);

    AlunoBot.get()
    .then(() => {
      return AlunoBot.getTurmas();
    })
    .then((data) => {
      Aluno.update(query, { code: data.codigo });

      data.turmas.forEach((turma) => {
        turma.disciplinas.forEach((disc) => {

          let falta = new Falta({
            'alunoId': alunoDB._id,
            'cursoId': turma.cursoId,
            'ano': turma.ano,
            'semestre': turma.semestre,
            'disciplina': disc.descricaoDisciplina,
            'faltas': disc.faltas.total
          });

          falta.save();
        });
      });

      Aluno.update(query, { lastSearch: new Date() });
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        msg: err
      });
    });

  });

});



module.exports = router;


