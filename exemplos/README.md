# 📁 Arquivos de Exemplo para Importação

Esta pasta contém arquivos CSV de exemplo que podem ser usados para importar dados em massa no sistema.

## 📋 Arquivos Disponíveis

### 1. `turmas_exemplo.csv`
Arquivo de exemplo com 12 turmas pré-configuradas.

**Colunas:**
- `nome` - Nome da turma (ex: "1º Ano A")
- `ano` - Ano letivo (ex: 2026)
- `serie` - Série/ano escolar (ex: "1º Ano")
- `turno` - Turno da turma: matutino, vespertino, noturno, integral
- `capacidadeMaxima` - Número máximo de alunos (ex: 35)

### 2. `alunos_exemplo.csv`
Arquivo de exemplo com 15 alunos pré-configurados.

**Colunas:**
- `nome` - Nome completo do aluno
- `matricula` - Número de matrícula único (ex: "2026001")
- `dataNascimento` - Data no formato AAAA-MM-DD (ex: "2010-05-15")
- `turma` - Nome exato da turma cadastrada (ex: "1º Ano A")
- `responsavel_nome` - Nome completo do responsável
- `responsavel_telefone` - Telefone de contato
- `responsavel_email` - Email do responsável

## 🚀 Como Usar

### Importar Turmas:
1. Acesse o sistema e vá em **Turmas**
2. Clique em **Nova Turma**
3. Selecione a aba **Importar Arquivo**
4. Clique em **Selecionar Arquivo CSV** e escolha `turmas_exemplo.csv`
5. Revise os dados e clique em **Importar**

### Importar Alunos:
1. **IMPORTANTE:** Certifique-se de que as turmas já foram cadastradas primeiro
2. Acesse o sistema e vá em **Alunos**
3. Clique em **Novo Aluno**
4. Selecione a aba **Importar Arquivo**
5. Clique em **Selecionar Arquivo CSV** e escolha `alunos_exemplo.csv`
6. Revise os dados e clique em **Importar**

## ✏️ Criar Seus Próprios Arquivos

Você pode criar seus próprios arquivos CSV usando:
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- Qualquer editor de texto

### Dicas Importantes:
- Use vírgula (,) como separador
- Primeira linha deve conter os nomes das colunas
- Salve no formato CSV (UTF-8)
- Não deixe linhas em branco
- Para turmas, use turnos válidos: matutino, vespertino, noturno, integral
- Para alunos, o nome da turma deve corresponder exatamente ao nome cadastrado

### Baixar Templates Vazios:
O sistema oferece a opção de baixar templates vazios diretamente:
1. Clique em **Nova Turma** ou **Novo Aluno**
2. Vá na aba **Importar Arquivo**
3. Clique em **Baixar Modelo CSV**

## ⚠️ Erros Comuns

- **Turma não encontrada (alunos):** O nome da turma no CSV deve estar exatamente igual ao nome cadastrado
- **Matrícula duplicada:** Cada matrícula deve ser única no sistema
- **Formato de data inválido:** Use sempre AAAA-MM-DD (ex: 2010-05-15)
- **Turno inválido:** Use apenas: matutino, vespertino, noturno ou integral (tudo minúsculo)

## 📞 Suporte

Em caso de dúvidas ou problemas na importação, verifique:
1. O formato do arquivo CSV
2. Se todas as colunas obrigatórias estão preenchidas
3. Se não há caracteres especiais que possam causar erros
4. Os logs de erro exibidos pelo sistema
