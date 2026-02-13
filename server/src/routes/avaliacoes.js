const express = require('express');
const router = express.Router();
const {
  getAvaliacoes,
  getAvaliacaoById,
  createAvaliacao,
  adicionarNota,
  getMediaAnual,
  updateAvaliacao,
  deleteAvaliacao
} = require('../controllers/avaliacaoController');
const { auth, isProfessorOrAdmin } = require('../middleware/auth');

router.use(auth);

router.route('/')
  .get(getAvaliacoes)
  .post(isProfessorOrAdmin, createAvaliacao);

router.get('/aluno/:alunoId/media-anual', getMediaAnual);

router.route('/:id')
  .get(getAvaliacaoById)
  .put(isProfessorOrAdmin, updateAvaliacao)
  .delete(isProfessorOrAdmin, deleteAvaliacao);

router.post('/:id/notas', isProfessorOrAdmin, adicionarNota);

module.exports = router;
