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

### 3. `avaliacoes_exemplo.csv` ✨ NOVO
Arquivo de exemplo com avaliações (notas) de alunos.

**Colunas Obrigatórias:**
- `matricula_aluno` ou `aluno_nome` - Matrícula ou nome do aluno
- `codigo_disciplina` ou `disciplina_nome` - Código ou nome da disciplina
- `turma_nome` - Nome da turma
- `nota` - Nota de 0 a 10

**Colunas Opcionais:**
- `professor_nome` - Nome do professor
- `ano` - Ano letivo (padrão: ano atual)
- `trimestre` - 1, 2 ou 3 (padrão: 1)
- `tipo_avaliacao` - prova, trabalho, participacao, simulado, atividade, seminario, projeto, pesquisa, outro
- `descricao` - Descrição da avaliação
- `peso` - Peso da nota (padrão: 1)
- `data_avaliacao` - Data no formato AAAA-MM-DD
- **`habilidades_codigos`** 🎯 - Códigos das habilidades BNCC separados por vírgula ou ponto e vírgula (Ex: EF06MA01,EF06MA02)
- `observacoes` - Observações sobre a avaliação

**🎯 Como Preencher Habilidades:**
A coluna `habilidades_codigos` permite vincular habilidades BNCC à avaliação. Você pode:
- Separar por vírgula: `EF06MA01,EF06MA02,EF06MA03`
- Separar por ponto e vírgula: `EF06MA01;EF06MA02;EF06MA03`
- Usar espaços: `EF06MA01, EF06MA02, EF06MA03`
- Deixar vazio se não quiser vincular habilidades

O sistema buscará automaticamente as habilidades cadastradas e vinculará à avaliação.

### 4. `frequencias_exemplo.csv` ✨ NOVO
Arquivo de exemplo com registros de frequência (presença/falta) dos alunos.

**Colunas Obrigatórias:**
- `matricula_aluno` ou `aluno_nome` - Matrícula ou nome do aluno
- `codigo_disciplina` ou `disciplina_nome` - Código ou nome da disciplina
- `turma_nome` - Nome da turma
- `data` - Data da aula no formato AAAA-MM-DD

**Colunas Opcionais:**
- `status` - presente, falta, falta-justificada, atestado (padrão: presente)
- **`status_codigo`** 🚀 - **P**, **F**, **FJ**, **A** (códigos rápidos para status - RECOMENDADO)
- `periodo` - matutino, vespertino, noturno, integral
- `observacao` - Observações sobre a frequência

**🚀 Códigos de Status Rápidos:**
Para facilitar o preenchimento, use a coluna `status_codigo` em vez de escrever por extenso:
- **P** = Presente
- **F** = Falta
- **FJ** = Falta Justificada
- **A** = Atestado
- **Vazio** = Presente (padrão)

💡 **Dica:** Deixe a célula vazia para marcar como presente! Isso torna a marcação de frequência muito mais rápida.

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
5. **RECOMENDADO:** Selecione uma turma específica para baixar um template personalizado com o nome da turma já preenchido 🆕
6. Clique em **Selecionar Arquivo CSV** e escolha `alunos_exemplo.csv` ou o template personalizado
7. Revise os dados e clique em **Importar**

### Importar Avaliações (Notas):
1. **IMPORTANTE:** Certifique-se de que alunos, turmas e disciplinas já foram cadastrados
2. Acesse o sistema e vá em **Avaliações**
3. Clique no botão **Importar**
4. **RECOMENDADO:** Selecione uma turma e disciplina específicas para baixar um template personalizado com todos os alunos e habilidades disponíveis
5. Clique em **Selecionar Arquivo** e escolha `avaliacoes_exemplo.csv` ou o template personalizado
6. Revise os dados e clique em **Importar**

### Importar Frequências:
1. **IMPORTANTE:** Certifique-se de que alunos, turmas e disciplinas já foram cadastrados
2. Acesse o sistema e vá em **Frequências**
3. Clique no botão **Importar**
4. **RECOMENDADO:** Selecione uma turma e disciplina específicas para baixar um template personalizado com todos os alunos
5. Clique em **Selecionar Arquivo** e escolha `frequencias_exemplo.csv` ou o template personalizado
6. **Use os códigos rápidos** (P, F, FJ, A) ou deixe vazio para marcar como presente
7. Revise os dados e clique em **Importar**

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
- Para avaliações e frequências, você pode usar matrícula OU nome do aluno
- Para avaliações e frequências, você pode usar código OU nome da disciplina
- Notas devem ser de 0 a 10
- Status de frequência: presente, falta, falta-justificada, atestado
- **🚀 Para frequências, use códigos P, F, FJ, A na coluna status_codigo para rapidez**
- **Para marcar todos como presentes, deixe a coluna status_codigo vazia**

### Baixar Templates Vazios:
O sistema oferece a opção de baixar templates vazios diretamente:
1. Em cada módulo (Turmas, Alunos, Avaliações, Frequências)
2. Clique no botão **Importar**
3. Clique em **Baixar Template CSV** ou **Baixar Template Excel**

## ⚠️ Erros Comuns

### Geral:
- **Formato de data inválido:** Use sempre AAAA-MM-DD (ex: 2026-03-15)
- **CSV mal formatado:** Certifique-se de usar vírgula como separador

### Turmas:
- **Turno inválido:** Use apenas: matutino, vespertino, noturno ou integral (tudo minúsculo)

### Alunos:
- **Turma não encontrada:** O nome da turma no CSV deve estar exatamente igual ao nome cadastrado
- **Matrícula duplicada:** Cada matrícula deve ser única no sistema

### Avaliações:
- **Aluno/Disciplina/Turma não encontrados:** Certifique-se de que os dados correspondem exatamente aos cadastrados
- **Nota inválida:** Use valores de 0 a 10
- **Trimestre inválido:** Use 1, 2 ou 3
- **Tipo de avaliação inválido:** Use um dos tipos listados acima

### Frequências:
- **Status inválido:** Use: presente, falta, falta-justificada, atestado OU use códigos P, F, FJ, A
- **Código de status inválido:** Use apenas P, F, FJ ou A na coluna status_codigo
- **Data inválida:** Use o formato AAAA-MM-DD
- **Registros duplicados:** Para a mesma data/aluno/disciplina, o registro existente será atualizado

## 📊 Suporte para Excel

Além de CSV, o sistema também aceita arquivos Excel (.xlsx):
- Mesma estrutura de colunas do CSV
- Primeira linha com nomes das colunas
- Dados nas linhas seguintes
- Baixe os templates Excel diretamente no sistema

## 📞 Suporte

Em caso de dúvidas ou problemas na importação, verifique:
1. O formato do arquivo CSV ou Excel
2. Se todas as colunas obrigatórias estão preenchidas
3. Se não há caracteres especiais que possam causar erros
4. Os logs de erro exibidos pelo sistema
5. Se os dados referenciados (turmas, alunos, disciplinas) já existem no sistema
