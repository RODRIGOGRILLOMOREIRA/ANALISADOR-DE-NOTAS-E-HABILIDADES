const PDFDocument = require('pdfkit');
const Avaliacao = require('../models/Avaliacao');
const Aluno = require('../models/Aluno');
const Turma = require('../models/Turma');
const Disciplina = require('../models/Disciplina');
const Habilidade = require('../models/Habilidade');

/**
 * Gera boletim individual do aluno em PDF
 * GET /api/relatorios/boletim/:alunoId
 */
exports.gerarBoletimAluno = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { ano } = req.query;

    // Buscar dados do aluno
    const aluno = await Aluno.findById(alunoId).populate('turma');
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Buscar avaliações do aluno
    const filtro = { aluno: alunoId };
    if (ano) filtro.ano = parseInt(ano);

    const avaliacoes = await Avaliacao.find(filtro)
      .populate('disciplina')
      .populate('turma')
      .sort({ disciplina: 1, trimestre: 1 });

    // Criar documento PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Configurar headers para download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=boletim_${aluno.matricula}.pdf`);

    // Pipe do documento para a resposta
    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(20)
       .text('BOLETIM ESCOLAR', { align: 'center' })
       .moveDown();

    doc.fontSize(12)
       .text(`Aluno: ${aluno.nome}`, { continued: false })
       .text(`Matrícula: ${aluno.matricula}`)
       .text(`Turma: ${aluno.turma?.nome || 'N/A'}`)
       .text(`Ano Letivo: ${ano || new Date().getFullYear()}`)
       .moveDown(2);

    // Agrupar avaliações por disciplina
    const avaliacoesPorDisciplina = avaliacoes.reduce((acc, aval) => {
      const disciplinaId = aval.disciplina._id.toString();
      if (!acc[disciplinaId]) {
        acc[disciplinaId] = {
          nome: aval.disciplina.nome,
          avaliacoes: []
        };
      }
      acc[disciplinaId].avaliacoes.push(aval);
      return acc;
    }, {});

    // Renderizar cada disciplina
    Object.values(avaliacoesPorDisciplina).forEach((disc, index) => {
      // Título da disciplina
      doc.fontSize(14)
         .fillColor('#00CED1')
         .text(disc.nome, { underline: true })
         .fillColor('#000000')
         .fontSize(10)
         .moveDown(0.5);

      // Tabela de notas
      const y = doc.y;
      const colWidths = { trimestre: 80, nota: 80, situacao: 100 };

      // Cabeçalho da tabela
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Trimestre', 50, y, { width: colWidths.trimestre, continued: true })
         .text('Nota', { width: colWidths.nota, continued: true })
         .text('Situação', { width: colWidths.situacao })
         .font('Helvetica');

      doc.moveDown(0.3);

      // Dados da tabela
      const notasPorTrimestre = { 1: null, 2: null, 3: null };
      disc.avaliacoes.forEach(aval => {
        notasPorTrimestre[aval.trimestre] = aval.notaFinal;
      });

      [1, 2, 3].forEach(trim => {
        const nota = notasPorTrimestre[trim];
        const situacao = nota !== null ? (nota >= 6 ? 'Aprovado' : 'Recuperação') : 'Pendente';
        const yPos = doc.y;

        doc.text(`${trim}º Trimestre`, 50, yPos, { width: colWidths.trimestre, continued: true })
           .text(nota !== null ? nota.toFixed(2) : '-', { width: colWidths.nota, continued: true })
           .text(situacao, { width: colWidths.situacao });

        doc.moveDown(0.5);
      });

      // Calcular média anual
      const notas = Object.values(notasPorTrimestre).filter(n => n !== null);
      if (notas.length > 0) {
        const mediaAnual = (notasPorTrimestre[1] || 0) * 3 +
                          (notasPorTrimestre[2] || 0) * 3 +
                          (notasPorTrimestre[3] || 0) * 4;
        const media = mediaAnual / 10;

        doc.moveDown(0.5)
           .font('Helvetica-Bold')
           .text(`Média Anual: ${media.toFixed(2)}`, 50)
           .font('Helvetica')
           .moveDown(1.5);
      } else {
        doc.moveDown(1.5);
      }

      // Adicionar nova página se necessário
      if (index < Object.values(avaliacoesPorDisciplina).length - 1 && doc.y > 650) {
        doc.addPage();
      }
    });

    // Rodapé
    doc.moveDown(3)
       .fontSize(8)
       .fillColor('#666666')
       .text(`Documento gerado em ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' })
       .text('Sistema de Gestão Escolar', { align: 'center' });

    // Finalizar documento
    doc.end();

  } catch (error) {
    console.error('Erro ao gerar boletim:', error);
    res.status(500).json({ message: 'Erro ao gerar boletim', error: error.message });
  }
};

/**
 * Gera relatório de desempenho por turma
 * GET /api/relatorios/desempenho-turma/:turmaId
 */
exports.gerarRelatorioTurma = async (req, res) => {
  try {
    const { turmaId } = req.params;
    const { disciplinaId, trimestre, ano } = req.query;

    // Buscar turma
    const turma = await Turma.findById(turmaId);
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }

    // Buscar alunos da turma
    const alunos = await Aluno.find({ turma: turmaId }).sort({ nome: 1 });

    // Buscar avaliações
    const filtro = { turma: turmaId };
    if (disciplinaId) filtro.disciplina = disciplinaId;
    if (trimestre) filtro.trimestre = parseInt(trimestre);
    if (ano) filtro.ano = parseInt(ano);

    const avaliacoes = await Avaliacao.find(filtro)
      .populate('aluno')
      .populate('disciplina')
      .sort({ disciplina: 1, 'aluno.nome': 1 });

    // Criar documento PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=desempenho_turma_${turma.nome}.pdf`);

    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(18)
       .text('RELATÓRIO DE DESEMPENHO DA TURMA', { align: 'center' })
       .moveDown();

    doc.fontSize(12)
       .text(`Turma: ${turma.nome}`)
       .text(`Série: ${turma.serie}`)
       .text(`Ano Letivo: ${ano || new Date().getFullYear()}`)
       .moveDown(2);

    // Estatísticas gerais
    const totalAlunos = alunos.length;
    const alunosComNotas = new Set(avaliacoes.map(a => a.aluno._id.toString())).size;
    const mediaGeral = avaliacoes.length > 0
      ? avaliacoes.reduce((sum, a) => sum + (a.notaFinal || 0), 0) / avaliacoes.length
      : 0;

    doc.fontSize(11)
       .fillColor('#00CED1')
       .text('ESTATÍSTICAS GERAIS', { underline: true })
       .fillColor('#000000')
       .fontSize(10)
       .moveDown(0.5);

    doc.text(`Total de Alunos: ${totalAlunos}`)
       .text(`Alunos com Avaliações: ${alunosComNotas}`)
       .text(`Média Geral da Turma: ${mediaGeral.toFixed(2)}`)
       .moveDown(2);

    // Tabela de desempenho
    doc.fontSize(11)
       .fillColor('#00CED1')
       .text('DESEMPENHO POR ALUNO', { underline: true })
       .fillColor('#000000')
       .moveDown(0.5);

    // Agrupar por disciplina
    const avalPorDisciplina = avaliacoes.reduce((acc, aval) => {
      const discId = aval.disciplina._id.toString();
      if (!acc[discId]) {
        acc[discId] = {
          nome: aval.disciplina.nome,
          avaliacoes: []
        };
      }
      acc[discId].avaliacoes.push(aval);
      return acc;
    }, {});

    Object.values(avalPorDisciplina).forEach((disc, index) => {
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text(disc.nome)
         .font('Helvetica')
         .moveDown(0.3);

      const y = doc.y;
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .text('Aluno', 50, y, { width: 200, continued: true })
         .text('1º Trim', { width: 60, align: 'center', continued: true })
         .text('2º Trim', { width: 60, align: 'center', continued: true })
         .text('3º Trim', { width: 60, align: 'center', continued: true })
         .text('Média', { width: 60, align: 'center' })
         .font('Helvetica');

      doc.moveDown(0.3);

      // Agrupar por aluno
      const avalPorAluno = disc.avaliacoes.reduce((acc, aval) => {
        const alunoId = aval.aluno._id.toString();
        if (!acc[alunoId]) {
          acc[alunoId] = {
            nome: aval.aluno.nome,
            trimestres: { 1: null, 2: null, 3: null }
          };
        }
        acc[alunoId].trimestres[aval.trimestre] = aval.notaFinal;
        return acc;
      }, {});

      Object.values(avalPorAluno).forEach(aluno => {
        const yPos = doc.y;
        const notas = Object.values(aluno.trimestres).filter(n => n !== null);
        const media = notas.length > 0
          ? ((aluno.trimestres[1] || 0) * 3 + (aluno.trimestres[2] || 0) * 3 + (aluno.trimestres[3] || 0) * 4) / 10
          : 0;

        doc.fontSize(8)
           .text(aluno.nome, 50, yPos, { width: 200, continued: true })
           .text(aluno.trimestres[1] !== null ? aluno.trimestres[1].toFixed(1) : '-', { width: 60, align: 'center', continued: true })
           .text(aluno.trimestres[2] !== null ? aluno.trimestres[2].toFixed(1) : '-', { width: 60, align: 'center', continued: true })
           .text(aluno.trimestres[3] !== null ? aluno.trimestres[3].toFixed(1) : '-', { width: 60, align: 'center', continued: true })
           .text(media > 0 ? media.toFixed(2) : '-', { width: 60, align: 'center' });

        doc.moveDown(0.5);

        // Nova página se necessário
        if (doc.y > 500) {
          doc.addPage();
        }
      });

      doc.moveDown(1);
    });

    // Rodapé
    doc.fontSize(8)
       .fillColor('#666666')
       .text(`Documento gerado em ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('Erro ao gerar relatório de turma:', error);
    res.status(500).json({ message: 'Erro ao gerar relatório', error: error.message });
  }
};

/**
 * Gera matriz de habilidades por aluno
 * GET /api/relatorios/matriz-habilidades/:alunoId
 */
exports.gerarMatrizHabilidades = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const { ano, turmaId, disciplinaId } = req.query;

    const aluno = await Aluno.findById(alunoId).populate('turma');
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Buscar avaliações com habilidades
    const filtro = { aluno: alunoId };
    if (ano) filtro.ano = parseInt(ano);
    if (turmaId) filtro.turma = turmaId;
    if (disciplinaId) filtro.disciplina = disciplinaId;

    const avaliacoes = await Avaliacao.find(filtro)
      .populate('disciplina')
      .populate({
        path: 'avaliacoes.habilidades.habilidade',
        model: 'Habilidade'
      });

    // Extrair todas as habilidades e seu histórico
    const habilidadesMap = new Map();

    avaliacoes.forEach(aval => {
      aval.avaliacoes.forEach(item => {
        if (item.habilidades && item.habilidades.length > 0) {
          item.habilidades.forEach(hab => {
            const habId = hab.habilidade._id.toString();
            if (!habilidadesMap.has(habId)) {
              habilidadesMap.set(habId, {
                codigo: hab.habilidade.codigo,
                descricao: hab.habilidade.descricao,
                disciplina: aval.disciplina.nome,
                niveis: []
              });
            }
            habilidadesMap.get(habId).niveis.push({
              nivel: hab.nivel,
              trimestre: aval.trimestre,
              observacao: hab.observacao
            });
          });
        }
      });
    });

    // Retornar dados JSON para o frontend processar
    res.json({
      aluno: {
        nome: aluno.nome,
        matricula: aluno.matricula,
        turma: aluno.turma?.nome
      },
      habilidades: Array.from(habilidadesMap.entries()).map(([id, data]) => ({
        id,
        ...data,
        evolucao: calcularEvolucaoHabilidade(data.niveis)
      }))
    });

  } catch (error) {
    console.error('Erro ao gerar matriz de habilidades:', error);
    res.status(500).json({ message: 'Erro ao gerar matriz', error: error.message });
  }
};

/**
 * Gera mapa de calor de habilidades por turma
 * GET /api/relatorios/mapa-calor/:turmaId
 */
exports.gerarMapaCalor = async (req, res) => {
  try {
    const { turmaId } = req.params;
    const { disciplinaId, trimestre } = req.query;

    const turma = await Turma.findById(turmaId);
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }

    const alunos = await Aluno.find({ turma: turmaId }).sort({ nome: 1 });

    // Buscar habilidades da turma/disciplina
    const filtroHab = { turma: turmaId };
    if (disciplinaId) filtroHab.disciplina = disciplinaId;
    if (trimestre) filtroHab.trimestre = parseInt(trimestre);

    const habilidades = await Habilidade.find(filtroHab)
      .populate('disciplina')
      .sort({ disciplina: 1, codigo: 1 });

    // Buscar avaliações
    const filtroAval = { turma: turmaId };
    if (disciplinaId) filtroAval.disciplina = disciplinaId;
    if (trimestre) filtroAval.trimestre = parseInt(trimestre);

    const avaliacoes = await Avaliacao.find(filtroAval)
      .populate('aluno')
      .populate({
        path: 'avaliacoes.habilidades.habilidade',
        model: 'Habilidade'
      });

    // Criar matriz: aluno x habilidade
    const matriz = {};

    alunos.forEach(aluno => {
      matriz[aluno._id.toString()] = {
        nome: aluno.nome,
        habilidades: {}
      };

      habilidades.forEach(hab => {
        matriz[aluno._id.toString()].habilidades[hab._id.toString()] = {
          codigo: hab.codigo,
          nivel: null,
          percentual: 0
        };
      });
    });

    // Preencher matriz com dados das avaliações
    avaliacoes.forEach(aval => {
      const alunoId = aval.aluno._id.toString();
      
      aval.avaliacoes.forEach(item => {
        if (item.habilidades && item.habilidades.length > 0) {
          item.habilidades.forEach(hab => {
            const habId = hab.habilidade._id.toString();
            if (matriz[alunoId] && matriz[alunoId].habilidades[habId]) {
              const percentual = converterNivelParaPercentual(hab.nivel);
              // Pegar o maior nível alcançado
              if (percentual > matriz[alunoId].habilidades[habId].percentual) {
                matriz[alunoId].habilidades[habId].nivel = hab.nivel;
                matriz[alunoId].habilidades[habId].percentual = percentual;
              }
            }
          });
        }
      });
    });

    res.json({
      turma: {
        nome: turma.nome,
        serie: turma.serie
      },
      habilidades: habilidades.map(h => ({
        id: h._id,
        codigo: h.codigo,
        descricao: h.descricao,
        disciplina: h.disciplina.nome
      })),
      matriz
    });

  } catch (error) {
    console.error('Erro ao gerar mapa de calor:', error);
    res.status(500).json({ message: 'Erro ao gerar mapa de calor', error: error.message });
  }
};

/**
 * Identifica habilidades não trabalhadas
 * GET /api/relatorios/habilidades-nao-trabalhadas/:turmaId
 */
exports.getHabilidadesNaoTrabalhadas = async (req, res) => {
  try {
    const { turmaId } = req.params;
    const { disciplinaId, trimestre } = req.query;

    // Buscar todas as habilidades cadastradas
    const filtroHab = { turma: turmaId };
    if (disciplinaId) filtroHab.disciplina = disciplinaId;
    if (trimestre) filtroHab.trimestre = parseInt(trimestre);

    const todasHabilidades = await Habilidade.find(filtroHab)
      .populate('disciplina')
      .sort({ disciplina: 1, codigo: 1 });

    // Buscar habilidades que foram trabalhadas
    const filtroAval = { turma: turmaId };
    if (disciplinaId) filtroAval.disciplina = disciplinaId;
    if (trimestre) filtroAval.trimestre = parseInt(trimestre);

    const avaliacoes = await Avaliacao.find(filtroAval);

    // Extrair IDs de habilidades trabalhadas
    const habilidadesTrabalhadas = new Set();
    avaliacoes.forEach(aval => {
      aval.avaliacoes.forEach(item => {
        if (item.habilidades && item.habilidades.length > 0) {
          item.habilidades.forEach(hab => {
            habilidadesTrabalhadas.add(hab.habilidade.toString());
          });
        }
      });
    });

    // Filtrar habilidades não trabalhadas
    const naoTrabalhadas = todasHabilidades.filter(hab => 
      !habilidadesTrabalhadas.has(hab._id.toString())
    );

    res.json({
      total: todasHabilidades.length,
      trabalhadas: habilidadesTrabalhadas.size,
      naoTrabalhadas: naoTrabalhadas.map(h => ({
        id: h._id,
        codigo: h.codigo,
        descricao: h.descricao,
        disciplina: h.disciplina.nome,
        trimestre: h.trimestre
      }))
    });

  } catch (error) {
    console.error('Erro ao buscar habilidades não trabalhadas:', error);
    res.status(500).json({ message: 'Erro ao buscar habilidades', error: error.message });
  }
};

// Funções auxiliares
function calcularEvolucaoHabilidade(niveis) {
  if (niveis.length === 0) return 0;

  const percentuais = niveis.map(n => converterNivelParaPercentual(n.nivel));
  return percentuais.reduce((sum, p) => sum + p, 0) / percentuais.length;
}

function converterNivelParaPercentual(nivel) {
  const mapa = {
    'não-desenvolvido': 25,
    'em-desenvolvimento': 50,
    'desenvolvido': 75,
    'plenamente-desenvolvido': 100
  };
  return mapa[nivel] || 0;
}
