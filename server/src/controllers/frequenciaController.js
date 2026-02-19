const Frequencia = require('../models/Frequencia');
const Aluno = require('../models/Aluno');
const { paginate, paginatedResponse } = require('../utils/helpers');

// @desc    Listar frequências com filtros
// @route   GET /api/frequencias
exports.getFrequencias = async (req, res) => {
  try {
    const { page = 1, limit = 50, aluno, turma, disciplina, data, status, ano, mes, trimestre } = req.query;
    const { skip, limitNum, pageNum } = paginate(page, limit);
    
    const filter = { ativo: true };
    if (aluno) filter.aluno = aluno;
    if (turma) filter.turma = turma;
    if (disciplina) filter.disciplina = disciplina;
    if (data) filter.data = new Date(data);
    if (status) filter.status = status;
    if (ano) filter.ano = parseInt(ano);
    if (mes) filter.mes = parseInt(mes);
    if (trimestre) filter.trimestre = parseInt(trimestre);
    
    const [frequencias, total] = await Promise.all([
      Frequencia.find(filter)
        .populate('aluno', 'nome matricula')
        .populate('disciplina', 'nome codigo')
        .populate('turma', 'nome')
        .populate('professor', 'nome')
        .sort({ data: -1 })
        .skip(skip)
        .limit(limitNum),
      Frequencia.countDocuments(filter)
    ]);
    
    res.json(paginatedResponse(frequencias, pageNum, limitNum, total));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar frequências', error: error.message });
  }
};

// @desc    Registrar frequência (individual ou em lote)
// @route   POST /api/frequencias
exports.registrarFrequencia = async (req, res) => {
  try {
    const { registros } = req.body; // Array de registros ou registro único
    
    // Suporta registro único ou múltiplo
    const dadosParaRegistrar = Array.isArray(registros) ? registros : [req.body];
    
    const frequenciasCriadas = [];
    const erros = [];
    
    for (const registro of dadosParaRegistrar) {
      try {
        const { aluno, turma, disciplina, professor, data, status, observacao, periodo } = registro;
        
        // Verificar se já existe registro para esta data/aluno/disciplina
        const existente = await Frequencia.findOne({
          aluno,
          disciplina,
          data: new Date(data)
        });
        
        if (existente) {
          // Atualizar existente
          existente.status = status || existente.status;
          existente.observacao = observacao || existente.observacao;
          await existente.save();
          frequenciasCriadas.push(existente);
        } else {
          // Criar novo
          const frequencia = await Frequencia.create({
            aluno,
            turma,
            disciplina,
            professor,
            data: new Date(data),
            status: status || 'presente',
            observacao,
            periodo,
            ano: new Date(data).getFullYear(),
            registradoPor: req.user?._id
          });
          frequenciasCriadas.push(frequencia);
        }
      } catch (error) {
        erros.push({ registro, erro: error.message });
      }
    }
    
    if (erros.length > 0) {
      return res.status(207).json({
        message: 'Alguns registros falharam',
        sucesso: frequenciasCriadas.length,
        falhas: erros.length,
        frequencias: frequenciasCriadas,
        erros
      });
    }
    
    res.status(201).json({
      message: 'Frequência(s) registrada(s) com sucesso',
      total: frequenciasCriadas.length,
      frequencias: frequenciasCriadas
    });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao registrar frequência', error: error.message });
  }
};

