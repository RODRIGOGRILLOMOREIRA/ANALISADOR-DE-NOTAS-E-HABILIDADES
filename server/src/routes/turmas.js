const express = require('express');
const router = express.Router();
const {
  getTurmas,
  getTurmaById,
  createTurma,
  updateTurma,
  deleteTurma
} = require('../controllers/turmaController');
const { auth, isAdmin } = require('../middleware/auth');

router.use(auth);

router.route('/')
  .get(getTurmas)
  .post(isAdmin, createTurma);

router.route('/:id')
  .get(getTurmaById)
  .put(isAdmin, updateTurma)
  .delete(isAdmin, deleteTurma);

module.exports = router;
