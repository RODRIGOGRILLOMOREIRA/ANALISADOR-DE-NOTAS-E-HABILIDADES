# 📊 Sistema de Relatórios - Documentação Completa

## Visão Geral

O **Sistema de Relatórios** do Analisador de Notas e Habilidades oferece funcionalidades avançadas para geração de documentos em PDF e análises visuais do desempenho acadêmico e desenvolvimento de competências dos alunos.

## 🎯 Funcionalidades Implementadas

### 1. Relatórios em PDF

#### Boletim Individual do Aluno
- **URL:** `/relatorios` (após login)
- **Endpoint API:** `GET /api/relatorios/boletim/:alunoId`
- **Query Params:** `ano` (opcional, default: ano atual)
- **Formato:** PDF para download
- **Conteúdo:**
  - Cabeçalho com dados do aluno
  - Notas por disciplina e trimestre
  - Média anual calculada: (T1×3 + T2×3 + T3×4)/10
  - Situação por disciplina
  - Data de geração

**Exemplo de uso:**
```bash
GET /api/relatorios/boletim/507f1f77bcf86cd799439011?ano=2026
Authorization: Bearer <token>
```

**Resposta:** Arquivo PDF (application/pdf)

---

#### Relatório de Desempenho da Turma
- **Endpoint API:** `GET /api/relatorios/desempenho-turma/:turmaId`
- **Query Params:** 
  - `disciplinaId` (opcional)
  - `trimestre` (opcional: 1, 2 ou 3)
  - `ano` (opcional)
- **Formato:** PDF para download (landscape)
- **Conteúdo:**
  - Estatísticas gerais da turma
  - Tabela com todos os alunos
  - Notas por trimestre
  - Médias individuais
  - Agrupamento por disciplina

**Exemplo de uso:**
```bash
GET /api/relatorios/desempenho-turma/507f1f77bcf86cd799439012?disciplinaId=507f1f77bcf86cd799439013&trimestre=1
Authorization: Bearer <token>
```

**Resposta:** Arquivo PDF (application/pdf)

---

### 2. Relatórios Avançados de Habilidades (JSON)

#### Matriz de Habilidades por Aluno
- **Endpoint API:** `GET /api/relatorios/matriz-habilidades/:alunoId`
- **Query Params:**
  - `ano` (opcional)
  - `turmaId` (opcional)
  - `disciplinaId` (opcional)
- **Formato:** JSON
- **Estrutura de resposta:**

```json
{
  "aluno": {
    "nome": "João Silva",
    "matricula": "2024001",
    "turma": "6º Ano A"
  },
  "habilidades": [
    {
      "id": "507f1f77bcf86cd799439014",
      "codigo": "EF06MA01",
      "descricao": "Comparar, ordenar, ler e escrever números naturais",
      "disciplina": "Matemática",
      "niveis": [
        {
          "nivel": "desenvolvido",
          "trimestre": 1,
          "observacao": "Bom desempenho"
        },
        {
          "nivel": "plenamente-desenvolvido",
          "trimestre": 2,
          "observacao": "Excelente evolução"
        }
      ],
      "evolucao": 87.5
    }
  ]
}
```

**Cálculo de Evolução:**
- não-desenvolvido = 25%
- em-desenvolvimento = 50%
- desenvolvido = 75%
- plenamente-desenvolvido = 100%
- Média dos percentuais de todas as avaliações

---

#### Mapa de Calor de Habilidades
- **Endpoint API:** `GET /api/relatorios/mapa-calor/:turmaId`
- **Query Params:**
  - `disciplinaId` (opcional)
  - `trimestre` (opcional)
- **Formato:** JSON
- **Estrutura de resposta:**

```json
{
  "turma": {
    "nome": "6º Ano A",
    "serie": "6º ano"
  },
  "habilidades": [
    {
      "id": "507f1f77bcf86cd799439014",
      "codigo": "EF06MA01",
      "descricao": "Comparar, ordenar...",
      "disciplina": "Matemática"
    }
  ],
  "matriz": {
    "507f1f77bcf86cd799439011": {
      "nome": "João Silva",
      "habilidades": {
        "507f1f77bcf86cd799439014": {
          "codigo": "EF06MA01",
          "nivel": "desenvolvido",
          "percentual": 75
        }
      }
    }
  }
}
```

**Cores no Frontend:**
- 🔴 Vermelho (25%): Não Desenvolvido
- 🟠 Laranja (50%): Em Desenvolvimento
- 🟢 Verde (75%): Desenvolvido
- 🔵 Azul (100%): Plenamente Desenvolvido

---

#### Habilidades Não Trabalhadas
- **Endpoint API:** `GET /api/relatorios/habilidades-nao-trabalhadas/:turmaId`
- **Query Params:**
  - `disciplinaId` (opcional)
  - `trimestre` (opcional)
