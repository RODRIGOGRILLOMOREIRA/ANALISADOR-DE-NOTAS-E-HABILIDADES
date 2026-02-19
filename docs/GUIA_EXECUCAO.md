# 🚀 Guia Completo de Execução do Sistema

## 📋 Pré-requisitos

- Node.js 16+ instalado
- MongoDB Atlas configurado OU MongoDB local instalado
- Git (opcional, para clonar o repositório)

---

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
# Instalar dependências do backend
cd server
npm install

# Instalar dependências do frontend
cd ../client
npm install
```

### 2. Configurar MongoDB

#### Opção A: MongoDB Atlas (Nuvem - Recomendado)

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Crie um novo cluster
4. Na aba "Network Access", adicione seu IP ou use `0.0.0.0/0` (qualquer IP)
5. Na aba "Database Access", crie um usuário e senha
6. Clique em "Connect" > "Connect your application"
7. Copie a string de conexão

#### Opção B: MongoDB Local

```bash
# Windows (com Chocolatey)
choco install mongodb

# macOS (com Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install mongodb

# Iniciar MongoDB
mongod
```

String de conexão local: `mongodb://localhost:27017/escola`

### 3. Configurar Variáveis de Ambiente

O arquivo `server/.env` já existe. Verifique se está configurado corretamente:

```env
PORT=5000
NODE_ENV=development

# Sua string de conexão do MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/escola?retryWrites=true&w=majority

# JWT Secret (mantenha seguro!)
JWT_SECRET=escola_sistema_gestao_secret_key_2026_super_seguro
JWT_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3000
```

**IMPORTANTE:** Se estiver usando MongoDB Atlas, atualize o `MONGODB_URI` com suas credenciais!

---

## 🎯 Popular o Banco de Dados

### Seed Completo (Recomendado para testes)

Este seed cria um ambiente completo para testes:

```bash
cd server
node seed-completo.js
```

**O que será criado:**
- ✅ 5 usuários (1 admin + 4 professores)
- ✅ 8 disciplinas (Matemática, Português, História, Geografia, Ciências, Inglês, Ed. Física, Arte)
- ✅ 5 turmas (6º ao 9º ano, diferentes turnos)
- ✅ ~25 alunos com dados completos (nome, matrícula, responsável, etc.)
- ✅ Centenas de avaliações (3 trimestres, todas as disciplinas)
- ✅ 11 habilidades BNCC reais com desempenho dos alunos

**Credenciais de acesso:**
- Email: `admin@escola.com`
- Senha: `admin123`

### Seed Simples (Dados mínimos)

```bash
cd server
node seed.js
```

Cria apenas dados básicos para começar.

---

## 🚀 Executar o Sistema

### Backend

```bash
cd server
npm run dev
```

O servidor estará rodando em: `http://localhost:5000`

### Frontend

```bash
cd client
npm start
```

A aplicação será aberta em: `http://localhost:3000`

---

## 📱 Usando o Sistema

### 1. Login

Acesse `http://localhost:3000` e faça login com:
- **Email:** admin@escola.com
- **Senha:** admin123

### 2. Navegação Principal

Após o login, você terá acesso a:

#### 🏠 **Dashboard**
- Estatísticas gerais
- Gráficos de desempenho
- Evolução trimestral
- Alunos em risco

#### 👨‍🏫 **Professores**
- Listar todos os professores
- Criar novo professor
- Editar informações
- Vincular disciplinas

#### 📚 **Disciplinas**
- CRUD completo de disciplinas
- Definir carga horária
- Código da disciplina

#### 🎓 **Turmas**
- Criar turmas manualmente
- **Importar via CSV** (template disponível)
- Vincular disciplinas e professores
- Gerenciar capacidade

#### 👨‍🎓 **Alunos**
- CRUD completo de alunos
- **Importar via CSV** (template disponível)
- Dados do responsável
- Vincular à turma

