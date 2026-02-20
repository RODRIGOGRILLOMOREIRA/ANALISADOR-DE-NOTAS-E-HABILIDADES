const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  uploadLogo,
  deleteLogo
} = require('../controllers/settingsController');
const { auth, isAdmin } = require('../middleware/auth');

// Rota pública para obter configurações (precisa da logo e nome para exibir)
router.get('/', getSettings);

// Rotas protegidas (apenas admin)
router.put('/', auth, isAdmin, updateSettings);
router.post('/logo', auth, isAdmin, uploadLogo);
router.delete('/logo', auth, isAdmin, deleteLogo);

module.exports = router;