// @desc    Registrar frequência da turma (chamada diária)
// @route   POST /api/frequencias/turma/:turmaId/chamada
exports.registrarChamadaTurma = async (req, res) => {
  try {
    const { turmaId } = req.params;
    const { data, disciplina, professor, periodo, presencas } = req.body;
    // presencas: { alunoId: 'presente' | 'falta' | 'falta-justificada' }
    
    const Turma = require('../models/Turma');
    const turma = await Turma.findById(turmaId).populate('alunos');
    
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }
    
    const frequenciasCriadas = [];
    
    for (const aluno of turma.alunos) {
      const status = presencas[aluno._id] || 'presente';
      
      const frequenciaData = {
        aluno: aluno._id,
        turma: turmaId,
        disciplina,
        professor,
        data: new Date(data),
        status,
        periodo,
        ano: new Date(data).getFullYear(),
        registradoPor: req.user?._id
      };
      
      // Verificar se já existe
      const existente = await Frequencia.findOne({
        aluno: aluno._id,
        disciplina,
        data: new Date(data)
      });
      
      if (existente) {
        existente.status = status;
        await existente.save();
        frequenciasCriadas.push(existente);
      } else {
        const frequencia = await Frequencia.create(frequenciaData);
        frequenciasCriadas.push(frequencia);
      }
    }
    
    res.status(201).json({
      message: 'Chamada registrada com sucesso',
      total: frequenciasCriadas.length,
      frequencias: frequenciasCriadas
    });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao registrar chamada', error: error.message });
  }
};

