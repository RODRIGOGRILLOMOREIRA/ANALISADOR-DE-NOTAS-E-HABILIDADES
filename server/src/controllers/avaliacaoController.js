const Avaliacao = require('../models/Avaliacao');
const { paginate, paginatedResponse } = require('../utils/helpers');

// @desc    Listar avaliações com filtros
// @route   GET /api/avaliacoes
exports.getAvaliacoes = async (req, res) => {
  try {
    const { page = 1, limit = 20, aluno, turma, disciplina, ano, trimestre } = req.query;
    const { skip, limitNum, pageNum } = paginate(page, limit);
    
    const filter = {};
    if (aluno) filter.aluno = aluno;
    if (turma) filter.turma = turma;
    if (disciplina) filter.disciplina = disciplina;
    if (ano) filter.ano = parseInt(ano);
    if (trimestre) filter.trimestre = parseInt(trimestre);
    
    const [avaliacoes, total] = await Promise.all([
      Avaliacao.find(filter)
        .populate('aluno', 'nome matricula')
        .populate('disciplina', 'nome codigo')
        .populate('turma', 'nome')
        .populate('professor', 'nome')
        .sort({ ano: -1, trimestre: -1 })
        .skip(skip)
        .limit(limitNum),
      Avaliacao.countDocuments(filter)
    ]);
    
    res.json(paginatedResponse(avaliacoes, pageNum, limitNum, total));
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar avaliações', error: error.message });
  }
};

// @desc    Buscar avaliação por ID
// @route   GET /api/avaliacoes/:id
exports.getAvaliacaoById = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.findById(req.params.id)
      .populate('aluno')
      .populate('disciplina')
      .populate('turma')
      .populate('professor');
    
    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    res.json(avaliacao);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar avaliação', error: error.message });
  }
};

// @desc    Criar ou atualizar avaliação
// @route   POST /api/avaliacoes
exports.createAvaliacao = async (req, res) => {
  try {
    const { aluno, disciplina, turma, ano, trimestre } = req.body;
    
    // Verificar se já existe avaliação para este aluno/disciplina/trimestre
    let avaliacao = await Avaliacao.findOne({
      aluno,
      disciplina,
      turma,
      ano,
      trimestre
    });
    
    if (avaliacao) {
      // Atualizar existente - usar objeto e .save() para disparar hooks
      Object.assign(avaliacao, req.body);
      await avaliacao.save();
    } else {
      // Criar nova
      avaliacao = await Avaliacao.create(req.body);
    }
    
    // Repopular para retornar dados completos
    avaliacao = await Avaliacao.findById(avaliacao._id)
      .populate('aluno', 'nome matricula')
      .populate('disciplina', 'nome codigo')
      .populate('turma', 'nome')
      .populate('professor', 'nome');
    
    res.status(201).json(avaliacao);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar avaliação', error: error.message });
  }
};

// @desc    Adicionar nota a uma avaliação existente
// @route   POST /api/avaliacoes/:id/notas
exports.adicionarNota = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.findById(req.params.id);
    
    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    
    avaliacao.avaliacoes.push(req.body);
    await avaliacao.save();
    
    res.json(avaliacao);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao adicionar nota', error: error.message });
  }
};

