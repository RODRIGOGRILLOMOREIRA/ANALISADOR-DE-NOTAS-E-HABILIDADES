# 🎓 SGE CENTENÁRIO - Sistema de Gestão Escolar

Sistema completo de gestão escolar com controle de alunos, professores, turmas, avaliações, habilidades BNCC e frequências. Desenvolvido com React, Node.js, MongoDB Atlas e Electron.

---

## 🖥️ VERSÃO DESKTOP PROFISSIONAL

### ✨ Instalador Windows Disponível!

**SGE CENTENÁRIO** agora está disponível como aplicação desktop nativa para Windows com instalador profissional.

#### 📦 Características

- **Instalador NSIS**: `SGE CENTENARIO-Setup-1.0.0.exe` (80,64 MB)
- **Ícone Personalizado**: Logo da escola em todos os ícones
- **MongoDB Atlas**: Conexão automática com banco de dados na nuvem
- **6 Computadores Simultâneos**: Suporte para múltiplos usuários
- **Auto-Update**: Atualizações automáticas via GitHub Releases
- **System Tray**: Minimiza para barra de tarefas
- **Código Privado**: Repositório privado para proteção de propriedade intelectual

#### 🚀 Instalação

1. Baixe o instalador: `dist/SGE CENTENARIO-Setup-1.0.0.exe`
2. Execute o arquivo
3. Escolha o diretório de instalação (ou use o padrão)
4. Aceite criar ícones na área de trabalho e menu iniciar
5. Clique em "Instalar"
6. Execute "SGE CENTENÁRIO" após a conclusão

O sistema conecta automaticamente ao MongoDB Atlas e inicia o servidor backend na porta 5000.

#### 🔄 Atualizações Automáticas

O sistema verifica atualizações automaticamente ao iniciar e notifica quando uma nova versão está disponível. Updates são baixados e instalados com um clique.

#### 📖 Documentação Adicional

- [Guia Completo de Instalação](docs/ELECTRON_INSTALACAO.md)
- [Resumo Técnico Electron](docs/RESUMO_ELECTRON.md)
- [Conclusão da Implementação](docs/CONCLUSAO_ELECTRON.md)

---

## 🌟 Funcionalidades Principais

### 👥 Gestão de Pessoas
- **Alunos**: CRUD completo, matrícula automática, importação CSV/Excel
- **Professores**: Cadastro com vinculação a turmas e disciplinas
- **Turmas**: Gestão de 1º ao 9º ano com listagem de alunos

### 📊 Avaliações e Desempenho
- **9 Tipos de Avaliação**: Diagnóstica, Formativa, Prova Bimestral, Simulado, etc.
- **Sistema Trimestral**: Cálculo automático (T1×3 + T2×3 + T3×4)/10
- **Importação em Massa**: Planilhas CSV e Excel
- **Validação Automática**: 10 pontos por trimestre
- **Dashboard Analítico**: Gráficos de desempenho por disciplina e período

### 🎯 Habilidades BNCC
- **Cadastro de Habilidades**: Códigos BNCC completos
- **Vinculação com Avaliações**: Rastreamento de desenvolvimento
- **Análise Individual**: Acompanhamento por aluno
- **Dashboard**: Evolução de habilidades em tempo real

### 📅 Controle de Frequência
- **Registro Diário**: Presente, Falta, Falta Justificada, Atestado
- **Interface Visual**: Botões coloridos (Verde/Amarelo/Vermelho/Azul)
- **Salvamento em Lote**: Chamada completa de uma vez
- **Estatísticas**: Percentual de presença em tempo real
- **Alertas**: Identificação automática de alunos com frequência < 75%
- **Importação**: Upload de planilhas de frequência

### 📈 Dashboard e Relatórios
- **Métricas em Tempo Real**: Total de alunos, professores, turmas
- **Gráficos Interativos**: Chart.js com evolução trimestral
- **Filtros Avançados**: Por aluno, turma, disciplina, período
- **Exportação**: Relatórios em CSV e Excel
- **Auto-Refresh**: Atualização automática a cada 30 segundos

