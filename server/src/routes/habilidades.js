const express = require('express');
const router = express.Router();
const {
  getHabilidades,
  getHabilidadeById,
  createHabilidade,
  updateDesempenhoAluno,
  updateHabilidade,
  deleteHabilidade
} = require('../controllers/habilidadeController');
const { auth, isProfessorOrAdmin } = require('../middleware/auth');

router.use(auth);

router.route('/')
  .get(getHabilidades)
  .post(isProfessorOrAdmin, createHabilidade);

router.put('/:id/desempenho', isProfessorOrAdmin, updateDesempenhoAluno);

router.route('/:id')
  .get(getHabilidadeById)
  .put(isProfessorOrAdmin, updateHabilidade)
  .delete(isProfessorOrAdmin, deleteHabilidade);

module.exports = router;