- **Formato:** JSON
- **Estrutura de resposta:**

```json
{
  "total": 10,
  "trabalhadas": 7,
  "naoTrabalhadas": [
    {
      "id": "507f1f77bcf86cd799439015",
      "codigo": "EF06MA05",
      "descricao": "Classificar números naturais...",
      "disciplina": "Matemática",
      "trimestre": 2
    }
  ]
}
```

---

## 🔐 Autenticação e Autorização

Todas as rotas de relatórios requerem autenticação via JWT token.

**Headers necessários:**
```
Authorization: Bearer <seu_token_jwt>
```

**Como obter o token:**
1. Fazer login: `POST /api/auth/login`
2. Token retornado no response
3. Incluir token em todas as requisições subsequentes

---

## 💻 Implementação Técnica

### Backend

**Controller:** `server/src/controllers/relatorioController.js`
- `gerarBoletimAluno(req, res)` - Gera PDF do boletim
- `gerarRelatorioTurma(req, res)` - Gera PDF da turma
- `gerarMatrizHabilidades(req, res)` - Retorna JSON da matriz
- `gerarMapaCalor(req, res)` - Retorna JSON do mapa
- `getHabilidadesNaoTrabalhadas(req, res)` - Retorna JSON das pendentes

**Rotas:** `server/src/routes/relatorios.js`
```javascript
router.get('/boletim/:alunoId', auth, relatorioController.gerarBoletimAluno);
router.get('/desempenho-turma/:turmaId', auth, relatorioController.gerarRelatorioTurma);
router.get('/matriz-habilidades/:alunoId', auth, relatorioController.gerarMatrizHabilidades);
router.get('/mapa-calor/:turmaId', auth, relatorioController.gerarMapaCalor);
router.get('/habilidades-nao-trabalhadas/:turmaId', auth, relatorioController.getHabilidadesNaoTrabalhadas);
```

**Dependências:**
```json
{
  "pdfkit": "^0.15.0",
  "chartjs-node-canvas": "^4.1.6"
}
```

**Instalação:**
```bash
cd server
npm install pdfkit chartjs-node-canvas
```

---

### Frontend

**Página:** `client/src/pages/Relatorios.js`
- Interface completa com filtros
- Cards para cada tipo de relatório
- Visualização de dados em tabelas
- Download automático de PDFs

**Serviços:** `client/src/services/index.js`
```javascript
export const relatorioService = {
  gerarBoletimAluno: async (alunoId, ano) => { ... },
  gerarRelatorioTurma: async (turmaId, params) => { ... },
  getMatrizHabilidades: async (alunoId, params) => { ... },
  getMapaCalor: async (turmaId, params) => { ... },
  getHabilidadesNaoTrabalhadas: async (turmaId, params) => { ... },
};
```

**Componentes utilizados:**
- Material-UI (Cards, Tables, Buttons, etc.)
- React Hooks (useState, useEffect)
- Toast notifications para feedback

---

## 📖 Guia de Uso

### Para Professores

#### Gerando Boletim de um Aluno

1. Acesse o sistema e faça login
2. No menu lateral, clique em **Relatórios**
3. Na seção "Filtros":
   - Selecione a **Turma**
   - Selecione o **Aluno**
   - (Opcional) Ajuste o **Ano**
4. No card "Boletim Individual", clique em **Gerar Boletim**
5. O PDF será baixado automaticamente

#### Analisando Desempenho da Turma

1. Na página de Relatórios
2. Selecione a **Turma**
3. (Opcional) Filtre por:
   - Disciplina específica
   - Trimestre
4. No card "Desempenho da Turma", clique em **Gerar Relatório**
5. PDF com estatísticas completas será baixado

#### Visualizando Evolução de Habilidades

**Matriz Individual:**
1. Selecione Turma e Aluno
2. No card "Matriz de Habilidades", clique em **Visualizar Matriz**
3. Tabela será exibida na página com:
   - Todas as habilidades avaliadas
   - Percentual de evolução
   - Quantidade de avaliações

**Mapa de Calor da Turma:**
1. Selecione a Turma
2. No card "Mapa de Calor", clique em **Visualizar Mapa**
3. Tabela colorida será exibida mostrando:
   - Todos os alunos (linhas)
   - Todas as habilidades (colunas)
   - Cores indicando nível de desenvolvimento

**Habilidades Pendentes:**
1. Selecione a Turma
2. No card "Habilidades Pendentes", clique em **Identificar Pendentes**
3. Lista será exibida com:
   - Total de habilidades
   - Quantidade trabalhada
   - Lista das não trabalhadas

---

### Para Coordenação Pedagógica

#### Análise Comparativa

1. **Por Turma:**
   - Gere relatórios de desempenho de cada turma
   - Compare médias gerais
   - Identifique turmas com dificuldades

