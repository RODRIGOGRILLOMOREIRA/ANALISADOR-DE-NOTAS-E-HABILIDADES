# 🌐 Configuração do MongoDB Atlas

Este guia mostra como configurar o MongoDB Atlas (cloud gratuito) para a aplicação.

## 📋 Passo a Passo

### 1. Criar Conta no MongoDB Atlas

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita
3. Verifique seu email

### 2. Criar um Cluster (Gratuito)

1. Após login, clique em **"Build a Database"**
2. Escolha **"M0 (FREE)"** - Cluster gratuito
3. Selecione o **Provider** (AWS, Google Cloud ou Azure)
4. Escolha a **Region** mais próxima (ex: São Paulo, Brazil)
5. Nomeie o cluster (ex: "Cluster0")
6. Clique em **"Create"** (aguarde 3-5 minutos)

### 3. Configurar Acesso

#### 3.1 Criar Usuário do Banco de Dados

1. Vá em **"Database Access"** (menu lateral)
2. Clique em **"Add New Database User"**
3. Escolha **"Password"** como método de autenticação
4. Defina:
   - **Username**: `escola_admin` (ou o que preferir)
   - **Password**: Clique em "Autogenerate Secure Password" ou crie uma senha forte
   - ⚠️ **IMPORTANTE**: Copie e salve essa senha!
5. Em **"Database User Privileges"**, escolha **"Read and write to any database"**
6. Clique em **"Add User"**

#### 3.2 Configurar IP Whitelist

1. Vá em **"Network Access"** (menu lateral)
2. Clique em **"Add IP Address"**
3. Para **desenvolvimento**, escolha uma das opções:
   - **"Allow Access from Anywhere"** - Adiciona `0.0.0.0/0` (menos seguro, mas funciona de qualquer lugar)
   - **"Add Current IP Address"** - Apenas seu IP atual
4. Clique em **"Confirm"**

⚠️ **Importante**: Para produção, use apenas IPs específicos!

### 4. Obter String de Conexão

1. Volte para **"Database"** (menu lateral)
2. Clique em **"Connect"** no seu cluster
3. Escolha **"Connect your application"**
4. Selecione:
   - **Driver**: Node.js
   - **Version**: 5.5 or later
5. Copie a **Connection String**:
   ```
   mongodb+srv://escola_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 5. Configurar no Projeto

1. Abra o arquivo `.env` na pasta `server/`
2. Substitua `<password>` pela senha real do usuário
3. Adicione o nome do banco de dados antes do `?`:
   ```
   MONGODB_URI=mongodb+srv://escola_admin:SUA_SENHA_AQUI@cluster0.xxxxx.mongodb.net/escola?retryWrites=true&w=majority
   ```

#### Exemplo Completo:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://escola_admin:Ab123456@cluster0.abc123.mongodb.net/escola?retryWrites=true&w=majority
JWT_SECRET=mude_este_secret_para_algo_muito_seguro_123456
```

### 6. Testar Conexão

```bash
cd server
npm run dev
```

Você deve ver:
```
✅ MongoDB conectado: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Servidor rodando na porta 5000
```

### 7. Popular Banco de Dados

```bash
cd server
node seed.js
```

## 📊 Limites do Plano Gratuito (M0)

- ✅ **512 MB de armazenamento** (suficiente para ~5.000-10.000 alunos)
- ✅ **Shared RAM** 
- ✅ **Backups gratuitos** (últimas 24h)
- ✅ **Conexões simultâneas**: 500
- ✅ **100% gratuito para sempre**

### Capacidade Estimada:
- ✅ **300 alunos**: ~5-10 MB
- ✅ **50 professores**: ~1 MB
- ✅ **9 turmas**: <1 MB
- ✅ **Avaliações (3 anos)**: ~50-100 MB
- ✅ **Sobra de espaço**: ~350-400 MB

## 🔐 Segurança

### Para Desenvolvimento:
```
IP Whitelist: 0.0.0.0/0 (qualquer IP)
```

### Para Produção:
1. Use apenas IPs específicos do servidor
2. Habilite autenticação forte
3. Use variáveis de ambiente seguras
4. Não commite o arquivo `.env` no Git

## 🛠️ Ferramentas do MongoDB Atlas

### MongoDB Compass (GUI)
1. Baixe: https://www.mongodb.com/try/download/compass
2. Use a connection string para conectar
3. Navegue visualmente pelo banco

### Atlas Dashboard
- **Collections**: Ver e editar dados
- **Charts**: Criar gráficos
- **Metrics**: Monitorar performance
- **Alerts**: Configurar alertas
- **Logs**: Ver logs de acesso

## 📈 Monitoramento

No Atlas Dashboard você pode ver:
- Número de conexões ativas
- Operações de leitura/escrita por segundo
- Uso de armazenamento
- Performance de queries

## 🔄 Backup

O plano gratuito inclui:
- Snapshot das últimas 24 horas
- Não é possível fazer restore manual
- Para backups avançados, upgrade para M2 ou superior

## 🚀 Upgrade

Quando precisar mais recursos:

| Plano | RAM | Storage | Preço/mês |
|-------|-----|---------|-----------|
| M0 | Shared | 512 MB | **Grátis** |
| M2 | 2 GB | 2 GB | $9 |
| M5 | 2 GB | 5 GB | $25 |

Para esta aplicação (300 alunos), **M0 é suficiente**!

## ❓ Problemas Comuns

### Erro: "MongoServerError: bad auth"
- ✅ Verifique usuário e senha no `.env`
- ✅ Confirme que o usuário foi criado no Atlas

### Erro: "connection timed out"
- ✅ Verifique Network Access (IP Whitelist)
- ✅ Adicione `0.0.0.0/0` para desenvolvimento

### Erro: "database not found"
- ✅ Normal! O banco será criado automaticamente
- ✅ Execute `node seed.js` para popular

### Conexão lenta
- ✅ Use região mais próxima (São Paulo para Brasil)
- ✅ Verifique sua conexão com internet

## 📞 Suporte

- Documentação: https://docs.atlas.mongodb.com/
- Community: https://www.mongodb.com/community/forums/
- Tutoriais: https://university.mongodb.com/

---

**Pronto! Seu banco de dados na nuvem está configurado! ☁️**
