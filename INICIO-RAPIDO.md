# 🚀 INÍCIO RÁPIDO - SGE CENTENÁRIO

## ✅ Implementação Electron Completa!

Tudo está pronto! Agora siga estes 3 passos:

---

## 📦 PASSO 1: Instalar Dependências

Execute o arquivo:
```
instalar-dependencias.bat
```

OU manualmente:
```bash
npm install
```

---

## ⚙️ PASSO 2: Configurar MongoDB Atlas

1. Copie `.env.example` para `.env`
2. Cole sua string de conexão do MongoDB Atlas
3. Salve o arquivo

**Exemplo de .env:**
```env
MONGODB_ATLAS_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/sge-centenario
PORT=5000
NODE_ENV=development
```

---

## 🎨 PASSO 3: Converter Logo para Ícone

**Opção Fácil:**
1. Acesse: https://convertio.co/jpg-ico/
2. Upload `docs/LOGO ESCOLA.jpg`
3. Baixe o `.ico`
4. Salve em `build/icon.ico`
5. Copie para `build/installerIcon.ico`

---

## 🧪 TESTAR

```bash
npm run electron-dev
```

Deve abrir a aplicação SGE CENTENÁRIO como programa Windows!

---

## 📦 GERAR INSTALADOR

Execute:
```
gerar-instalador.bat
```

OU manualmente:
```bash
npm run build
npm run dist
```

Resultado:
```
dist/SGE CENTENARIO-Setup-1.0.0.exe
```

---

## 🎯 O QUE VOCÊ PODE FAZER AGORA

### Continuar Desenvolvendo (Normal)
```bash
npm run dev
```
Abre no navegador como sempre!

### Testar como Desktop
```bash
npm run electron-dev
```

### Distribuir para Escola
1. Gere o instalador
2. Envie `SGE CENTENARIO-Setup-1.0.0.exe`
3. Usuários instalam e usam!

---

## 📚 Documentação Completa

Veja `docs/RESUMO_ELECTRON.md` e `docs/ELECTRON_INSTALACAO.md`

---

## ✅ CHECKLIST

- [ ] Dependências instaladas
- [ ] `.env` configurado
- [ ] Ícones em `build/`
- [ ] Testado com `npm run electron-dev`
- [ ] Instalador gerado

**Quando tudo ✅ → PRONTO PARA DISTRIBUIR!** 🎉
