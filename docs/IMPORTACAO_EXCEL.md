# 📥 Sistema Completo de Importação Excel/CSV

## 🎉 Suporte a Arquivos Excel e CSV

O sistema oferece importação completa de dados via **arquivos Excel (.xlsx, .xls) e CSV** para todos os módulos principais!

### ✨ Módulos com Importação

#### 1. Turmas e Alunos ✅
- ✅ Aceita arquivos `.csv`, `.xlsx` e `.xls`
- ✅ Detecção automática do tipo de arquivo
- ✅ Download de templates em Excel ou CSV
- ✅ Mesma interface para ambos os formatos

#### 2. Avaliações (Notas) ✅ NOVO
- ✅ Importação em lote de notas e avaliações
- ✅ Busca inteligente por matrícula ou nome
- ✅ Suporte para múltiplos tipos de avaliação
- ✅ Cálculo automático de média trimestral

#### 3. Frequências ✅ NOVO
- ✅ Importação em lote de presenças/faltas
- ✅ Atualização inteligente de registros duplicados
- ✅ Validação automática de status
- ✅ Relatórios detalhados de importação

### 📊 Como Usar

#### 1. Importar Turmas via Excel

1. Acesse **Turmas** > **Nova Turma**
2. Clique na aba **"Importar Arquivo"**
3. Clique em **"Baixar Modelo Excel"** (botão verde)
4. Preencha o arquivo Excel com suas turmas:

| nome | ano | serie | turno | capacidadeMaxima |
|------|-----|-------|-------|------------------|
| 1º Ano A | 2026 | 1º Ano | matutino | 35 |
| 2º Ano B | 2026 | 2º Ano | vespertino | 30 |

5. Clique em **"Selecionar Arquivo"**
6. Escolha o arquivo `.xlsx` preenchido
7. Clique em **"Importar"**

#### 2. Importar Alunos via Excel

1. Acesse **Alunos** > **Novo Aluno**
2. Clique na aba **"Importar Arquivo"**
3. **NOVO:** Selecione uma turma específica no dropdown para template personalizado 🆕
   - Template virá com o nome da turma já preenchido
   - Ou deixe vazio para template genérico com exemplos de várias turmas
4. Clique em **"Baixar Modelo Excel"** (botão verde)
5. Preencha o arquivo Excel com seus alunos:

| nome | matricula | dataNascimento | turma | responsavel_nome | responsavel_telefone | responsavel_email |
|------|-----------|----------------|-------|------------------|---------------------|-------------------|
| João Silva | 2026001 | 2010-05-15 | 1º Ano A | Maria Silva | (11) 98765-4321 | maria@email.com |

**💡 Dica:** Se baixou template personalizado, o campo "turma" já estará preenchido!

6. Clique em **"Selecionar Arquivo"**
7. Escolha o arquivo `.xlsx` preenchido
8. Clique em **"Importar"**

### 🔧 Detalhes Técnicos

#### Biblioteca Utilizada
- **Frontend:** `xlsx` (SheetJS)
- Lê arquivos Excel (.xlsx, .xls)
- Converte para JSON automaticamente
- Compatível com todos os navegadores modernos

#### Formatos Aceitos
- ✅ `.csv` - Arquivo CSV padrão
- ✅ `.xlsx` - Excel moderno (2007+)
- ✅ `.xls` - Excel legado (97-2003)

#### Validação
- Mesma validação para ambos os formatos
- Verifica campos obrigatórios
- Feedback detalhado de erros
- Prévia antes de importar

### 💡 Vantagens do Excel

1. **Formatação visual**
   - Cores e bordas para facilitar preenchimento
   - Largura de colunas ajustável
   - Congelamento de painéis

2. **Validação integrada**
   - Listas suspensas (dropdown)
   - Validação de datas
   - Máscaras de telefone

3. **Fórmulas**
   - Cálculos automáticos
   - Concatenação de dados
   - Geração de matrículas sequenciais

4. **Familiar**
   - Maioria dos usuários já conhece Excel
   - Compatível com Google Sheets
   - Fácil de compartilhar

### 🎯 Exemplos de Uso

#### Template de Turmas no Excel

Arquivo: `template_turmas.xlsx`

