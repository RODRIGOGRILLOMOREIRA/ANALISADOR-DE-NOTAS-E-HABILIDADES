# 🎓 Guia de Instalação - Sistema de Gerenciamento Escolar

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior) - [Download](https://nodejs.org/)
- **MongoDB** (versão 4.4 ou superior) - [Download](https://www.mongodb.com/try/download/community)
  - Alternativamente, use MongoDB Atlas (cloud gratuito)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Instalação Passo a Passo

### 1. MongoDB

#### Opção A: MongoDB Local (Windows)
```bash
# Após instalar o MongoDB, inicie o serviço
net start MongoDB

# Ou use o MongoDB Compass para gerenciar visualmente
```

#### Opção B: MongoDB Atlas (Cloud - Recomendado)
1. Acesse https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um cluster (M0 Sandbox - Grátis)
4. Configure acesso à rede (whitelist 0.0.0.0/0 para desenvolvimento)
5. Crie um usuário de banco de dados
6. Copie a string de conexão

### 2. Backend (Servidor)

```bash
# Navegue até a pasta do servidor
cd server

# Instale as dependências
npm install

# Crie o arquivo .env (copie do exemplo)
copy .env.example .env

# Edite o arquivo .env com suas configurações
# notepad .env
```

**Configuração do .env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/escola
# OU use sua string do MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/escola
JWT_SECRET=mude_este_secret_para_algo_seguro_123456
NODE_ENV=development
```

```bash
# Inicie o servidor em modo desenvolvimento
npm run dev

# Se tudo estiver correto, você verá:
# 🚀 Servidor rodando na porta 5000
# ✅ MongoDB conectado: ...
```

### 3. Frontend (Cliente React)

**Abra um NOVO terminal** e execute:

```bash
# Navegue até a pasta do cliente
cd client

# Instale as dependências
npm install

# Inicie a aplicação React
npm start

# O navegador abrirá automaticamente em http://localhost:3000
```

## 👤 Primeiro Acesso

### Criar usuário administrador

Como não há interface para criar o primeiro usuário, use uma ferramenta REST:

#### Opção 1: Via PowerShell (Windows)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"nome":"Admin","email":"admin@escola.com","senha":"admin123","tipo":"admin"}'
```

#### Opção 2: Via Postman/Insomnia
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "nome": "Admin",
  "email": "admin@escola.com",
  "senha": "admin123",
  "tipo": "admin"
}
```

#### Opção 3: Via navegador (depois que o frontend estiver rodando)
Crie um arquivo temporário em `client/src/pages/Register.js` OU use o console do navegador:

```javascript
// Cole no console do navegador (F12) quando estiver em http://localhost:3000
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Admin',
    email: 'admin@escola.com',
    senha: 'admin123',
    tipo: 'admin'
  })
}).then(r => r.json()).then(console.log);
```

### Fazer Login
1. Acesse http://localhost:3000/login
2. Use as credenciais:
   - Email: `admin@escola.com`
   - Senha: `admin123`

## 📱 Estrutura Criada

```
📦 PROJETO ANALIZADOR DE NOTAS E HABILIDADES
├── 📂 server/               # Backend (Node.js + Express + MongoDB)
│   ├── 📂 src/
│   │   ├── 📂 config/       # Configuração do banco de dados
│   │   ├── 📂 controllers/  # Lógica de negócio
│   │   ├── 📂 middleware/   # Autenticação e validação
│   │   ├── 📂 models/       # Modelos do MongoDB
│   │   ├── 📂 routes/       # Rotas da API
│   │   └── server.js        # Arquivo principal do servidor
│   ├── package.json
│   └── .env.example
│
├── 📂 client/               # Frontend (React)
│   ├── 📂 public/
│   ├── 📂 src/
│   │   ├── 📂 components/   # Componentes reutilizáveis
│   │   ├── 📂 context/      # Context API (autenticação)
│   │   ├── 📂 pages/        # Páginas da aplicação
│   │   ├── 📂 services/     # Chamadas à API
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## 🎯 Funcionalidades Implementadas

### ✅ Backend Completo
- [x] Sistema de autenticação com JWT
- [x] CRUD de Professores
- [x] CRUD de Disciplinas
- [x] CRUD de Turmas
- [x] CRUD de Alunos
- [x] Sistema de Avaliações com cálculo automático
- [x] Sistema de Habilidades
- [x] Dashboard com estatísticas e gráficos
- [x] Cálculo automático de notas trimestrais
- [x] Cálculo automático de média anual
- [x] API RESTful completa

### ✅ Frontend Básico
- [x] Estrutura React completa
- [x] Sistema de autenticação
- [x] Layout responsivo com Material-UI
- [x] Páginas de Professores (CRUD completo)
- [x] Páginas de Disciplinas (CRUD completo)
- [x] Dashboard analítico com gráficos
- [x] Rotas protegidas
- [x] Páginas base para demais funcionalidades

## 🔧 Próximos Passos (Desenvolvimento)

1. **Completar páginas de Turmas**: Adicionar formulários e listagens
2. **Completar páginas de Alunos**: Implementar CRUD completo
3. **Completar páginas de Avaliações**: Interface para lançamento de notas
4. **Completar páginas de Habilidades**: Gestão de habilidades por trimestre
5. **Melhorar Dashboard**: Adicionar mais visualizações e filtros
6. **Relatórios**: Gerar PDFs de boletins e relatórios
7. **Responsividade**: Otimizar para uso em dispositivos móveis
8. **PWA**: Transformar em Progressive Web App para instalação no celular

## 🐛 Soluções para Problemas Comuns

### Erro: "Cannot connect to MongoDB"
- Verifique se o MongoDB está rodando
- Confirme a string de conexão no `.env`
- Se usar Atlas, verifique o whitelist de IPs

### Erro: "Port 5000 already in use"
- Mude a porta no `.env` (ex: PORT=5001)
- Ou encerre o processo usando a porta 5000

### Erro: "Module not found"
- Execute `npm install` novamente
- Delete a pasta `node_modules` e `package-lock.json`, depois `npm install`

### Página em branco no React
- Verifique o console do navegador (F12)
- Confirme que o backend está rodando
- Verifique se há erros de CORS

## 📞 Suporte

Este é um projeto base estruturado. Para desenvolvimento completo:
1. Implemente as páginas restantes seguindo o padrão de Professores/Disciplinas
2. Adicione validações nos formulários
3. Implemente tratamento de erros mais robusto
4. Adicione testes automatizados

## 📄 Licença

Projeto educacional - Livre para uso e modificação
