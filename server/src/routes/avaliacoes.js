const express = require('express');
const router = express.Router();
const {
  getAvaliacoes,
  getAvaliacaoById,
  createAvaliacao,
  adicionarNota,
  getMediaAnual,
  updateAvaliacao,
  deleteAvaliacao,
  getHabilidadesDisponiveis,
  updateHabilidadesAvaliacao,
  getEvolucaoHabilidades,
  importarAvaliacoes
} = require('../controllers/avaliacaoController');
const { auth, isProfessorOrAdmin } = require('../middleware/auth');

router.use(auth);

router.route('/')
  .get(getAvaliacoes)
  .post(isProfessorOrAdmin, createAvaliacao);

router.post('/importar', isProfessorOrAdmin, importarAvaliacoes);
router.get('/habilidades-disponiveis', getHabilidadesDisponiveis);
router.get('/aluno/:alunoId/media-anual', getMediaAnual);
router.get('/aluno/:alunoId/evolucao-habilidades', getEvolucaoHabilidades);

router.route('/:id')
  .get(getAvaliacaoById)
  .put(isProfessorOrAdmin, updateAvaliacao)
  .delete(isProfessorOrAdmin, deleteAvaliacao);

router.post('/:id/notas', isProfessorOrAdmin, adicionarNota);
router.put('/:id/avaliacoes/:avaliacaoIndex/habilidades', isProfessorOrAdmin, updateHabilidadesAvaliacao);

module.exports = router;
