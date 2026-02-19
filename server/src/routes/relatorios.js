const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const { auth } = require('../middleware/auth');

/**
 * @route   GET /api/relatorios/boletim/:alunoId
 * @desc    Gera boletim individual do aluno em PDF
 * @access  Private
 * @query   ano - Ano letivo (opcional)
 */
router.get('/boletim/:alunoId', auth, relatorioController.gerarBoletimAluno);

/**
 * @route   GET /api/relatorios/desempenho-turma/:turmaId
 * @desc    Gera relatório de desempenho da turma em PDF
 * @access  Private
 * @query   disciplinaId, trimestre, ano (opcionais)
 */
router.get('/desempenho-turma/:turmaId', auth, relatorioController.gerarRelatorioTurma);

/**
 * @route   GET /api/relatorios/matriz-habilidades/:alunoId
 * @desc    Retorna matriz de habilidades do aluno (JSON)
 * @access  Private
 * @query   ano, turmaId, disciplinaId (opcionais)
 */
router.get('/matriz-habilidades/:alunoId', auth, relatorioController.gerarMatrizHabilidades);

/**
 * @route   GET /api/relatorios/mapa-calor/:turmaId
 * @desc    Retorna mapa de calor de habilidades da turma (JSON)
 * @access  Private
 * @query   disciplinaId, trimestre (opcionais)
 */
router.get('/mapa-calor/:turmaId', auth, relatorioController.gerarMapaCalor);

/**
 * @route   GET /api/relatorios/habilidades-nao-trabalhadas/:turmaId
 * @desc    Lista habilidades não trabalhadas na turma
 * @access  Private
 * @query   disciplinaId, trimestre (opcionais)
 */
router.get('/habilidades-nao-trabalhadas/:turmaId', auth, relatorioController.getHabilidadesNaoTrabalhadas);

module.exports = router;
