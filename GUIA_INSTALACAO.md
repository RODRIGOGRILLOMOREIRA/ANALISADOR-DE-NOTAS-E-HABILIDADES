# 🎓 SGE CENTENÁRIO - Guia de Instalação

## 📋 Pré-requisitos Obrigatórios

Antes de instalar o SGE CENTENÁRIO, certifique-se de ter instalado:

### 1️⃣ Node.js (Obrigatório)
- **Download:** https://nodejs.org/
- **Versão recomendada:** 18.x ou superior (LTS)
- **Importante:** Marque a opção "Automatically install the necessary tools" durante a instalação

### 2️⃣ MongoDB (Obrigatório para funcionamento completo)
Escolha uma das opções:
- **MongoDB Atlas (Recomendado - Grátis):** https://www.mongodb.com/cloud/atlas
- **MongoDB Community (Local):** https://www.mongodb.com/try/download/community

## 🚀 Processo de Instalação

### Passo 1: Instalar Pré-requisitos
1. Instale o Node.js primeiro
2. Reinicie o computador após a instalação
3. Configure o MongoDB (Atlas ou Local)

### Passo 2: Executar o Instalador
1. Execute `SGE CENTENARIO-Setup-1.0.0.exe`
2. Escolha o diretório de instalação
3. **Aguarde a instalação das dependências** (pode demorar alguns minutos)
4. O aplicativo será iniciado automaticamente ao finalizar

### Passo 3: Configurar Conexão com Banco de Dados
1. Na primeira execução, configure a URL do MongoDB
2. Formato: `mongodb://localhost:27017/sge` (local) ou sua URL do Atlas

## ⚠️ Resolução de Problemas

### Problema: Aplicativo não inicia após instalação

**Solução 1 - Executar Script de Verificação:**
1. Abra o Menu Iniciar
2. Procure por "SGE CENTENARIO"
3. Execute "Verificar Instalacao"
4. Siga as instruções na tela

**Solução 2 - Instalação Manual das Dependências:**
```cmd
cd "C:\Program Files\SGE CENTENARIO\resources\server"
npm install --production
```

**Solução 3 - Executar como Administrador:**
1. Clique com botão direito no atalho do SGE CENTENÁRIO
2. Selecione "Executar como Administrador"

### Problema: Erro ao conectar ao MongoDB

**Verificações:**
1. Certifique-se que o MongoDB está em execução
2. Verifique a URL de conexão nas configurações
3. Se usar MongoDB local: `mongodb://localhost:27017/sge`
4. Se usar Atlas: Verifique se o IP está na whitelist

### Problema: Tela branca ao abrir o aplicativo

**Solução:**
1. Feche completamente o aplicativo (bandeja do sistema)
2. Limpe o cache: Pressione `Ctrl + Shift + Delete` dentro do app
3. Reinicie o aplicativo

## 📞 Suporte

Para mais informações, consulte a documentação em:
- `docs/GUIA_EXECUCAO.md`
- `docs/MONGODB_ATLAS.md`
- `docs/SOLUCAO_MONGODB.md`

## ✅ Verificando a Instalação

Após a instalação, você deve ver:
- ✅ Atalho na área de trabalho
- ✅ Item no Menu Iniciar
- ✅ Aplicativo executando na bandeja do sistema
- ✅ Tela de login do SGE CENTENÁRIO

## 🔧 Desinstalação

Para desinstalar completamente:
1. Painel de Controle → Programas → Desinstalar um programa
2. Selecione "SGE CENTENARIO"
3. Clique em Desinstalar

---

**Versão:** 1.0.0  
**Data:** Fevereiro 2026  
**Copyright:** © 2026 SGE CENTENÁRIO