// @desc    Obter frequência de um aluno
// @route   GET /api/frequencias/aluno/:alunoId
exports.getFrequenciaAluno = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { ano, trimestre, disciplina, dataInicio, dataFim } = req.query;
    
    const filter = { aluno: alunoId, ativo: true };
    if (ano) filter.ano = parseInt(ano);
    if (trimestre) filter.trimestre = parseInt(trimestre);
    if (disciplina) filter.disciplina = disciplina;
    
    if (dataInicio && dataFim) {
      filter.data = {
        $gte: new Date(dataInicio),
        $lte: new Date(dataFim)
      };
    }
    
    const frequencias = await Frequencia.find(filter)
      .populate('disciplina', 'nome codigo')
      .populate('turma', 'nome')
      .sort({ data: -1 });
    
    // Calcular estatísticas
    const total = frequencias.length;
    const presencas = frequencias.filter(f => f.status === 'presente').length;
    const faltas = frequencias.filter(f => f.status === 'falta').length;
    const faltasJustificadas = frequencias.filter(f => f.status === 'falta-justificada').length;
    const percentualPresenca = total > 0 ? ((presencas / total) * 100).toFixed(2) : 100;
    
    const statusFrequencia = Frequencia.getStatusFrequencia(parseFloat(percentualPresenca));
    
    res.json({
      frequencias,
      estatisticas: {
        total,
        presencas,
        faltas,
        faltasJustificadas,
        percentualPresenca: parseFloat(percentualPresenca),
        status: statusFrequencia
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar frequência do aluno', error: error.message });
  }
};

// @desc    Obter resumo de frequência da turma por dia
// @route   GET /api/frequencias/turma/:turmaId/dia/:data
exports.getFrequenciaTurmaDia = async (req, res) => {
  try {
    const { turmaId, data } = req.params;
    const { disciplina } = req.query;
    
    const filter = {
      turma: turmaId,
      data: new Date(data),
      ativo: true
    };
    
    if (disciplina) filter.disciplina = disciplina;
    
    const frequencias = await Frequencia.find(filter)
      .populate('aluno', 'nome matricula')
      .populate('disciplina', 'nome');
    
    const resumo = {
      total: frequencias.length,
      presentes: frequencias.filter(f => f.status === 'presente').length,
      faltas: frequencias.filter(f => f.status === 'falta').length,
      faltasJustificadas: frequencias.filter(f => f.status === 'falta-justificada').length,
      percentualPresenca: 0
    };
    
    resumo.percentualPresenca = resumo.total > 0 
      ? ((resumo.presentes / resumo.total) * 100).toFixed(2) 
      : 0;
    
    res.json({
      data: new Date(data),
      resumo,
      frequencias
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar frequência da turma', error: error.message });
  }
};

// @desc    Dashboard de frequência
// @route   GET /api/frequencias/dashboard
exports.getDashboardFrequencia = async (req, res) => {
  try {
    const { turma, ano, trimestre, dataInicio, dataFim } = req.query;
    
    const filter = { ativo: true };
    if (turma) filter.turma = turma;
    if (ano) filter.ano = parseInt(ano);
    if (trimestre) filter.trimestre = parseInt(trimestre);
    
    if (dataInicio && dataFim) {
      filter.data = {
        $gte: new Date(dataInicio),
        $lte: new Date(dataFim)
      };
    }
    
    // Estatísticas gerais
    const [total, presencas, faltas, faltasJustificadas] = await Promise.all([
      Frequencia.countDocuments(filter),
      Frequencia.countDocuments({ ...filter, status: 'presente' }),
      Frequencia.countDocuments({ ...filter, status: 'falta' }),
      Frequencia.countDocuments({ ...filter, status: 'falta-justificada' })
    ]);
    
    const percentualPresenca = total > 0 ? ((presencas / total) * 100).toFixed(2) : 100;
    
    // Alunos com frequência crítica (abaixo de 75%)
    const alunosComFalta = await Frequencia.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$aluno',
          totalAulas: { $sum: 1 },
          presencas: {
            $sum: { $cond: [{ $eq: ['$status', 'presente'] }, 1, 0] }
          },
          faltas: {
            $sum: { $cond: [{ $in: ['$status', ['falta', 'falta-justificada']] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          percentualPresenca: {
            $multiply: [
              { $divide: ['$presencas', '$totalAulas'] },
              100
            ]
          }
        }
      },
      { $match: { percentualPresenca: { $lt: 75 } } },
      { $sort: { percentualPresenca: 1 } },
      { $limit: 10 }
    ]);
    
    // Popular dados dos alunos
    await Aluno.populate(alunosComFalta, { path: '_id', select: 'nome matricula' });
    
    // Frequência por dia da semana
    const frequenciaPorDia = await Frequencia.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dayOfWeek: '$data' },
          total: { $sum: 1 },
          presencas: {
            $sum: { $cond: [{ $eq: ['$status', 'presente'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      estatisticasGerais: {
        total,
        presencas,
        faltas,
        faltasJustificadas,
        percentualPresenca: parseFloat(percentualPresenca)
      },
      alunosCriticos: alunosComFalta.map(a => ({
        aluno: a._id,
        totalAulas: a.totalAulas,
        presencas: a.presencas,
        faltas: a.faltas,
        percentual: a.percentualPresenca.toFixed(2),
        status: Frequencia.getStatusFrequencia(a.percentualPresenca)
      })),
      frequenciaPorDiaSemana: frequenciaPorDia
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar dashboard', error: error.message });
  }
};

// @desc    Justificar falta
// @route   PUT /api/frequencias/:id/justificar
exports.justificarFalta = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, anexo } = req.body;
    
    const frequencia = await Frequencia.findById(id);
    
    if (!frequencia) {
      return res.status(404).json({ message: 'Frequência não encontrada' });
    }
    
    await frequencia.justificarFalta(descricao, anexo);
    
    res.json({
      message: 'Falta justificada com sucesso',
      frequencia
    });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao justificar falta', error: error.message });
  }
};

// @desc    Atualizar frequência
// @route   PUT /api/frequencias/:id
exports.updateFrequencia = async (req, res) => {
  try {
    const frequencia = await Frequencia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('aluno disciplina turma');
    
    if (!frequencia) {
      return res.status(404).json({ message: 'Frequência não encontrada' });
    }
    
    res.json(frequencia);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar frequência', error: error.message });
  }
};

// @desc    Deletar frequência
// @route   DELETE /api/frequencias/:id
exports.deleteFrequencia = async (req, res) => {
  try {
    const frequencia = await Frequencia.findByIdAndUpdate(
      req.params.id,
      { ativo: false },
      { new: true }
    );
    
    if (!frequencia) {
      return res.status(404).json({ message: 'Frequência não encontrada' });
    }
    
    res.json({ message: 'Frequência removida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar frequência', error: error.message });
  }
};
