# SGE CENTENÁRIO - Instalação e Configuração

## 📋 Índice
1. [Configuração do MongoDB Atlas](#configuração-do-mongodb-atlas)
2. [Desenvolvimento](#desenvolvimento)
3. [Gerar Instalador](#gerar-instalador)
4. [Distribuição](#distribuição)
5. [Atualização Automática](#atualização-automática)

---

## ☁️ Configuração do MongoDB Atlas

### 1. Obter String de Conexão

Você já tem MongoDB Atlas configurado para 6 computadores. Para conectar:

1. Acesse [MongoDB Atlas](https://cloud.mongodb.com/)
2. Faça login na sua conta
3. Selecione seu cluster
4. Clique em **"Connect"**
5. Escolha **"Connect your application"**
6. Copie a string de conexão:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edite `.env` e cole sua string de conexão:
   ```env
   MONGODB_ATLAS_URI=mongodb+srv://seuusuario:suasenha@cluster0.xxxxx.mongodb.net/sge-centenario?retryWrites=true&w=majority
   ```

3. Substitua:
   - `seuusuario` → seu usuário do MongoDB
   - `suasenha` → sua senha
   - `cluster0.xxxxx` → seu cluster
   - `sge-centenario` → nome do banco de dados

### 3. Whitel

ist de IPs

Para que os 6 computadores da escola acessem:

**Opção A: Liberar IP Fixo da Escola**
1. No MongoDB Atlas, vá em **Network Access**
2. Clique **"Add IP Address"**
3. Adicione o IP da sua escola

**Opção B: Liberar Todos IPs** (menos seguro, mas funciona)
1. No MongoDB Atlas, vá em **Network Access**
2. Clique **"Add IP Address"**
3. Adicione: `0.0.0.0/0` (libera todos)

---

## 💻 Desenvolvimento

### Instalar Dependências

```bash
npm install
```

Isso instalará automaticamente as dependências do:
- Raiz (Electron)
- Cliente (React)
- Servidor (Node.js)

### Rodar em Modo Desenvolvimento

**Opção 1: Navegador (Desenvolvimento Normal)**
```bash
npm run dev
```
Abre frontend em `http://localhost:3000`

**Opção 2: Aplicação Electron (Testar como Desktop)**
```bash
npm run electron-dev
```
Abre como aplicação desktop

### Estrutura de Desenvolvimento

```
Você edita normalmente:
├── client/src/        → React (Frontend)
├── server/src/        → Node.js (Backend)
└── docs/              → Documentação

Electron (não mexer no dia a dia):
├── electron/          → Configurações do app desktop
└── build/             → Recursos do instalador
```

---

## 📦 Gerar Instalador

### 1. Preparar Logo/Ícones

A logo está em `docs/LOGO ESCOLA.jpg`. Precisamos converter para `.ico`:

**Usando ferramenta online:**
1. Acesse: https://convertio.co/jpg-ico/
2. Upload `docs/LOGO ESCOLA.jpg`
3. Converter para ICO (256x256)
4. Baixar e salvar como:
   - `build/icon.ico`
   - `build/installerIcon.ico`

**OU execute o script (se tiver ImageMagick instalado):**
```bash
magick convert "docs/LOGO ESCOLA.jpg" -resize 256x256 build/icon.ico
```

### 2. Build de Produção

```bash
npm run build
```

Isso compila:
- ✅ Cliente React (minificado)
- ✅ Servidor Node.js

### 3. Gerar Instalador

```bash
npm run dist
```

Isso gera:
```
dist/
└── SGE CENTENÁRIO-Setup-1.0.0.exe  (Instalador Windows)
```

**Tamanho aproximado:** 60-80 MB

---

## 🚀 Distribuição

### Para Usuários da Escola

1. Envie o arquivo `SGE CENTENÁRIO-Setup-1.0.0.exe`
2. Usuário executa o instalador
3. Instalador cria:
   - ✅ Ícone na Área de Trabalho
   - ✅ Entrada no Menu Iniciar
   - ✅ Atalho "SGE CENTENÁRIO"

### Primeira Execução

Ao clicar no ícone:
1. Sistema conecta automaticamente ao MongoDB Atlas
2. Inicia servidor backend
3. Abre interface do sistema
4. **Usuário não vê nada disso - tudo transparente!**

---

## 🔄 Atualização Automática

### Como Funciona

1. Você gera nova versão (ex: 1.1.0)
2. Publica no GitHub Releases
3. Sistemas instalados verificam atualizações automaticamente
4. Usuário recebe notificação
5. Clica em "Atualizar"
6. Sistema reinicia atualizado

### Publicar Nova Versão

1. **Atualizar versão no `package.json`:**
   ```json
   {
     "version": "1.1.0"
   }
   ```

2. **Commit e Tag:**
   ```bash
   git add .
   git commit -m "feat: nova versão 1.1.0"
   git tag v1.1.0
   git push origin master
   git push --tags
   ```

3. **Publicar Release:**
   ```bash
   npm run publish
   ```

Ou manualmente no GitHub:
- Vá em **Releases** → **Create new release**
- Tag: `v1.1.0`
- Upload: `SGE CENTENÁRIO-Setup-1.1.0.exe`
- Publish release

### Configurar GitHub Token

Para publish automático, crie um token:

1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Marque: `repo` (todas)
4. Copie o token
5. Adicione no `.env`:
   ```env
   GH_TOKEN=ghp_seu_token_aqui
   ```

---

## 🔧 Troubleshooting

### Erro: Não conecta ao MongoDB

**Solução:**
1. Verifique string de conexão no `.env`
2. Verifique IP na whitelist do MongoDB Atlas
3. Teste conexão internet

### Erro: Servidor não inicia

**Solução:**
1. Verifique se porta 5000 está livre
2. Veja logs em: `%APPDATA%\SGE CENTENÁRIO\logs`

### Erro: Aplicação não abre

**Solução:**
1. Clique direito no ícone → "Abrir como administrador"
2. Desinstale e reinstale

---

## 📱 Uso do Sistema

### Minimizar para Bandeja

- Ao fechar a janela, sistema minimiza para bandeja
- Clique no ícone na bandeja para reabrir
- Clique direito → "Sair" para fechar completamente

### Atalhos de Teclado

- `Ctrl + R` → Recarregar página
- `F11` → Tela cheia
- `Alt + F4` → Fechar

### Múltiplos Computadores

Como está usando MongoDB Atlas:
- ✅ Todos os 6 PCs veem os mesmos dados
- ✅ Mudanças sincronizam automaticamente
- ✅ Backup automático na nuvem

---

## 📞 Suporte

Para problemas:
1. Verifique logs em `%APPDATA%\SGE CENTENÁRIO\logs`
2. Teste conexão com MongoDB Atlas
3. Reinstale se necessário

---

## 🎓 Desenvolvedor

**Sistema:** SGE CENTENÁRIO
**Versão:** 1.0.0
**Plataforma:** Windows x64
**Tecnologias:** Electron, React, Node.js, MongoDB Atlas