// @desc    Calcular média anual do aluno
// @route   GET /api/avaliacoes/aluno/:alunoId/media-anual
exports.getMediaAnual = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { disciplina, ano } = req.query;
    
    const avaliacoes = await Avaliacao.find({
      aluno: alunoId,
      disciplina,
      ano,
      trimestre: { $in: [1, 2, 3] }
    }).sort({ trimestre: 1 });
    
    if (avaliacoes.length === 0) {
      return res.json({ mediaAnual: 0, avaliacoes: [] });
    }
    
    // Criar objeto com notas por trimestre
    const notasPorTrimestre = {};
    avaliacoes.forEach(av => {
      if (av.notaTrimestre !== null && av.notaTrimestre !== undefined) {
        notasPorTrimestre[av.trimestre] = av.notaTrimestre;
      }
    });
    
    // Fórmula com pesos: (T1×3 + T2×3 + T3×4) / 10
    const t1 = notasPorTrimestre[1] || 0;
    const t2 = notasPorTrimestre[2] || 0;
    const t3 = notasPorTrimestre[3] || 0;
    
    const mediaAnual = ((t1 * 3) + (t2 * 3) + (t3 * 4)) / 10;
    
    res.json({
      mediaAnual: mediaAnual.toFixed(2),
      trimestres: {
        primeiro: t1,
        segundo: t2,
        terceiro: t3
      },
      avaliacoes: avaliacoes.map(av => ({
        trimestre: av.trimestre,
        notaTrimestre: av.notaTrimestre,
        avaliacoes: av.avaliacoes
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao calcular média anual', error: error.message });
  }
};

// @desc    Atualizar avaliação
// @route   PUT /api/avaliacoes/:id
exports.updateAvaliacao = async (req, res) => {
  try {
    let avaliacao = await Avaliacao.findById(req.params.id);
    
    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    
    // Atualizar usando Object.assign e .save() para disparar hooks
    Object.assign(avaliacao, req.body);
    await avaliacao.save();
    
    // Repopular para retornar dados completos
    avaliacao = await Avaliacao.findById(avaliacao._id)
      .populate('aluno', 'nome matricula')
      .populate('disciplina', 'nome codigo')
      .populate('turma', 'nome')
      .populate('professor', 'nome');
    
    res.json(avaliacao);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar avaliação', error: error.message });
  }
};

// @desc    Deletar avaliação
// @route   DELETE /api/avaliacoes/:id
exports.deleteAvaliacao = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.findByIdAndDelete(req.params.id);
    
    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar avaliação', error: error.message });
  }
};

// @desc    Buscar habilidades disponíveis para uma avaliação
// @route   GET /api/avaliacoes/habilidades-disponiveis
exports.getHabilidadesDisponiveis = async (req, res) => {
  try {
    const { disciplina, turma, ano, trimestre } = req.query;
    const Habilidade = require('../models/Habilidade');
    
    const filter = { ativo: true };
    if (disciplina) filter.disciplina = disciplina;
    if (turma) filter.turma = turma;
    if (ano) filter.ano = parseInt(ano);
    if (trimestre) filter.trimestre = parseInt(trimestre);
    
    const habilidades = await Habilidade.find(filter)
      .populate('disciplina', 'nome codigo')
      .select('codigo descricao disciplina ano trimestre');
    
    res.json(habilidades);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar habilidades', error: error.message });
  }
};

// @desc    Atualizar habilidades em uma avaliação específica
// @route   PUT /api/avaliacoes/:id/avaliacoes/:avaliacaoIndex/habilidades
exports.updateHabilidadesAvaliacao = async (req, res) => {
  try {
    const { id, avaliacaoIndex } = req.params;
    const { habilidades } = req.body; // Array de { habilidade, nivel, observacao }
    
    const avaliacao = await Avaliacao.findById(id);
    
    if (!avaliacao) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }
    
    if (!avaliacao.avaliacoes[avaliacaoIndex]) {
      return res.status(404).json({ message: 'Item de avaliação não encontrado' });
    }
    
    avaliacao.avaliacoes[avaliacaoIndex].habilidades = habilidades;
    await avaliacao.save();
    
    // Repopular para retornar dados completos
    const avaliacaoAtualizada = await Avaliacao.findById(id)
      .populate('aluno', 'nome matricula')
      .populate('disciplina', 'nome codigo')
      .populate('turma', 'nome')
      .populate('avaliacoes.habilidades.habilidade', 'codigo descricao');
    
    res.json(avaliacaoAtualizada);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar habilidades', error: error.message });
  }
};