2. **Por Disciplina:**
   - Use filtro de disciplina
   - Compare desempenho entre turmas
   - Identifique necessidade de reforço

3. **Habilidades BNCC:**
   - Use mapa de calor por disciplina
   - Verifique cobertura do currículo
   - Identifique habilidades pendentes

#### Planejamento de Intervenções

1. Analise habilidades não trabalhadas
2. Planeje avaliações para cobrir lacunas
3. Use matriz individual para acompanhamento personalizado
4. Monitore evolução trimestre a trimestre

---

## 🐛 Troubleshooting

### Erro: "Aluno não encontrado"
**Causa:** ID do aluno inválido ou aluno não existe
**Solução:** Verifique se o aluno está cadastrado e selecione-o corretamente

### Erro: "Nenhuma avaliação encontrada"
**Causa:** Não há avaliações lançadas para os filtros selecionados
**Solução:** 
- Verifique se há avaliações cadastradas
- Ajuste os filtros (ano, trimestre, disciplina)
- Lance avaliações antes de gerar relatórios

### PDF não é baixado
**Causa:** Popup bloqueado ou erro no navegador
**Solução:**
- Permita popups para o site
- Verifique console do navegador (F12)
- Tente novamente

### Mapa de calor vazio
**Causa:** Nenhuma habilidade foi avaliada ainda
**Solução:**
- Lance avaliações com habilidades marcadas
- Cadastre habilidades para a turma
- Verifique filtros selecionados

### Erro 401 Unauthorized
**Causa:** Token JWT expirado ou inválido
**Solução:**
- Faça logout e login novamente
- Verifique se está autenticado
- Token expira após 30 dias

---

## 🔄 Fluxo de Dados

### Geração de Boletim

```
Frontend (Relatorios.js)
  ↓ Clique em "Gerar Boletim"
relatorioService.gerarBoletimAluno(alunoId, ano)
  ↓ GET /api/relatorios/boletim/:alunoId?ano=2026
Backend (relatorioController.js)
  ↓ Busca dados do aluno
  ↓ Busca avaliações
  ↓ Gera PDF com pdfkit
  ↓ Envia response com Content-Type: application/pdf
Frontend
  ↓ Recebe blob
  ↓ Cria link de download
  ↓ Aciona download automático
Usuário recebe PDF
```

### Visualização de Matriz

```
Frontend (Relatorios.js)
  ↓ Clique em "Visualizar Matriz"
relatorioService.getMatrizHabilidades(alunoId, params)
  ↓ GET /api/relatorios/matriz-habilidades/:alunoId
Backend (relatorioController.js)
  ↓ Busca avaliações com habilidades
  ↓ Processa e agrupa dados
  ↓ Calcula evolução percentual
  ↓ Retorna JSON
Frontend
  ↓ setState(matrizHabilidades)
  ↓ Renderiza tabela
Usuário visualiza dados na página
```

---

## 📝 Notas de Desenvolvimento

### Boas Práticas Implementadas

1. **Código Limpo:**
   - Funções com responsabilidade única
   - Nomes descritivos
   - Comentários explicativos
   - Tratamento de erros robusto

2. **Segurança:**
   - Autenticação obrigatória
   - Validação de parâmetros
   - Sanitização de dados
   - Tratamento de erros sem expor detalhes internos

3. **Performance:**
   - Queries otimizadas com populate
   - Índices no banco de dados
   - Paginação quando necessário
   - Cálculos eficientes

4. **Usabilidade:**
   - Interface intuitiva
   - Feedback visual (loading, toasts)
   - Filtros flexíveis
   - Downloads automáticos

---

## 🚀 Melhorias Futuras Sugeridas

1. **Gráficos nos PDFs:**
   - Incluir gráficos Chart.js nos relatórios PDF
   - Usar chartjs-node-canvas para renderizar

2. **Agendamento de Relatórios:**
   - Envio automático por email
   - Geração periódica (semanal, mensal)

3. **Personalização:**
   - Logo da escola nos PDFs
   - Escolha de cores e layout
   - Campos customizáveis

4. **Relatórios Adicionais:**
   - Comparativo entre anos letivos
   - Análise de evolução temporal
   - Previsão de desempenho
   - Relatório de frequência

5. **Exportação:**
   - Exportar para Excel
   - Exportar para CSV
   - Integração com Google Sheets

---

## 📞 Suporte

Para dúvidas sobre o sistema de relatórios:
1. Consulte esta documentação
2. Verifique o README.md principal
3. Acesse a seção de Troubleshooting acima
4. Entre em contato com o desenvolvedor

---

**Desenvolvido com 💚 por Rodrigo Grillo Moreira**
*Sistema de Gestão Escolar - Fevereiro 2026*
