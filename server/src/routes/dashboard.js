const express = require('express');
const router = express.Router();
const {
  getEstatisticas,
  getDesempenhoPorDisciplina,
  getEvolucaoTrimestral,
  getAlunosEmRisco,
  getHabilidadesDesenvolvidas
} = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/estatisticas', getEstatisticas);
router.get('/desempenho-disciplina', getDesempenhoPorDisciplina);
router.get('/evolucao-trimestral', getEvolucaoTrimestral);
router.get('/alunos-risco', getAlunosEmRisco);
router.get('/habilidades-desenvolvidas', getHabilidadesDesenvolvidas);

module.exports = router;
