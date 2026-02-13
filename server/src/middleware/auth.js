const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Pegar token do header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário
    const user = await User.findById(decoded.id);

    if (!user || !user.ativo) {
      return res.status(401).json({ message: 'Usuário não encontrado ou inativo.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};

// Middleware para verificar se é admin
const isAdmin = (req, res, next) => {
  if (req.user.tipo !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Middleware para verificar se é professor ou admin
const isProfessorOrAdmin = (req, res, next) => {
  if (req.user.tipo !== 'professor' && req.user.tipo !== 'admin' && req.user.tipo !== 'coordenador') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }
  next();
};

module.exports = { auth, isAdmin, isProfessorOrAdmin };