```
| nome      | ano  | serie   | turno      | capacidadeMaxima |
|-----------|------|---------|------------|------------------|
| 1º Ano A  | 2026 | 1º Ano  | matutino   | 35              |
| 2º Ano B  | 2026 | 2º Ano  | vespertino | 30              |
| 3º Ano C  | 2026 | 3º Ano  | matutino   | 32              |
```

#### Template de Alunos no Excel

Arquivo: `template_alunos.xlsx`

```
| nome         | matricula | dataNascimento | turma    | responsavel_nome | responsavel_telefone | responsavel_email    |
|--------------|-----------|----------------|----------|------------------|---------------------|---------------------|
| João Silva   | 2026001   | 2010-05-15     | 1º Ano A | Maria Silva      | (11) 98765-4321     | maria@email.com     |
| Ana Santos   | 2026002   | 2011-08-20     | 2º Ano B | Carlos Santos    | (11) 91234-5678     | carlos@email.com    |
| Pedro Costa  | 2026003   | 2009-03-10     | 3º Ano C | Lucia Costa      | (11) 99876-5432     | lucia@email.com     |
```

### 🛠️ Solução de Problemas

#### Erro ao importar Excel

**Problema:** "Erro ao ler arquivo Excel"

**Soluções:**
1. Certifique-se de que o arquivo está no formato `.xlsx` ou `.xls`
2. Verifique se as colunas têm os nomes corretos
3. Não deixe linhas vazias no meio da planilha
4. Salve o arquivo antes de importar

#### Dados não aparecem

**Problema:** "Nenhum dado válido encontrado"

**Soluções:**
1. Verifique se a primeira linha contém os cabeçalhos
2. Certifique-se de que os campos obrigatórios estão preenchidos
3. Remova linhas vazias extras
4. Use a primeira aba da planilha

#### Template não baixa

**Problema:** Botão não funciona

**Soluções:**
1. Verifique configurações de pop-up do navegador
2. Permita downloads do site
3. Tente em modo anônimo/privado

### 📱 Compatibilidade

#### Navegadores Suportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ✅ Opera 76+

#### Sistemas Operacionais
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu, Fedora, etc.)

#### Ferramentas Excel Compatíveis
- ✅ Microsoft Excel 2007+
- ✅ Google Sheets (exportar como .xlsx)
- ✅ LibreOffice Calc
- ✅ WPS Office
- ✅ Numbers (Mac - exportar como .xlsx)

### 🚀 Performance

- **Arquivos pequenos** (<100 linhas): Instantâneo
- **Arquivos médios** (100-500 linhas): <2 segundos
- **Arquivos grandes** (500-1000 linhas): <5 segundos
- **Limite recomendado:** 1000 linhas por importação

### 📝 Notas Importantes

1. **Encoding:** Use UTF-8 para caracteres especiais
2. **Datas:** Formato AAAA-MM-DD (2010-05-15)
3. **Turmas:** Nome exato como cadastrado
4. **Telefones:** Qualquer formato é aceito
5. **Emails:** Validação automática

### 🎓 Dicas de Uso

1. **Use o template**
   - Sempre baixe o template atualizado
   - Não modifique os cabeçalhos
   - Adicione linhas conforme necessário

2. **Teste com poucos dados**
   - Importe 2-3 linhas primeiro
   - Verifique se está correto
   - Depois importe o arquivo completo

3. **Backup**
   - Mantenha cópia do arquivo original
   - Salve versões durante preenchimento

4. **Google Sheets**
   - Preencha no Google Sheets
   - Arquivo > Download > Excel (.xlsx)
   - Importe no sistema

### 3. Importar Avaliações (Notas) via Excel 🆕

1. Acesse **Avaliações** no menu
2. Clique no botão **"Importar"** no topo da página
3. Na aba **"Upload"**:
   - Clique em **"Baixar Template Excel"** ou **"Baixar Template CSV"**
   - Preencha o arquivo com as avaliações dos alunos:

| matricula_aluno | aluno_nome | codigo_disciplina | disciplina_nome | turma_nome | professor_nome | ano | trimestre | tipo_avaliacao | descricao | nota | peso | data_avaliacao | observacoes |
|-----------------|------------|-------------------|-----------------|------------|----------------|-----|-----------|----------------|-----------|------|------|----------------|-------------|
| 2026001 | João Silva | MAT | Matemática | 1º Ano A | Prof. Carlos | 2026 | 1 | prova | Prova Bimestral | 8.5 | 3 | 2026-03-15 | Ótimo desempenho |

