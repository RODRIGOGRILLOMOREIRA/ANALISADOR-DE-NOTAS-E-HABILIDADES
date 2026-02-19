# 🚀 Script Automático para GitHub

## Execute em 3 Passos:

### 1️⃣ Crie o Repositório no GitHub

**Já abri a página para você!** Na página que abriu (https://github.com/new):

- **Repository name**: `sistema-escolar-notas-habilidades`
- **Description**: `Sistema fullstack de gerenciamento escolar - React, Node.js, MongoDB com tema preto e verde ciano`
- **Visibilidade**: ✅ **Public** (recomendado)
- ❌ **NÃO marque** nenhuma opção (README, .gitignore, license)
- Clique em **"Create repository"**

---

### 2️⃣ Execute o Script Automático

Clique duas vezes no arquivo:
```
conectar-github.bat
```

O script irá:
1. Pedir seu username do GitHub
2. Configurar o repositório remoto
3. Fazer push de todos os arquivos

---

### 3️⃣ Autenticação

Quando pedir credenciais:
- **Username**: Seu username do GitHub
- **Password**: **NÃO use sua senha!** Use um **Personal Access Token**

#### Como Criar Token:
1. Acesse: https://github.com/settings/tokens
2. Clique **"Generate new token (classic)"**
3. Dê um nome: `Sistema Escolar`
4. Marque: ✅ **repo** (controle total)
5. Clique **"Generate token"**
6. **COPIE O TOKEN** (só aparece uma vez!)
7. Cole como senha quando o git pedir

---

## 🎯 Pronto!

Após executar, seu projeto estará em:
```
https://github.com/SEU_USUARIO/sistema-escolar-notas-habilidades
```

---

## 📝 Alternativa Manual (PowerShell)

Se preferir executar manualmente:

```powershell
cd "c:\Users\Usuario\Desktop\PROJETO ANALIZADOR DE NOTAS E HABILIDADES"

# Substitua SEU_USUARIO
git remote add origin https://github.com/SEU_USUARIO/sistema-escolar-notas-habilidades.git
git branch -M main
git push -u origin main
```

---

## ✅ O Que Será Enviado

- ✅ 77+ arquivos de código
- ✅ Documentação completa (12 arquivos .md)
- ✅ Backend + Frontend completos
- ✅ Sistema de temas claro/escuro
- ✅ Scripts de automação

---

**🎉 Tudo pronto para publicar seu portfólio no GitHub!**
