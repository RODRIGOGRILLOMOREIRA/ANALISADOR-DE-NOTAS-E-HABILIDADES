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
    
    console.log('📝 Registrando chamada:', {
      turmaId,
      data,
      disciplina,
      professor,
      periodo,
      totalPresencas: Object.keys(presencas || {}).length
    });
    
    const Turma = require('../models/Turma');
    const turma = await Turma.findById(turmaId);
    
    if (!turma) {
      console.error('❌ Turma não encontrada:', turmaId);
      return res.status(404).json({ message: 'Turma não encontrada' });
    }
    
    // Buscar alunos da turma diretamente pelo campo 'turma' do modelo Aluno
    const alunos = await Aluno.find({ turma: turmaId, ativo: true });
    
    console.log('✅ Turma encontrada:', turma.nome, '- Alunos ativos:', alunos.length);
    
    if (alunos.length === 0) {
      console.warn('⚠️ Nenhum aluno encontrado para esta turma');
      return res.status(400).json({ 
        message: 'Nenhum aluno encontrado para esta turma',
        total: 0,
        frequencias: []
      });
    }
    
    // Normalizar data para meia-noite local (sem timezone)
    const [ano, mesStr, dia] = data.split('-');
    const dataFrequencia = new Date(parseInt(ano), parseInt(mesStr) - 1, parseInt(dia), 0, 0, 0, 0);
    console.log('📅 Data da frequência normalizada:', {
      input: data,
      output: dataFrequencia.toISOString(),
      local: dataFrequencia.toLocaleDateString('pt-BR')
    });
    
    const frequenciasCriadas = [];
    
    // Calcular mes e trimestre da data
    const mes = dataFrequencia.getMonth() + 1;
    let trimestre = 1;
    if (mes <= 3) trimestre = 1;
    else if (mes <= 6) trimestre = 2;
    else if (mes <= 9) trimestre = 3;
    else trimestre = 4;
    
    console.log('📊 Calculados - Mês:', mes, 'Trimestre:', trimestre);
    
    for (const aluno of alunos) {
      const alunoIdStr = aluno._id.toString();
      const status = presencas[alunoIdStr] || presencas[aluno._id] || 'presente';
      
      const frequenciaData = {
        aluno: aluno._id,
        turma: turmaId,
        disciplina,
        professor: professor || null,
        data: dataFrequencia,
        status,
        periodo,
        ano: dataFrequencia.getFullYear(),
        mes,
        trimestre,
        registradoPor: req.user?._id
      };
      
      console.log('📝 Processando aluno:', {
        nome: aluno.nome,
        id: alunoIdStr,
        status,
        mes,
        trimestre
      });
      
      // Verificar se já existe usando range de data para evitar problemas de timezone
      const inicioDia = new Date(parseInt(ano), parseInt(mesStr) - 1, parseInt(dia), 0, 0, 0, 0);
      const fimDia = new Date(parseInt(ano), parseInt(mesStr) - 1, parseInt(dia), 23, 59, 59, 999);
      
      const existente = await Frequencia.findOne({
        aluno: aluno._id,
        disciplina,
        data: {
          $gte: inicioDia,
          $lte: fimDia
        }
      });
      
      if (existente) {
        console.log('🔄 Atualizando frequência existente:', aluno.nome, '- Status atual:', existente.status, '→ Novo:', status);
        existente.status = status;
        existente.periodo = periodo;
        existente.turma = turmaId;
        existente.mes = mes;
        existente.trimestre = trimestre;
        existente.data = dataFrequencia; // Atualizar com a data normalizada
        if (professor) existente.professor = professor;
        await existente.save();
        frequenciasCriadas.push(existente);
      } else {
        console.log('➕ Criando nova frequência:', aluno.nome, '- Status:', status);
        const frequencia = await Frequencia.create(frequenciaData);
        frequenciasCriadas.push(frequencia);
      }
    }
    
    console.log('✅ Total de frequências processadas:', frequenciasCriadas.length);
    
    // Popular dados do aluno para retornar ao frontend
    const frequenciasPopuladas = await Frequencia.populate(frequenciasCriadas, {
      path: 'aluno',
      select: 'nome matricula'
    });
    
    res.status(201).json({
      message: 'Chamada registrada com sucesso',
      total: frequenciasPopuladas.length,
      frequencias: frequenciasPopuladas
    });
  } catch (error) {
    console.error('❌ Erro ao registrar chamada:', error);
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
    
    // Normalizar data para range do dia completo
    const [ano, mes, dia] = data.split('-');
    const inicioDia = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), 0, 0, 0, 0);
    const fimDia = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), 23, 59, 59, 999);
    
    const filter = {
      turma: turmaId,
      data: {
        $gte: inicioDia,
        $lte: fimDia
      },
      ativo: true
    };
    
    if (disciplina) filter.disciplina = disciplina;
    
    console.log('🔍 Buscando frequências:', {
      turmaId,
      disciplina,
      dataInicio: inicioDia.toISOString(),
      dataFim: fimDia.toISOString(),
      dataLocal: inicioDia.toLocaleDateString('pt-BR')
    });
    
    const frequencias = await Frequencia.find(filter)
      .populate('aluno', 'nome matricula')
      .populate('disciplina', 'nome')
      .sort({ 'aluno.nome': 1 });
    
    console.log('✅ Frequências encontradas:', {
      total: frequencias.length,
      frequencias: frequencias.map(f => ({
        aluno: f.aluno?.nome,
        status: f.status,
        data: new Date(f.data).toLocaleDateString('pt-BR')
      }))
    });
    
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
    console.error('❌ Erro ao buscar frequência:', error);
    res.status(500).json({ message: 'Erro ao buscar frequência da turma', error: error.message });
  }
};

