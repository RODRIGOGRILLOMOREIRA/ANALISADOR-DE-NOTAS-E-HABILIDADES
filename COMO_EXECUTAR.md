# 🚀 Guia Rápido: Como Executar a Aplicação

## Status Atual

✅ **Backend**: Dependências instaladas (137 packages)
⏳ **Frontend**: Instalação em andamento...
✅ **Configuração**: Arquivo .env criado

---

## 📋 Passo a Passo

### 1️⃣ Abra DOIS terminais

**Terminal 1 - Backend (Servidor API)**
```powershell
cd "c:\Users\Usuario\Desktop\PROJETO ANALIZADOR DE NOTAS E HABILIDADES\server"
npm run dev
```

**Terminal 2 - Frontend (Aplicação React)**
```powershell
cd "c:\Users\Usuario\Desktop\PROJETO ANALIZADOR DE NOTAS E HABILIDADES\client"
npm start
```

---

## 🌐 Acessar a Aplicação

Após iniciar ambos os servidores:

### Frontend (Interface Visual)
```
http://localhost:3000
```

### Backend (API)
```
http://localhost:5000
```

### Endpoints da API para testar:
- `http://localhost:5000/api/professores` - Lista professores
- `http://localhost:5000/api/disciplinas` - Lista disciplinas
- `http://localhost:5000/api/alunos` - Lista alunos
- `http://localhost:5000/api/turmas` - Lista turmas

---

## 🔐 Login Padrão

```
Email: admin@escola.com
Senha: admin123
```

---

## 📊 Populando o Banco de Dados

Se o banco estiver vazio, execute (no terminal do backend):

```powershell
# Criar dados iniciais (admin, professores, disciplinas, turmas, alunos)
npm run seed

# Criar turmas do 1º ao 9º ano
npm run criar-turmas

# Verificar se tudo foi criado
npm run verificar
```

---

## ⚙️ Pré-requisitos

Antes de executar, certifique-se de ter:

✅ **Node.js** instalado (v14 ou superior)
   - Verificar: `node --version`

✅ **MongoDB** rodando localmente
   - MongoDB Community Server instalado
   - Serviço MongoDB ativo

**OU**

✅ **MongoDB Atlas** configurado (nuvem)
   - Edite `server/.env` com sua connection string

---

## 🔧 Solução de Problemas

### Erro: "Cannot connect to MongoDB"
```powershell
# Inicie o serviço MongoDB
net start MongoDB
```

### Erro: "Port 3000 already in use"
```powershell
# Mate o processo na porta 3000
npx kill-port 3000
```

### Erro: "Port 5000 already in use"
```powershell
# Mate o processo na porta 5000
npx kill-port 5000
```

### Reinstalar dependências
```powershell
# Backend
cd server
rm -r node_modules
npm install

# Frontend
cd client
rm -r node_modules
npm install
```

---

## 📱 Funcionalidades Disponíveis

### ✅ Prontas para uso:
- 🔐 Login/Logout
- 🏠 Dashboard inicial
- 👨‍🏫 CRUD de Professores (completo)
- 📚 CRUD de Disciplinas (completo)
- 📊 Dashboard com gráficos e estatísticas
- 🎨 Sistema de Tema Claro/Escuro (preto e verde ciano)

### ⚠️ Em desenvolvimento:
- 🎓 CRUD de Turmas
- 👨‍🎓 CRUD de Alunos
- 📝 Lançamento de Avaliações
- 🎯 Gestão de Habilidades

---

## 🎨 Sistema de Temas

- **Modo Escuro** (padrão): Fundo preto com verde ciano (#00CED1)
- **Modo Claro**: Fundo branco com verde ciano escuro (#008B8B)
- **Alternar**: Botão no canto superior direito (ícone de sol/lua)

---

## 📚 Documentação

- **README.md** - Visão geral do projeto
- **INSTALACAO.md** - Guia de instalação detalhado
- **API_ENDPOINTS.md** - Documentação completa da API
- **MONGODB_ATLAS.md** - Configuração do MongoDB na nuvem
- **SCRIPTS.md** - Scripts disponíveis
- **TEMA.md** - Sistema de tema claro/escuro

---

## ✨ Pronto!

Agora você pode visualizar:
- **Frontend** em http://localhost:3000
- **Backend API** em http://localhost:5000
- **Páginas funcionais**: Login, Home, Professores, Disciplinas, Dashboard

---

**Dica**: Use Ctrl+C nos terminais para parar os servidores quando terminar.
