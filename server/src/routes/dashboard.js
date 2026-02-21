const express = require('express');
const router = express.Router();
const {
  getEstatisticas,
  getDesempenhoPorDisciplina,
  getEvolucaoTrimestral,
  getAlunosEmRisco,
  getHabilidadesDesenvolvidas,
  getEvolucaoHabilidades,
  getDistribuicaoNiveisHabilidades,
  getContagemAlunos
} = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/estatisticas', getEstatisticas);
router.get('/desempenho-disciplina', getDesempenhoPorDisciplina);
router.get('/evolucao-trimestral', getEvolucaoTrimestral);
router.get('/alunos-risco', getAlunosEmRisco);
router.get('/habilidades-desenvolvidas', getHabilidadesDesenvolvidas);
router.get('/evolucao-habilidades', getEvolucaoHabilidades);
router.get('/distribuicao-niveis-habilidades', getDistribuicaoNiveisHabilidades);
router.get('/contagem-alunos', getContagemAlunos);

module.exports = router;