### 🎨 Interface e Experiência
- **Tema Claro/Escuro**: Alternância com persistência
- **Cores Personalizadas**: Preto e verde ciano (#00E5CC)
- **Material-UI**: Components modernos e responsivos
- **Animações**: Transições suaves e feedback visual

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18.2**: Biblioteca JavaScript para UI
- **Material-UI 5.14**: Framework de componentes
- **React Router 6.20**: Roteamento
- **Axios 1.6**: Cliente HTTP
- **Chart.js 4.4**: Gráficos
- **PapaParse 5.5**: Parser CSV
- **XLSX 0.18**: Leitura/escrita Excel

### Backend
- **Node.js**: Runtime JavaScript
- **Express 4**: Framework web
- **MongoDB Atlas**: Banco de dados em nuvem
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticação JSON Web Tokens
- **Bcrypt**: Criptografia de senhas
- **Express-Validator**: Validação de dados
- **CORS**: Cross-Origin Resource Sharing

### Desktop
- **Electron 34.5.8**: Framework para apps desktop
- **electron-builder 25.1.8**: Geração de instaladores
- **electron-updater 6.8.3**: Atualizações automáticas
- **NSIS**: Instalador Windows

### DevOps
- **Concurrently**: Execução paralela de scripts
- **Dotenv**: Variáveis de ambiente
- **Nodemon**: Hot reload do servidor

---

## 📁 Estrutura do Projeto

```
PROJETO ANALIZADOR DE NOTAS E HABILIDADES/
├── client/                      # Frontend React
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── context/             # Context API (Auth, Theme, School)
│   │   ├── hooks/               # Custom Hooks
│   │   ├── pages/               # Páginas (Dashboard, Alunos, etc.)
│   │   ├── services/            # API client
│   │   ├── styles/              # CSS global
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                      # Backend Node.js
│   ├── src/
│   │   ├── config/              # Configurações (database)
│   │   ├── controllers/         # Lógica de negócio
│   │   ├── middleware/          # Auth, validações
│   │   ├── models/              # Schemas MongoDB
│   │   ├── routes/              # Rotas da API
│   │   ├── utils/               # Helpers
│   │   └── server.js            # Entry point
│   ├── scripts/                 # Scripts utilitários
│   └── package.json
│
├── electron/                    # Aplicação Desktop
│   ├── main.js                  # Processo principal Electron
│   ├── preload.js               # Preload script
│   └── config/
│       └── database.js          # Config MongoDB Atlas
│
├── build/                       # Assets para build
│   ├── icon.ico                 # Ícone do app
│   └── installerIcon.ico        # Ícone do instalador
│
├── dist/                        # Build de distribuição
│   ├── SGE CENTENARIO-Setup-1.0.0.exe  # Instalador Windows
│   ├── latest.yml               # Metadados auto-update
│   └── win-unpacked/            # App descompactado
│
├── docs/                        # Documentação
│   ├── ELECTRON_INSTALACAO.md
│   ├── RESUMO_ELECTRON.md
│   ├── API_ENDPOINTS.md
│   └── ...
│
├── exemplos/                    # Templates CSV
│   ├── alunos_exemplo.csv
│   ├── turmas_exemplo.csv
│   ├── avaliacoes_exemplo.csv
│   └── frequencias_exemplo.csv
│
├── .env                         # Variáveis de ambiente
├── electron-builder.yml         # Config do builder
├── package.json                 # Config raiz
└── README.md
```

---

## ⚙️ Configuração e Instalação

### Pré-requisitos

- **Node.js** 14+ e npm
- **MongoDB Atlas** (conta gratuita suficiente)
- **Git**

### 1. Clone o Repositório

```bash
git clone https://github.com/RODRIGOGRILLOMOREIRA/ANALISADOR-DE-NOTAS-E-HABILIDADES.git
cd "PROJETO ANALIZADOR DE NOTAS E HABILIDADES"
```

### 2. Configure Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# MongoDB Atlas
MONGODB_ATLAS_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/escola

# Servidor
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRE=7d
```

### 3. Instale Dependências

#### Modo Web (Cliente + Servidor)

```bash
# Instalar dependências do cliente
cd client
npm install

# Instalar dependências do servidor
cd ../server
npm install
```

#### Modo Desktop (Electron)

```bash
# Na raiz do projeto
npm install

# Instala todas as dependências (cliente + servidor + electron)
```

### 4. Execute o Projeto

#### Modo Web

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Servidor rodando em http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
# Cliente rodando em http://localhost:3000
```

#### Modo Desktop

```bash
# Na raiz do projeto
npm run electron-dev
# Abre janela Electron com o app completo
```

---

## 📦 Build e Distribuição

### Build Web para Produção

```bash
# Build do cliente
cd client
npm run build

# Inicia servidor com build estático
cd ../server
npm start
```

### Build Desktop (Instalador Windows)

```bash
# Na raiz do projeto

# 1. Build completo (cliente + servidor + empacotamento)
npm run build

# 2. Gerar instalador
npm run dist

# Instalador gerado em: dist/SGE CENTENARIO-Setup-1.0.0.exe
```

### Publicar para GitHub Releases

```bash
# Cria release privado com auto-update
npm run publish
```

---

## 🎯 Scripts Disponíveis

### Raiz do Projeto (Electron)

- `npm run dev` - Executa cliente e servidor em modo desenvolvimento
- `npm run electron-dev` - Inicia aplicação Electron em modo dev
- `npm run build` - Build de produção (cliente + servidor)
- `npm run dist` - Gera instalador Windows
- `npm run publish` - Publica no GitHub Releases

### Cliente (client/)

- `npm start` - Dev server (http://localhost:3000)
- `npm run build` - Build de produção
- `npm test` - Executa testes

### Servidor (server/)

- `npm start` - Inicia servidor (porta 5000)
- `npm run dev` - Modo desenvolvimento com nodemon
- `npm run seed` - Popula banco com dados de exemplo

---

## 🔐 Autenticação e Segurança

- **JWT Tokens**: Autenticação baseada em tokens
- **Bcrypt**: Hash de senhas com salt
- **Middleware de Auth**: Proteção de rotas
- **CORS**: Configurado para origens permitidas
- **Validação**: Express-validator em todas as rotas
- **MongoDB Injection**: Sanitização de inputs

### Usuário Padrão

Após executar `npm run seed`:

```
Email: admin@escola.com
Senha: admin123
```

---

## 📊 Modelos de Dados

### Aluno
```javascript
{
  nome, email, matricula, dataNascimento,
  turma (ref), responsavel, contato, endereco, status
}
```

### Professor
```javascript
{
  nome, email, cpf, telefone, disciplinas[],
  turmas[], dataAdmissao, status
}
```

### Turma
```javascript
{
  nome, ano, serie, turno, anoLetivo,
  quantidadeAlunos, professorTitular (ref)
}
```

### Avaliacao
```javascript
{
  aluno (ref), disciplina (ref), turma (ref),
  tipo, trimestre, nota, data, observacoes,
  habilidades[]
}
```

### Habilidade
```javascript
{
  codigo, descricao, disciplina, ano,
  nivel (Iniciante/Intermediário/Avançado)
}
```

### Frequencia
```javascript
{
  aluno (ref), turma (ref), disciplina (ref),
  data, status (presente/falta/justificada/atestado),
  observacoes
}
```

---

## 🌐 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Usuário atual

### Alunos
- `GET /api/alunos` - Listar (paginado)
- `GET /api/alunos/:id` - Buscar por ID
- `POST /api/alunos` - Criar
- `PUT /api/alunos/:id` - Atualizar
- `DELETE /api/alunos/:id` - Deletar

### Avaliações
- `GET /api/avaliacoes` - Listar
- `POST /api/avaliacoes` - Criar
- `POST /api/avaliacoes/importar` - Importar CSV/Excel
- `GET /api/avaliacoes/aluno/:id` - Por aluno
- `GET /api/avaliacoes/trimestre/:n` - Por trimestre

### Frequências
- `GET /api/frequencias` - Listar
- `POST /api/frequencias` - Registrar
- `POST /api/frequencias/lote` - Registrar em lote
- `GET /api/frequencias/aluno/:id` - Por aluno
- `GET /api/frequencias/estatisticas` - Estatísticas

### Dashboard
- `GET /api/dashboard/overview` - Métricas gerais
- `GET /api/dashboard/desempenho-disciplina` - Por disciplina
- `GET /api/dashboard/evolucao-habilidades` - Evolução BNCC

**[Documentação Completa da API](docs/API_ENDPOINTS.md)**

---

## 📝 Importação de Dados

O sistema suporta importação em massa via CSV e Excel:

### Formatos Suportados

- **Turmas**: `turmas_exemplo.csv`
- **Alunos**: `alunos_exemplo.csv`
- **Avaliações**: `avaliacoes_exemplo.csv`
- **Frequências**: `frequencias_exemplo.csv`

Exemplos disponíveis em: `exemplos/`

### Como Importar

1. Acesse a página correspondente (Alunos, Avaliações, etc.)
2. Clique em "Importar"
3. Selecione o arquivo CSV ou Excel
4. Confirme a importação
5. Sistema valida e insere os dados automaticamente

---

## 🤝 Contribuindo

Este é um projeto privado para uso institucional. Para sugestões ou melhorias:

1. Entre em contato com o administrador
2. Descreva a funcionalidade ou correção
3. Aguarde aprovação antes de implementar

---

## 📄 Licença

Copyright © 2026 SGE CENTENÁRIO. Todos os direitos reservados.

Este software é proprietário e confidencial. Uso não autorizado é estritamente proibido.

---

## 👨‍💻 Autor

**Rodrigo Grillo Moreira**

- GitHub: [@RODRIGOGRILLOMOREIRA](https://github.com/RODRIGOGRILLOMOREIRA)
- Repositório: [ANALISADOR-DE-NOTAS-E-HABILIDADES](https://github.com/RODRIGOGRILLOMOREIRA/ANALISADOR-DE-NOTAS-E-HABILIDADES)

---

## 🎯 Roadmap Futuro

- [ ] Relatórios PDF automáticos
- [ ] Notificações por email
- [ ] App mobile (React Native)
- [ ] Multi-tenancy (múltiplas escolas)
- [ ] Integração com sistemas de pagamento
- [ ] Painel financeiro
- [ ] Sistema de mensagens interno

---

## 📞 Suporte

Para suporte técnico ou dúvidas, entre em contato através do repositório do GitHub.

**Versão:** 1.0.0  
**Última Atualização:** Fevereiro 2026
