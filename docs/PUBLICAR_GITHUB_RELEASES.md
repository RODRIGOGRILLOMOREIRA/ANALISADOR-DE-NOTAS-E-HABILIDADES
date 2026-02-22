# 🚀 Guia de Publicação no GitHub Releases

Este guia explica como publicar o **SGE CENTENÁRIO** no GitHub Releases para habilitar atualizações automáticas.

---

## 📋 Pré-requisitos

1. ✅ Código já enviado para o GitHub (concluído)
2. ✅ Instalador gerado: `dist/SGE CENTENARIO-Setup-1.0.0.exe` (concluído)
3. ⚠️ Token do GitHub necessário

---

## 🔑 Criar Token do GitHub

### Passo 1: Gerar Personal Access Token

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Configure:
   - **Note**: `SGE CENTENÁRIO Auto-Update`
   - **Expiration**: `No expiration` (sem expiração)
   - **Scopes**: Marque apenas:
     - ✅ `repo` (Full control of private repositories)

4. Clique em **"Generate token"**
5. **COPIE O TOKEN** (será exibido apenas uma vez!)

### Passo 2: Configurar Token no Sistema

#### Opção A: Variável de Ambiente Permanente (Recomendado)

**Windows 10/11:**

1. Abra o Menu Iniciar → Pesquise "Variáveis de Ambiente"
2. Clique em "Editar as variáveis de ambiente do sistema"
3. Botão "Variáveis de Ambiente..."
4. Em "Variáveis do usuário", clique em "Novo..."
5. Configure:
   - **Nome**: `GH_TOKEN`
   - **Valor**: Cole o token copiado
6. Clique em "OK" em todas as janelas
7. **REINICIE o VS Code** e todos os terminais

#### Opção B: Sessão Temporária (PowerShell)

```powershell
$env:GH_TOKEN="seu_token_aqui"
npm run publish
```

---

## 🚀 Publicar Release

### Método Automático (Recomendado)

```bash
# Certifique-se que GH_TOKEN está configurado
npm run publish
```

O comando irá:
1. ✅ Compilar React (build de produção)
2. ✅ Empacotar com Electron
3. ✅ Gerar instalador NSIS
4. ✅ Criar release no GitHub
5. ✅ Fazer upload do instalador
6. ✅ Publicar latest.yml para auto-update

### Método Manual (Alternativo)

Se o método automático falhar:

1. **Acesse GitHub Releases:**
   ```
   https://github.com/RODRIGOGRILLOMOREIRA/ANALISADOR-DE-NOTAS-E-HABILIDADES/releases/new
   ```

2. **Configure o Release:**
   - **Tag version**: `v1.0.0`
   - **Release title**: `SGE CENTENÁRIO v1.0.0`
   - **Description**:
   ```markdown
   # 🎓 SGE CENTENÁRIO - Sistema de Gestão Escolar v1.0.0
   
   ## ✨ Primeira versão desktop profissional!
   
   ### 📦 Instalador Windows
   - Arquivo: SGE CENTENARIO-Setup-1.0.0.exe
   - Tamanho: 80,64 MB
   - Ícone personalizado
   - MongoDB Atlas integrado
   - Auto-update habilitado
   
   ### 🚀 Novidades
   - Aplicação desktop nativa com Electron
   - Instalador NSIS profissional
   - Suporte a 6 computadores simultâneos
   - Atualizações automáticas
   - System tray e minimização
   
   ### 📖 Documentação
   - [Guia de Instalação](https://github.com/RODRIGOGRILLOMOREIRA/ANALISADOR-DE-NOTAS-E-HABILIDADES/blob/master/docs/ELECTRON_INSTALACAO.md)
   - [Resumo Técnico](https://github.com/RODRIGOGRILLOMOREIRA/ANALISADOR-DE-NOTAS-E-HABILIDADES/blob/master/docs/RESUMO_ELECTRON.md)
   ```

