const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Gerar token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Registrar novo usuário
// @route   POST /api/auth/register
// @access  Public (pode ser restrito a admin depois)
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    // Verificar se usuário já existe
    const userExiste = await User.findOne({ email });
    
    if (userExiste) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criar usuário
    const user = await User.create({
      nome,
      email,
      senha,
      tipo: tipo || 'professor'
    });

    res.status(201).json({
      _id: user._id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      token: gerarToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};

// @desc    Login de usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Buscar usuário com senha
    const user = await User.findOne({ email }).select('+senha');

    if (!user || !user.ativo) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaCorreta = await user.compararSenha(senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    res.json({
      _id: user._id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      token: gerarToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

// @desc    Obter usuário atual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
  }
};
// @desc    Alterar senha
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;

    // Buscar usuário com senha
    const user = await User.findById(req.user.id).select('+senha');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar senha atual
    const senhaCorreta = await user.compararSenha(senhaAtual);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }

    // Atualizar senha
    user.senha = novaSenha;
    await user.save();

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao alterar senha', error: error.message });
  }
};