// @desc    Relatório de evolução de habilidades do aluno
// @route   GET /api/avaliacoes/aluno/:alunoId/evolucao-habilidades
exports.getEvolucaoHabilidades = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { disciplina, ano } = req.query;
    
    const filter = { aluno: alunoId };
    if (disciplina) filter.disciplina = disciplina;
    if (ano) filter.ano = parseInt(ano);
    
    const avaliacoes = await Avaliacao.find(filter)
      .populate('disciplina', 'nome codigo')
      .populate('avaliacoes.habilidades.habilidade', 'codigo descricao')
      .sort({ ano: 1, trimestre: 1 });
    
    // Agrupar habilidades e calcular evolução
    const habilidadesMap = new Map();
    const niveisValor = {
      'nao-desenvolvido': 0,
      'em-desenvolvimento': 1,
      'desenvolvido': 2,
      'plenamente-desenvolvido': 3
    };
    
    avaliacoes.forEach(av => {
      av.avaliacoes.forEach((item, itemIndex) => {
        if (item.habilidades && item.habilidades.length > 0) {
          item.habilidades.forEach(hab => {
            if (!hab.habilidade) return;
            
            const habId = hab.habilidade._id.toString();
            if (!habilidadesMap.has(habId)) {
              habilidadesMap.set(habId, {
                habilidade: hab.habilidade,
                registros: []
              });
            }
            
            habilidadesMap.get(habId).registros.push({
              trimestre: av.trimestre,
              ano: av.ano,
              nivel: hab.nivel,
              nivelValor: niveisValor[hab.nivel] || 0,
              data: item.data,
              observacao: hab.observacao
            });
          });
        }
      });
    });
    
    // Calcular estatísticas de evolução
    const evolucao = Array.from(habilidadesMap.values()).map(({ habilidade, registros }) => {
      registros.sort((a, b) => new Date(a.data) - new Date(b.data));
      
      const primeiro = registros[0];
      const ultimo = registros[registros.length - 1];
      const evolucaoPercentual = registros.length > 1
        ? ((ultimo.nivelValor - primeiro.nivelValor) / 3) * 100
        : 0;
      
      return {
        habilidade: {
          _id: habilidade._id,
          codigo: habilidade.codigo,
          descricao: habilidade.descricao
        },
        nivelAtual: ultimo.nivel,
        nivelInicial: primeiro.nivel,
        evolucaoPercentual: evolucaoPercentual.toFixed(1),
        totalAvaliacoes: registros.length,
        historico: registros
      };
    });
    
    res.json({
      aluno: alunoId,
      disciplina,
      ano,
      totalHabilidades: evolucao.length,
      habilidades: evolucao
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar evolução de habilidades', error: error.message });
  }
};