// @desc    Dashboard de frequência
// @route   GET /api/frequencias/dashboard
exports.getDashboardFrequencia = async (req, res) => {
  try {
    const { turma, aluno, disciplina, ano, trimestre, dataInicio, dataFim } = req.query;
    
    console.log('📊 Dashboard Frequência - Filtros recebidos:', {
      turma,
      aluno,
      disciplina,
      ano,
      trimestre,
      dataInicio,
      dataFim
    });
    
    const filter = {};
    if (turma) filter.turma = turma;
    if (aluno) filter.aluno = aluno;
    if (disciplina) filter.disciplina = disciplina;
    if (ano) filter.ano = parseInt(ano);
    if (trimestre) filter.trimestre = parseInt(trimestre);
    
    // Filtro de data com normalização de timezone
    if (dataInicio || dataFim) {
      filter.data = {};
      
      if (dataInicio) {
        // Normalizar data início para meia-noite local
        const [anoIni, mesIni, diaIni] = dataInicio.split('-');
        const dataInicioNorm = new Date(parseInt(anoIni), parseInt(mesIni) - 1, parseInt(diaIni), 0, 0, 0, 0);
        filter.data.$gte = dataInicioNorm;
        console.log('📅 Data Início normalizada:', dataInicioNorm.toISOString(), '-', dataInicioNorm.toLocaleDateString('pt-BR'));
      }
      
      if (dataFim) {
        // Normalizar data fim para 23:59:59 local
        const [anoFim, mesFim, diaFim] = dataFim.split('-');
        const dataFimNorm = new Date(parseInt(anoFim), parseInt(mesFim) - 1, parseInt(diaFim), 23, 59, 59, 999);
        filter.data.$lte = dataFimNorm;
        console.log('📅 Data Fim normalizada:', dataFimNorm.toISOString(), '-', dataFimNorm.toLocaleDateString('pt-BR'));
      }
      
      // Se apenas dataInicio foi fornecido, filtrar apenas esse dia
      if (dataInicio && !dataFim) {
        const [anoIni, mesIni, diaIni] = dataInicio.split('-');
        const inicioDia = new Date(parseInt(anoIni), parseInt(mesIni) - 1, parseInt(diaIni), 0, 0, 0, 0);
        const fimDia = new Date(parseInt(anoIni), parseInt(mesIni) - 1, parseInt(diaIni), 23, 59, 59, 999);
        filter.data = { $gte: inicioDia, $lte: fimDia };
        console.log('📅 Filtrando dia único:', inicioDia.toLocaleDateString('pt-BR'));
      }
    }
    
    console.log('🔍 Filtro final aplicado:', JSON.stringify(filter, null, 2));
    
    // Estatísticas gerais
    const [total, presencas, faltas, faltasJustificadas] = await Promise.all([
      Frequencia.countDocuments(filter),
      Frequencia.countDocuments({ ...filter, status: 'presente' }),
      Frequencia.countDocuments({ ...filter, status: 'falta' }),
      Frequencia.countDocuments({ ...filter, status: 'falta-justificada' })
    ]);
    
    const percentualPresenca = total > 0 ? ((presencas / total) * 100) : 100;
    
    console.log('📊 Estatísticas calculadas:', {
      total,
      presencas,
      faltas,
      faltasJustificadas,
      percentualPresenca: percentualPresenca.toFixed(2) + '%'
    });
    
    // Se apenas turma está selecionada (sem aluno ou disciplina específicos), 
    // buscar TODOS os alunos da turma
    let todosDados = [];
    
    if (turma && !aluno && !disciplina) {
      console.log('📋 Buscando TODOS os alunos da turma:', turma);
      
      // Buscar todos os alunos da turma
      const todosAlunos = await Aluno.find({ turma, ativo: true }).select('_id nome matricula');
      console.log('✅ Total de alunos encontrados na turma:', todosAlunos.length);
      
      // Para cada aluno, buscar suas estatísticas de frequência
      for (const alunoDoc of todosAlunos) {
        const filterAluno = { ...filter, aluno: alunoDoc._id };
        
        const [totalAulas, presencasAluno, faltasAluno, justificadasAluno] = await Promise.all([
          Frequencia.countDocuments(filterAluno),
          Frequencia.countDocuments({ ...filterAluno, status: 'presente' }),
          Frequencia.countDocuments({ ...filterAluno, status: 'falta' }),
          Frequencia.countDocuments({ ...filterAluno, status: 'falta-justificada' })
        ]);
        
        const percentualAl = totalAulas > 0 ? ((presencasAluno / totalAulas) * 100) : 0;
        
        todosDados.push({
          aluno: {
            _id: alunoDoc._id,
            nome: alunoDoc.nome,
            matricula: alunoDoc.matricula
          },
          total: totalAulas,
          presentes: presencasAluno,
          faltas: faltasAluno,
          justificadas: justificadasAluno,
          percentualPresenca: parseFloat(percentualAl.toFixed(2)),
          status: Frequencia.getStatusFrequencia(percentualAl)
        });
      }
      
      // Ordenar por percentual (menores primeiro)
      todosDados.sort((a, b) => a.percentualPresenca - b.percentualPresenca);
      
    } else {
      // Usar agregação para estatísticas por aluno (comportamento original)
      const estatisticasPorAluno = await Frequencia.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$aluno',
            totalAulas: { $sum: 1 },
            presencas: {
              $sum: { $cond: [{ $eq: ['$status', 'presente'] }, 1, 0] }
            },
            faltas: {
              $sum: { $cond: [{ $eq: ['$status', 'falta'] }, 1, 0] }
            },
            faltasJustificadas: {
              $sum: { $cond: [{ $eq: ['$status', 'falta-justificada'] }, 1, 0] }
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
        { $sort: { percentualPresenca: 1 } }
      ]);
      
      // Popular dados dos alunos
      await Aluno.populate(estatisticasPorAluno, { path: '_id', select: 'nome matricula' });
      
      // Formatar dados
      todosDados = estatisticasPorAluno.map(a => ({
        aluno: a._id,
        total: a.totalAulas,
        presentes: a.presencas,
        faltas: a.faltas,
        justificadas: a.faltasJustificadas,
        percentualPresenca: parseFloat(a.percentualPresenca.toFixed(2)),
        status: Frequencia.getStatusFrequencia(a.percentualPresenca)
      }));
    }
    
    // Calcular total de dias únicos registrados
    const diasUnicos = await Frequencia.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$data' }
          }
        }
      },
      { $count: 'totalDias' }
    ]);
    
    const totalDiasRegistrados = diasUnicos.length > 0 ? diasUnicos[0].totalDias : 0;
    
    console.log('📅 Total de dias únicos registrados:', totalDiasRegistrados);
    
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
    
    // Filtrar apenas alunos críticos (abaixo de 75%)
    const alunosCriticos = todosDados.filter(a => a.percentualPresenca < 75);
    
    console.log(`📋 Total de alunos: ${todosDados.length}, Críticos: ${alunosCriticos.length}`);
    
    res.json({
      estatisticasGerais: {
        total,
        presencas,
        faltas,
        faltasJustificadas,
        percentualPresenca: parseFloat(percentualPresenca.toFixed(2)),
        totalDiasRegistrados
      },
      alunosPorFrequencia: todosDados,
      alunosCriticos: alunosCriticos,
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

// @desc    Gerar template de frequências por turma
// @route   GET /api/frequencias/template/:turmaId
exports.gerarTemplatePorTurma = async (req, res) => {
  try {
    const { turmaId } = req.params;
    const { disciplinaId, data } = req.query;
    
    const Turma = require('../models/Turma');
    const Disciplina = require('../models/Disciplina');
    
    // Validar ID da turma
    if (!turmaId || turmaId === 'undefined' || turmaId === 'null') {
      return res.status(400).json({ message: 'ID da turma inválido' });
    }
    
    // Buscar turma
    const turma = await Turma.findById(turmaId).populate('disciplinas.disciplina');
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }
    
    // Buscar alunos da turma
    const alunos = await Aluno.find({ turma: turmaId, ativo: true }).sort({ nome: 1 });
    
    if (alunos.length === 0) {
      return res.status(400).json({ 
        message: 'Nenhum aluno encontrado nesta turma',
        detalhes: `A turma "${turma.nome}" não possui alunos cadastrados. Cadastre alunos primeiro.`
      });
    }
    
    // Buscar disciplina se especificada
    let disciplina = null;
    if (disciplinaId) {
      disciplina = await Disciplina.findById(disciplinaId);
    }
    
    // Data padrão: hoje
    const dataTemplate = data || new Date().toISOString().split('T')[0];
    
    // Gerar template com dados dos alunos
    const template = alunos.map(aluno => ({
      matricula_aluno: aluno.matricula,
      aluno_nome: aluno.nome,
      turma_nome: turma.nome,
      codigo_disciplina: disciplina?.codigo || '',
      disciplina_nome: disciplina?.nome || '',
      data: dataTemplate,
      status: '', // Vazio para fácil preenchimento
      status_codigo: '', // P, F, FJ, A (facilitador)
      periodo: turma.turno || 'matutino',
      observacao: ''
    }));
    
    res.json({
      turma: {
        id: turma._id,
        nome: turma.nome,
        turno: turma.turno,
        totalAlunos: alunos.length
      },
      disciplina: disciplina ? {
        id: disciplina._id,
        nome: disciplina.nome,
        codigo: disciplina.codigo
      } : null,
      template,
      instrucoes: {
        status: 'Preencha a coluna "status" com: presente, falta, falta-justificada ou atestado',
        status_codigo: 'OU use a coluna "status_codigo" com códigos rápidos: P (presente), F (falta), FJ (falta-justificada), A (atestado)',
        periodo: 'Valores: matutino, vespertino, noturno, integral',
        data: 'Formato: AAAA-MM-DD',
        dica: 'Deixe "status" e "status_codigo" vazios para marcar como PRESENTE automaticamente'
      },
      codigos_status: {
        'P': 'presente',
        'F': 'falta',
        'FJ': 'falta-justificada',
        'A': 'atestado',
        '': 'presente (padrão)'
      }
    });
    
  } catch (error) {
    console.error('Erro ao gerar template de frequências:', error);
    res.status(500).json({ message: 'Erro ao gerar template', error: error.message });
  }
};

// @desc    Importar frequências em lote (CSV/Excel)
// @route   POST /api/frequencias/importar
exports.importarFrequencias = async (req, res) => {
  try {
    const { frequencias } = req.body; // Array de frequências
    
    if (!Array.isArray(frequencias) || frequencias.length === 0) {
      return res.status(400).json({ message: 'É necessário fornecer um array de frequências' });
    }
    
    const Turma = require('../models/Turma');
    const Disciplina = require('../models/Disciplina');
    const Professor = require('../models/Professor');
    
    const resultados = {
      sucesso: 0,
      erros: 0,
      atualizados: 0,
      detalhes: []
    };
    
    for (const item of frequencias) {
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
        
        // Buscar professor por nome
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
            linha: item.linha || resultados.sucesso + resultados.erros + resultados.atualizados,
            erro: 'Aluno, disciplina ou turma não encontrados',
            dados: item
          });
          continue;
        }
        
        // Validar data
        const data = item.data ? new Date(item.data) : null;
        if (!data || isNaN(data.getTime())) {
          resultados.erros++;
          resultados.detalhes.push({
            linha: item.linha || resultados.sucesso + resultados.erros + resultados.atualizados,
            erro: 'Data inválida ou não fornecida',
            dados: item
          });
          continue;
        }
        
        // Processar status (com suporte a códigos: P, F, FJ, A)
        let status = 'presente'; // Padrão
        
        // Primeiro verificar se há código de status
        if (item.status_codigo) {
          const codigo = item.status_codigo.toString().toUpperCase().trim();
          const mapaCodigos = {
            'P': 'presente',
            'F': 'falta',
            'FJ': 'falta-justificada',
            'A': 'atestado'
          };
          
          if (mapaCodigos[codigo]) {
            status = mapaCodigos[codigo];
          } else {
            resultados.erros++;
            resultados.detalhes.push({
              linha: item.linha || resultados.sucesso + resultados.erros + resultados.atualizados,
              erro: `Código de status inválido: ${item.status_codigo}. Use: P, F, FJ ou A`,
              dados: item
            });
            continue;
          }
        } 
        // Se não houver código, verificar status por extenso
        else if (item.status) {
          status = item.status.toLowerCase().trim();
        }
        
        // Validar status final
        const statusValidos = ['presente', 'falta', 'falta-justificada', 'atestado'];
        if (!statusValidos.includes(status)) {
          resultados.erros++;
          resultados.detalhes.push({
            linha: item.linha || resultados.sucesso + resultados.erros + resultados.atualizados,
            erro: `Status inválido: ${status}. Use: ${statusValidos.join(', ')} ou códigos P, F, FJ, A`,
            dados: item
          });
          continue;
        }
        
        // Preparar dados da frequência
        const frequenciaData = {
          aluno: alunoId,
          disciplina: disciplinaId,
          turma: turmaId,
          data: data,
          status: status,
          observacao: item.observacao || '',
          periodo: item.periodo?.toLowerCase() || 'matutino',
          ano: data.getFullYear()
        };
        
        if (professorId) {
          frequenciaData.professor = professorId;
        }
        
        // Verificar se já existe registro para esta data/aluno/disciplina
        const existente = await Frequencia.findOne({
          aluno: alunoId,
          disciplina: disciplinaId,
          data: data
        });
        
        if (existente) {
          // Atualizar existente
          existente.status = status;
          existente.observacao = frequenciaData.observacao;
          existente.periodo = frequenciaData.periodo;
          if (professorId) existente.professor = professorId;
          await existente.save();
          
          resultados.atualizados++;
          resultados.detalhes.push({
            linha: item.linha || resultados.sucesso + resultados.erros + resultados.atualizados,
            status: 'atualizado',
            frequenciaId: existente._id
          });
        } else {
          // Criar novo
          const frequencia = await Frequencia.create(frequenciaData);
          
          resultados.sucesso++;
          resultados.detalhes.push({
            linha: item.linha || resultados.sucesso + resultados.erros + resultados.atualizados,
            status: 'criado',
            frequenciaId: frequencia._id
          });
        }
        
      } catch (error) {
        resultados.erros++;
        resultados.detalhes.push({
          linha: item.linha || resultados.sucesso + resultados.erros + resultados.atualizados,
          erro: error.message,
          dados: item
        });
      }
    }
    
    res.json({
      message: 'Importação concluída',
      total: frequencias.length,
      criados: resultados.sucesso,
      atualizados: resultados.atualizados,
      erros: resultados.erros,
      detalhes: resultados.detalhes
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Erro ao importar frequências', error: error.message });
  }
};
