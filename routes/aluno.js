'use strict';

var express   = require('express');
var router    = express.Router();
const Easyac  = require('easyac-crawler');
var Aluno = require('../models/aluno');
var Nota = require('../models/nota');
var Falta = require('../models/falta');

const getToken = (req) => {
  let auth = req.headers.authorization;
  let reg = /Bearer (.*)/ig;
  let matched = reg.exec(auth);
  return matched[1];
};

router.get('/faltas', (req, res) => {
  let token = getToken(req);
  let query = {webToken: token};

  Aluno.findOne(query, (err, aluno) => {
    if(!aluno){
      res.status(402).send(err);
      return;
    }
    let queryFalta = {alunoId: aluno._id};
    let filterFields = {alunoId: 0, _id: 0, __v: 0};

    Falta.find(queryFalta, filterFields, (err, faltas) => {
      if(err) res.send(err);
      res.send(faltas);
    });
  });


});

// router.get('/faltas', (req, res) => {
//   let token = getToken(req);
//   let query = {webToken: token};

//   Falta.find(query, (faltas) => {
//     res.send(faltas);
//   });
// });


router.get('/scrap/notas', (req, res) => {
  let token = getToken(req);
  let query = {webToken: token};

  Aluno.findOne(query, (err, alunoDB) => {
    if(err || !alunoDB.cookie) throw err;

    let AlunoBot = Easyac.aluno(alunoDB.cookie);

    AlunoBot.get()
    .then(() => {
      return AlunoBot.getTurmas();
    })
    .then((data) => {
      Aluno.update(query, { code: data.codigo});

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

          let nota = new Nota({
            'alunoId': alunoDB._id,
            'cursoId': turma.cursoId,
            'ano': turma.ano,
            'semestre': turma.semestre,
            'disciplina': disc.descricaoDisciplina,
            'conceito': disc.notas.conceito,
            'parciais': parciais
          });

          nota.save();
        });
      });

      Aluno.update(query, { lastSearch: new Date()});
      res.send(data);
    })
    .catch((err) => console.log(err));

  });
});

router.get('/scrap/faltas', (req, res) => {
  let token = getToken(req);
  let query = {webToken: token};

  Aluno.findOne(query, (err, alunoDB) => {
    if(err || !alunoDB.cookie) throw err;

    let AlunoBot = Easyac.aluno(alunoDB.cookie);

    AlunoBot.get()
    .then(() => {
      return AlunoBot.getTurmas();
    })
    .then((data) => {
      Aluno.update(query, { code: data.codigo});

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

      Aluno.update(query, { lastSearch: new Date()});
      res.send(data);
    })
    .catch((err) => console.log(err));

  });
});



module.exports = router;