**Campos Obrigatórios:**
- `matricula_aluno` ou `aluno_nome`
- `codigo_disciplina` ou `disciplina_nome`
- `turma_nome`
- `nota` (0 a 10)

**Campos Opcionais:**
- `professor_nome`, `ano`, `trimestre`, `tipo_avaliacao`, `descricao`, `peso`, `data_avaliacao`, `observacoes`

**Tipos de Avaliação Disponíveis:**
- `prova`, `trabalho`, `participacao`, `simulado`, `atividade`, `seminario`, `projeto`, `pesquisa`, `outro`

4. Clique em **"Selecionar Arquivo"** e escolha seu arquivo
5. Revise a lista de avaliações a serem importadas
6. Clique em **"Importar"**

### 4. Importar Frequências via Excel 🆕

1. Acesse **Frequências** no menu
2. Clique no botão **"Importar"** no topo da página
3. Na aba **"Upload"**:
   - Clique em **"Baixar Template Excel"** ou **"Baixar Template CSV"**
   - Preencha o arquivo com as frequências:

| matricula_aluno | aluno_nome | codigo_disciplina | disciplina_nome | turma_nome | professor_nome | data | status | periodo | observacao |
|-----------------|------------|-------------------|-----------------|------------|----------------|------|--------|---------|------------|
| 2026001 | João Silva | MAT | Matemática | 1º Ano A | Prof. Carlos | 2026-03-01 | presente | matutino | |
| 2026002 | Ana Santos | POR | Português | 1º Ano A | Prof. Maria | 2026-03-01 | falta | matutino | Aluna avisou |

**Campos Obrigatórios:**
- `matricula_aluno` ou `aluno_nome`
- `codigo_disciplina` ou `disciplina_nome`
- `turma_nome`
- `data` (formato: AAAA-MM-DD)

**Campos Opcionais:**
- `professor_nome`, `status`, `periodo`, `observacao`

**Status Disponíveis:**
- `presente` (padrão)
- `falta`
- `falta-justificada`
- `atestado`

**Períodos:**
- `matutino`, `vespertino`, `noturno`, `integral`

4. Clique em **"Selecionar Arquivo"** e escolha seu arquivo
5. Revise a lista de registros a serem importados
6. Clique em **"Importar"**

**💡 Dica:** Para a mesma data/aluno/disciplina, o sistema atualiza o registro existente automaticamente!

### 📊 Recursos Futuros

Planejado para próximas versões:

- 🔜 Importação de Habilidades via Excel
- 🔜 Exportar dados existentes para Excel
- 🔜 Validação avançada no Excel (macros)
- 🔜 Templates com formatação e fórmulas
- 🔜 Importação com vinculação de habilidades

### 📁 Arquivos de Exemplo

Na pasta `exemplos/` você encontra arquivos prontos para testar:

- `turmas_exemplo.csv` - 12 turmas de exemplo
- `alunos_exemplo.csv` - 15 alunos de exemplo
- `avaliacoes_exemplo.csv` - 10 avaliações de exemplo 🆕
- `frequencias_exemplo.csv` - 15 registros de frequência 🆕

### 🎯 Busca Inteligente

O sistema possui **busca inteligente** que facilita a importação:

**Para Alunos:**
- Use `matricula_aluno` (ex: 2026001) **OU**
- Use `aluno_nome` (ex: João Silva)

**Para Disciplinas:**
- Use `codigo_disciplina` (ex: MAT) **OU**
- Use `disciplina_nome` (ex: Matemática)

**Para Turmas e Professores:**
- Use o nome exato ou aproximado (busca case-insensitive)

### 📊 Relatórios de Importação

Após cada importação, você recebe um relatório completo:

**Avaliações:**
- Total de registros processados
- Sucessos (novas avaliações criadas)
- Erros (com detalhes de cada linha)

**Frequências:**
- Total de registros processados
- Criados (novos registros)
- Atualizados (registros existentes)
- Erros (com detalhes de cada linha)

---

**Atualizado em:** 20 de fevereiro de 2026  
**Versão:** 3.0 - Sistema Completo de Importação ✅  
**Novidades:** Importação de Avaliações e Frequências