3. **Anexar Arquivos:**
   - Arraste e solte ou clique "Attach files"
   - Selecione:
     - `dist/SGE CENTENARIO-Setup-1.0.0.exe`
     - `dist/latest.yml`
     - `dist/SGE CENTENARIO-Setup-1.0.0.exe.blockmap`

4. **Publicar:**
   - ✅ Marque "Set as the latest release"
   - ❌ **NÃO** marque "Set as a pre-release"
   - Clique em **"Publish release"**

---

## ✅ Verificar Publicação

Após publicar, verifique:

1. **Release criado:**
   ```
   https://github.com/RODRIGOGRILLOMOREIRA/ANALISADOR-DE-NOTAS-E-HABILIDADES/releases
   ```

2. **Arquivos anexados:**
   - ✅ SGE CENTENARIO-Setup-1.0.0.exe (≈ 80 MB)
   - ✅ latest.yml (≈ 0,3 KB)
   - ✅ SGE CENTENARIO-Setup-1.0.0.exe.blockmap (≈ 90 KB)

3. **Tag criada:**
   ```
   https://github.com/RODRIGOGRILLOMOREIRA/ANALISADOR-DE-NOTAS-E-HABILIDADES/tags
   ```

---

## 🔄 Como Funciona o Auto-Update

### Fluxo de Atualização

1. **Usuário abre o app** → Electron verifica `latest.yml` no GitHub
2. **Nova versão detectada** → Notificação "Atualização disponível"
3. **Usuário clica "Atualizar"** → Download automático em background
4. **Download completo** → "Reiniciar para atualizar"
5. **Reinicia** → Nova versão instalada automaticamente

### Publicar Nova Versão (Futuro)

1. **Atualizar versão** no `package.json`:
   ```json
   {
     "version": "1.0.1"
   }
   ```

2. **Gerar novo instalador:**
   ```bash
   npm run build
   npm run dist
   ```

3. **Publicar no GitHub:**
   ```bash
   npm run publish
   # ou upload manual com tag v1.0.1
   ```

4. **Usuários recebem atualização automaticamente!**

---

## 🔒 Segurança

- ✅ Release **privado** (somente membros autorizados)
- ✅ Token com permissões **mínimas necessárias**
- ✅ Código-fonte **não exposto**
- ✅ Instalador **assinado digitalmente** (opcional - requer certificado)

### Assinatura Digital (Opcional)

Para assinar o instalador e evitar avisos do Windows Defender:

1. Obtenha certificado de Code Signing (Digicert, GlobalSign, etc.)
2. Configure no `electron-builder.yml`:
   ```yaml
   win:
     certificateFile: "caminho/para/certificado.p12"
     certificatePassword: "senha_do_certificado"
   ```

---

## 🐛 Troubleshooting

### Erro: "Cannot find GitHub release"

**Solução:**
- Verifique se `GH_TOKEN` está configurado
- Token deve ter permissão `repo`
- Repositório deve ser privado ou público

### Erro: "Tag already exists"

**Solução:**
```bash
# Deletar tag local e remota
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0

# Criar novamente
git tag v1.0.0
git push origin v1.0.0
```

### Erro: "403 Forbidden"

**Solução:**
- Token expirado ou inválido
- Gere novo token no GitHub
- Atualize variável `GH_TOKEN`

### Build falha com "EPERM"

**Solução:**
- Feche todos os processos (VS Code, terminais)
- Execute PowerShell como Administrador
- Tente novamente

---

## 📞 Próximos Passos

Após publicar com sucesso:

1. ✅ Compartilhe o link do release com os usuários
2. ✅ Instrua a baixar `SGE CENTENARIO-Setup-1.0.0.exe`
3. ✅ Executar o instalador
4. ✅ Aplicativo verifica atualizações automaticamente
5. ✅ Novas versões são distribuídas sem reinstalação completa

---

**Versão do Guia:** 1.0.0  
**Data:** Fevereiro 2026  
**Autor:** SGE CENTENÁRIO Development Team
