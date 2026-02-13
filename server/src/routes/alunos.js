const express = require('express');
const router = express.Router();
const {
  getAlunos,
  getAlunoById,
  createAluno,
  updateAluno,
  deleteAluno
} = require('../controllers/alunoController');
const { auth, isAdmin } = require('../middleware/auth');

router.use(auth);

router.route('/')
  .get(getAlunos)
  .post(isAdmin, createAluno);

router.route('/:id')
  .get(getAlunoById)
  .put(isAdmin, updateAluno)
  .delete(isAdmin, deleteAluno);

module.exports = router;
