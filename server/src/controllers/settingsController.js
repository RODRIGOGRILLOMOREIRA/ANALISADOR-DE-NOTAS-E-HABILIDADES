const SchoolSettings = require('../models/SchoolSettings');

// @desc    Obter configurações da escola
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    const settings = await SchoolSettings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar configurações', error: error.message });
  }
};

// @desc    Atualizar configurações da escola
// @route   PUT /api/settings
// @access  Private (Admin only)
exports.updateSettings = async (req, res) => {
  try {
    const settings = await SchoolSettings.updateSettings(req.body);
    res.json({ message: 'Configurações atualizadas com sucesso', settings });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar configurações', error: error.message });
  }
};

// @desc    Upload de logo da escola
// @route   POST /api/settings/logo
// @access  Private (Admin only)
exports.uploadLogo = async (req, res) => {
  try {
    const { logo } = req.body; // Base64 ou URL da logo
    
    if (!logo) {
      return res.status(400).json({ message: 'Logo não fornecida' });
    }

    // Validar tamanho do Base64 (aproximadamente 2MB)
    if (logo.length > 3000000) {
      return res.status(400).json({ message: 'Imagem muito grande. Máximo 2MB.' });
    }

    const settings = await SchoolSettings.getSettings();
    settings.logo = logo;
    await settings.save();

    // Retornar o objeto completo de settings
    res.json({ 
      message: 'Logo atualizada com sucesso', 
      settings: settings.toObject() 
    });
  } catch (error) {
    console.error('Erro no uploadLogo:', error);
    res.status(500).json({ message: 'Erro ao fazer upload da logo', error: error.message });
  }
};

// @desc    Remover logo da escola
// @route   DELETE /api/settings/logo
// @access  Private (Admin only)
exports.deleteLogo = async (req, res) => {
  try {
    const settings = await SchoolSettings.getSettings();
    settings.logo = null;
    await settings.save();

    res.json({ 
      message: 'Logo removida com sucesso',
      settings: settings.toObject()
    });
  } catch (error) {
    console.error('Erro no deleteLogo:', error);
    res.status(500).json({ message: 'Erro ao remover logo', error: error.message });
  }
};
