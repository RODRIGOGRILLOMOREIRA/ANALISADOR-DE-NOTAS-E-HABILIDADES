const express = require('express');
const router = express.Router();
const {
  getDisciplinas,
  getDisciplinaById,
  createDisciplina,
  updateDisciplina,
  deleteDisciplina
} = require('../controllers/disciplinaController');
const { auth, isAdmin } = require('../middleware/auth');

router.use(auth);

router.route('/')
  .get(getDisciplinas)
  .post(isAdmin, createDisciplina);

router.route('/:id')
  .get(getDisciplinaById)
  .put(isAdmin, updateDisciplina)
  .delete(isAdmin, deleteDisciplina);

module.exports = router;
