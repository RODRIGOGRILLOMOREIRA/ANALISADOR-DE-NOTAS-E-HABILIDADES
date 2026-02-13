const express = require('express');
const router = express.Router();
const {
  getProfessores,
  getProfessorById,
  createProfessor,
  updateProfessor,
  deleteProfessor
} = require('../controllers/professorController');
const { auth, isAdmin } = require('../middleware/auth');

router.use(auth); // Todas as rotas requerem autenticação

router.route('/')
  .get(getProfessores)
  .post(isAdmin, createProfessor);

router.route('/:id')
  .get(getProfessorById)
  .put(isAdmin, updateProfessor)
  .delete(isAdmin, deleteProfessor);

module.exports = router;