#### 📝 **Avaliações**
- Selecionar turma + disciplina + trimestre
- Lançar notas para múltiplos alunos
- Tipos de avaliação (prova, trabalho, atividade, etc.)
- Pesos diferenciados
- **Cálculo automático de médias**
- Vincular habilidades BNCC

#### 🎯 **Habilidades**
- Cadastrar habilidades BNCC
- Registrar desempenho por aluno
- 4 níveis: Não Desenvolvido, Em Desenvolvimento, Desenvolvido, Plenamente Desenvolvido
- Observações individuais
- Relatórios por turma

#### 📊 **Relatórios**
- Boletim individual (PDF)
- Desempenho da turma
- Matriz de habilidades
- Mapa de calor
- Habilidades não trabalhadas

---

## 📥 Importação CSV

### Turmas

1. Clique em "Nova Turma"
2. Aba "Importar Arquivo"
3. Baixe o template CSV
4. Preencha com seus dados
5. Faça upload

**Formato do CSV:**
```csv
nome,ano,serie,turno,capacidadeMaxima
6º Ano A,2026,6º Ano,matutino,35
7º Ano B,2026,7º Ano,vespertino,30
```

### Alunos

1. Clique em "Novo Aluno"
2. Aba "Importar Arquivo"
3. Baixe o template CSV
4. Preencha com seus dados
5. Faça upload

**Formato do CSV:**
```csv
nome,matricula,dataNascimento,turma,responsavel_nome,responsavel_telefone,responsavel_email
João Silva,2026001,2010-05-15,6º Ano A,Maria Silva,(11) 98765-4321,maria@email.com
```

---

## 🔄 Fluxo de Uso Recomendado

1. **Configurar dados base:**
   - Criar professores
   - Criar disciplinas

2. **Criar turmas:**
   - Cadastrar turmas
   - Vincular disciplinas e professores

3. **Cadastrar alunos:**
   - Adicionar alunos individualmente ou via CSV
   - Vincular às turmas

4. **Lançar avaliações:**
   - Selecionar turma, disciplina e trimestre
   - Lançar notas
   - Sistema calcula médias automaticamente

5. **Trabalhar habilidades:**
   - Cadastrar habilidades BNCC
   - Avaliar desempenho dos alunos

6. **Gerar relatórios:**
   - Boletins individuais
   - Relatórios de turma
   - Análise de habilidades

---

## 🆘 Solução de Problemas

### Erro ao conectar ao MongoDB

**Problema:** `MongooseServerSelectionError`

**Solução:**
1. Verifique se o MongoDB está rodando
2. Confira o `MONGODB_URI` no arquivo `.env`
3. Se usar Atlas, verifique o IP whitelist
4. Teste a conexão: `mongosh "sua_connection_string"`

### Porta já em uso

**Problema:** `EADDRINUSE: address already in use :::5000`

**Solução:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :5000
kill -9 <PID>
```

### Frontend não carrega dados

**Solução:**
1.Verifique se o backend está rodando
2. Confira o console do navegador (F12)
3. Verifique `client/src/services/api.js` - deve apontar para `http://localhost:5000`

### Erro ao importar CSV

**Solução:**
1. Use UTF-8 como encoding
2. Certifique-se de que os cabeçalhos estão corretos
3. Verifique se não há linhas vazias no final
4. Teste com o template fornecido

---

## 🎨 Recursos Extras

### Tema Dark/Light

- Clique no ícone de sol/lua no topo da aplicação
- Preferência salva no localStorage

### Atalhos Úteis

- **Dashboard:** Clique no logo
- **Busca rápida:** Campo de busca em cada tabela
- **Filtros:** Use os filtros por turma/disciplina/ano

---

## 📞 Suporte

- Documentação completa: `README.md`
- API Endpoints: `API_ENDPOINTS.md`
- Sistema de Avaliações: `SISTEMA_AVALIACOES.md`
- MongoDB Atlas: `MONGODB_ATLAS.md`

---

## 🎉 Pronto!

Seu sistema está configurado e pronto para uso! 

Acesse [http://localhost:3000](http://localhost:3000) e comece a gerenciar sua escola! 🚀
