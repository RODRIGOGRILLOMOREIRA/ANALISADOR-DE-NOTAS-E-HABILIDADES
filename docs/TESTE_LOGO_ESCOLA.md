# Guia de Teste - Logo da Escola

## Problema Corrigido
O logo da escola não estava sendo salvo, atualizado e exibido corretamente nas páginas.

## Correções Realizadas

### Backend
1. **settingsController.js**
   - `uploadLogo()` agora retorna o objeto `settings` completo
   - `deleteLogo()` também retorna o objeto `settings` completo
   - Adicionada validação de tamanho da imagem (máximo 2MB em base64)
   - Logs de erro melhorados

### Frontend

#### 1. SchoolContext.js
   - Adicionado `refreshKey` para forçar re-renderização dos componentes
   - Método `updateSchoolSettings` atualiza o refreshKey automaticamente
   - Logs de debug adicionados

#### 2. Configuracoes.js
   - Upload de logo com redimensionamento automático (máximo 300x300px)
   - Compressão da imagem em JPEG com qualidade 0.8
   - Validação de tipo e tamanho de arquivo
   - Atualização imediata do SchoolContext após upload/remoção
   - Removido setTimeout (atualização síncrona)

#### 3. Layout.js
   - Logo atualiza automaticamente usando `refreshKey`
   - Logs de debug no console
   - Tratamento de erro de carregamento de imagem
   - Logo aparece em 2 lugares:
     - Drawer lateral (80x80px)
     - AppBar superior (40x40px)

#### 4. PageHeader.js
   - Logo atualiza automaticamente usando `refreshKey`
   - Tratamento de erro de carregamento
   - Logo aparece com tamanho 56x56px

#### 5. Login.js e Register.js
   - Logo atualiza automaticamente
   - Tratamento de erro de carregamento
   - Logo aparece com tamanho 80x80px

## Como Testar

### 1. Reiniciar o Servidor Backend
```powershell
cd server
npm start
```

### 2. Reiniciar o Cliente Frontend
```powershell
cd client
npm start
```

### 3. Testar Upload do Logo

1. Faça login no sistema
2. Vá em **Configurações** (menu lateral)
3. Na aba "Escola", clique em **ESCOLHER LOGO**
4. Selecione uma imagem (PNG, JPG ou outras)
5. Aguarde a mensagem "Logo atualizada com sucesso!"
6. Verifique se o logo aparece:
   - ✅ No preview da tela de configurações
   - ✅ No drawer lateral (menu)
   - ✅ No AppBar (barra superior)
   - ✅ Em todas as páginas (PageHeader)

### 4. Verificar Console do Navegador

Abra o Console do Desenvolvedor (F12) e verifique os logs:

```
SchoolSettings carregadas: {nomeEscola: "...", logo: "data:image/jpeg;base64,...", ...}
Layout - SchoolSettings atualizadas: {...}
RefreshKey: 1
Logo carregada no drawer com sucesso
```

### 5. Testar Remoção do Logo

1. Na tela de Configurações, clique em **REMOVER LOGO**
2. Aguarde a mensagem "Logo removida com sucesso!"
3. Verifique se o ícone padrão (School) aparece em todos os lugares

### 6. Testar Navegação entre Páginas

1. Faça upload de um logo
2. Navegue entre as páginas:
   - Dashboard
   - Alunos
   - Professores
   - Turmas
   - etc.
3. Verifique se o logo aparece em **todas** as páginas no PageHeader

### 7. Testar Logout e Login

1. Faça logout
2. Verifique se o logo aparece na tela de Login
3. Faça login novamente
4. Verifique se o logo ainda está presente

## Possíveis Problemas e Soluções

### Problema: Logo não aparece após upload
**Solução:** 
- Limpe o cache do navegador (Ctrl + Shift + Delete)
- Atualize a página (Ctrl + F5)
- Verifique o Console do navegador por erros

### Problema: Erro "Imagem muito grande"
**Solução:** 
- O sistema redimensiona automaticamente para 300x300px
- Se ainda assim der erro, a imagem original pode estar muito grande
- Tente usar uma imagem menor (menos de 5MB)

### Problema: Logo aparece "quebrada"
**Solução:** 
- Verifique se o formato da imagem é suportado (PNG, JPG, JPEG, GIF, WebP)
- Tente fazer upload de outra imagem
- Veja o Console do navegador para erros

### Problema: Logo não persiste após reload
**Solução:** 
- Verifique se o MongoDB está rodando
- Verifique se a conexão com o banco está ativa
- Rode `GET http://localhost:5000/api/settings` no Postman para ver se o logo está salvo

## Verificação Final

Execute este checklist:

- [ ] Logo aparece no Drawer (menu lateral)
- [ ] Logo aparece no AppBar (barra superior)
- [ ] Logo aparece no PageHeader de todas as páginas
- [ ] Logo aparece na tela de Login
- [ ] Logo aparece na tela de Registro
- [ ] Logo persiste após reload da página
- [ ] Logo persiste após logout e login
- [ ] Remoção do logo funciona corretamente
- [ ] Ícone padrão (School) aparece quando não há logo

## Logs de Debug

O sistema agora possui logs de debug que ajudam a identificar problemas:

### No Console do Navegador:
```javascript
// Quando as configurações são carregadas
SchoolSettings carregadas: {...}

// Quando o Layout é atualizado
Layout - SchoolSettings atualizadas: {...}
RefreshKey: 1

// Quando o logo é carregado com sucesso
Logo carregada no drawer com sucesso

// Em caso de erro
Erro ao carregar logo no drawer
Erro ao carregar logo no appbar
Erro ao carregar logo no PageHeader
```

### No Console do Servidor:
```javascript
// Em caso de erro no upload
Erro no uploadLogo: ...

// Em caso de erro na remoção
Erro no deleteLogo: ...
```

## Melhorias Implementadas

1. **Compressão Automática**: Imagens são redimensionadas para 300x300px
2. **Validação de Tamanho**: Máximo 5MB no upload, 2MB após compressão
3. **Validação de Tipo**: Apenas imagens são aceitas
4. **Atualização Imediata**: Sem delays, atualização síncrona
5. **Tratamento de Erros**: Logs detalhados e mensagens amigáveis
6. **Re-renderização Forçada**: Sistema de refreshKey garante atualização visual
7. **Cache Busting**: Uso de key única para cada atualização do logo

## Suporte

Se ainda assim o logo não aparecer, verifique:

1. MongoDB está rodando?
2. Backend está rodando na porta 5000?
3. Frontend está rodando na porta 3000?
4. Há erros no Console do navegador?
5. Há erros no terminal do servidor?

---

**Última atualização:** 19 de fevereiro de 2026
