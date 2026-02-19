# 🔧 Solução Rápida - Problema de Conexão MongoDB

## ⚠️ Erro Atual

```
Could not connect to any servers in your MongoDB Atlas cluster.
IP isn't whitelisted.
```

## ✅ Soluções

### Opção 1: Adicionar IP no MongoDB Atlas (Recomendado)

1. Acesse [MongoDB Atlas](https://cloud.mongodb.com)
2. Faça login com sua conta
3. Selecione seu cluster
4. Vá em **"Network Access"** (no menu lateral)
5. Clique em **"Add IP Address"**
6. Escolha uma das opções:
   - **"Add Current IP Address"** - Adiciona seu IP atual
   - **"Allow Access from Anywhere"** - `0.0.0.0/0` (desenvolvimento)
7. Clique em **"Confirm"**
8. Aguarde alguns segundos para aplicar

### Opção 2: MongoDB Local (Desenvolvimento)

#### Windows

1. **Instalar MongoDB:**
   ```powershell
   # Com Chocolatey
   choco install mongodb
   
   # Ou baixe em: https://www.mongodb.com/try/download/community
   ```

2. **Iniciar MongoDB:**
   ```powershell
   # Criar pasta de dados
   mkdir C:\data\db
   
   # Iniciar servidor
   mongod
   ```

3. **Atualizar `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/escola
   ```

4. **Reiniciar backend:**
   ```bash
   cd server
   npm run dev
   ```

#### Linux/macOS

1. **Instalar MongoDB:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # macOS (Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Iniciar MongoDB:**
   ```bash
   sudo systemctl start mongod  # Linux
   brew services start mongodb-community  # macOS
   ```

3. **Atualizar `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/escola
   ```

4. **Reiniciar backend:**
   ```bash
   cd server
   npm run dev
   ```

## 🚀 Após Resolver

Execute o seed para popular o banco:

```bash
cd server
node seed-completo.js
```

## 📝 Status Atual do Sistema

- ✅ **Backend:** Pronto (aguardando conexão MongoDB)
- ✅ **Frontend:** Rodando na porta 3000
- ✅ **Suporte Excel:** Implementado e funcionando
- ⏳ **MongoDB:** Precisa de configuração

## 💡 Dica Rápida

Para desenvolvimento, a opção mais rápida é:

1. No MongoDB Atlas, clique em "Allow Access from Anywhere" (`0.0.0.0/0`)
2. Aguarde 30 segundos
3. Reinicie o backend: `Ctrl+C` e depois `npm run dev`

**Importante:** Para produção, sempre use IP específico!

---

**Precisa de ajuda?** Consulte [MONGODB_ATLAS.md](MONGODB_ATLAS.md) para guia completo.