// @desc    Importar avaliações em lote (CSV/Excel)
// @route   POST /api/avaliacoes/importar
exports.importarAvaliacoes = async (req, res) => {
  try {
    const { avaliacoes } = req.body; // Array de avaliações
    
    if (!Array.isArray(avaliacoes) || avaliacoes.length === 0) {
      return res.status(400).json({ message: 'É necessário fornecer um array de avaliações' });
    }
    
    const Aluno = require('../models/Aluno');
    const Disciplina = require('../models/Disciplina');
    const Turma = require('../models/Turma');
    const Professor = require('../models/Professor');
    
    const resultados = {
      sucesso: 0,
      erros: 0,
      detalhes: []
    };
    
    for (const item of avaliacoes) {
      try {
        // Buscar IDs por matrícula, nome, código, etc
        let alunoId = null;
        let disciplinaId = null;
        let turmaId = null;
        let professorId = null;
        
        // Buscar aluno por matrícula ou nome
        if (item.matricula_aluno) {
          const aluno = await Aluno.findOne({ 
            matricula: item.matricula_aluno, 
            ativo: true 
          });
          alunoId = aluno?._id;
        } else if (item.aluno_nome) {
          const aluno = await Aluno.findOne({ 
            nome: { $regex: new RegExp(item.aluno_nome, 'i') },
            ativo: true 
          }).limit(1);
          alunoId = aluno?._id;
        }
        
        // Buscar disciplina por código ou nome
        if (item.codigo_disciplina) {
          const disciplina = await Disciplina.findOne({ 
            codigo: item.codigo_disciplina,
            ativo: true 
          });
          disciplinaId = disciplina?._id;
        } else if (item.disciplina_nome) {
          const disciplina = await Disciplina.findOne({ 
            nome: { $regex: new RegExp(item.disciplina_nome, 'i') },
            ativo: true 
          }).limit(1);
          disciplinaId = disciplina?._id;
        }
        
        // Buscar turma por nome
        if (item.turma_nome) {
          const turma = await Turma.findOne({ 
            nome: { $regex: new RegExp(item.turma_nome, 'i') },
            ativo: true 
          }).limit(1);
          turmaId = turma?._id;
        }
        
        // Buscar professor por nome (opcional)
        if (item.professor_nome) {
          const professor = await Professor.findOne({ 
            nome: { $regex: new RegExp(item.professor_nome, 'i') },
            ativo: true 
          }).limit(1);
          professorId = professor?._id;
        }
        
        if (!alunoId || !disciplinaId || !turmaId) {
          resultados.erros++;
          resultados.detalhes.push({
            linha: item.linha || resultados.sucesso + resultados.erros,
            erro: 'Aluno, disciplina ou turma não encontrados',
            dados: item
          });
          continue;
        }
        
        // Preparar dados da avaliação
        const avaliacaoData = {
          aluno: alunoId,
          disciplina: disciplinaId,
          turma: turmaId,
          ano: parseInt(item.ano) || new Date().getFullYear(),
          trimestre: parseInt(item.trimestre) || 1,
          observacoes: item.observacoes || ''
        };
        
        if (professorId) {
          avaliacaoData.professor = professorId;
        }
        
        // Adicionar avaliações (notas)
        const avaliacoesArray = [];
        if (item.nota) {
          avaliacoesArray.push({
            tipo: item.tipo_avaliacao || 'prova',
            descricao: item.descricao || '',
            nota: parseFloat(item.nota),
            peso: parseFloat(item.peso) || 1,
            data: item.data_avaliacao ? new Date(item.data_avaliacao) : new Date()
          });
        }
        
        if (avaliacoesArray.length > 0) {
          avaliacaoData.avaliacoes = avaliacoesArray;
        }
        
        // Verificar se já existe avaliação para este aluno/disciplina/trimestre
        let avaliacao = await Avaliacao.findOne({
          aluno: alunoId,
          disciplina: disciplinaId,
          turma: turmaId,
          ano: avaliacaoData.ano,
          trimestre: avaliacaoData.trimestre
        });
        
        if (avaliacao) {
          // Adicionar nova nota à avaliação existente
          if (avaliacoesArray.length > 0) {
            avaliacao.avaliacoes.push(...avaliacoesArray);
            await avaliacao.save();
          }
        } else {
          // Criar nova avaliação
          avaliacao = await Avaliacao.create(avaliacaoData);
        }
        
        resultados.sucesso++;
        resultados.detalhes.push({
          linha: item.linha || resultados.sucesso + resultados.erros,
          status: 'sucesso',
          avaliacaoId: avaliacao._id
        });
        
      } catch (error) {
        resultados.erros++;
        resultados.detalhes.push({
          linha: item.linha || resultados.sucesso + resultados.erros,
          erro: error.message,
          dados: item
        });
      }
    }
    
    res.json({
      message: 'Importação concluída',
      total: avaliacoes.length,
      sucesso: resultados.sucesso,
      erros: resultados.erros,
      detalhes: resultados.detalhes
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Erro ao importar avaliações', error: error.message });
  }
};
