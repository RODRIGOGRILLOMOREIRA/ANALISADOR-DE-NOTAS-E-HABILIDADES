# 📚 Sistema de Cadastro de Turmas e Alunos

## ✨ Funcionalidades Implementadas

### 🎓 Módulo de Turmas

#### Cadastro Manual
- ✅ Formulário completo para cadastro individual
- ✅ Campos: Nome, Ano, Série, Turno, Capacidade Máxima
- ✅ Validação de dados em tempo real
- ✅ Edição e exclusão de turmas
- ✅ Visualização em tabela com filtros

#### Importação em Massa
- ✅ Upload de arquivo CSV
- ✅ Download de template CSV
- ✅ Prévia dos dados antes de importar
- ✅ Validação automática dos dados
- ✅ Relatório de sucesso/erros

**Campos Obrigatórios:**
- Nome da turma
- Série
- Turno (matutino/vespertino/noturno/integral)

**Campos Opcionais:**
- Ano (padrão: ano atual)
- Capacidade Máxima (padrão: 35)

---

### 👨‍🎓 Módulo de Alunos

#### Cadastro Manual
- ✅ Formulário completo separado em seções
- ✅ Dados do Aluno: Nome, Matrícula, Data de Nascimento, Turma
- ✅ Dados do Responsável: Nome, Telefone, Email
- ✅ Vinculação automática com turmas cadastradas
- ✅ Edição e exclusão de alunos
- ✅ Visualização em tabela com dados essenciais

#### Importação em Massa
- ✅ Upload de arquivo CSV
- ✅ Download de template CSV
- ✅ Prévia dos dados antes de importar
- ✅ Vinculação automática com turmas por nome
- ✅ Importação de dados do responsável
- ✅ Validação de matrícula única
- ✅ Relatório de sucesso/erros

**Campos Obrigatórios:**
- Nome completo
- Matrícula (deve ser única)

**Campos Opcionais:**
- Data de Nascimento
- Turma (deve estar cadastrada)
- Dados do responsável

---

## 🚀 Como Usar

### Cadastro Manual - Turmas

1. Acesse **Turmas** no menu
2. Clique em **Nova Turma**
3. Preencha os campos:
   - **Nome da Turma**: Ex: "1º Ano A", "6º Ano B"
   - **Ano**: Ano letivo (ex: 2026)
   - **Série**: Ex: "1º Ano", "6º Ano"
   - **Turno**: Selecione entre Matutino, Vespertino, Noturno ou Integral
   - **Capacidade Máxima**: Número de alunos (1-50)
4. Clique em **Salvar**

### Importação em Massa - Turmas

1. Acesse **Turmas** no menu
2. Clique em **Nova Turma**
3. Vá para a aba **Importar Arquivo**
4. (Opcional) Clique em **Baixar Modelo CSV** para obter o template
5. Prepare seu arquivo CSV com as colunas:
   ```csv
   nome,ano,serie,turno,capacidadeMaxima
   1º Ano A,2026,1º Ano,matutino,35
   ```
6. Clique em **Selecionar Arquivo CSV** e escolha seu arquivo
7. Revise a prévia dos dados
8. Clique em **Importar X Turmas**

### Cadastro Manual - Alunos

1. **IMPORTANTE**: Cadastre as turmas primeiro
2. Acesse **Alunos** no menu
3. Clique em **Novo Aluno**
4. Preencha a seção **Dados do Aluno**:
   - **Nome Completo**: Nome completo do estudante
   - **Matrícula**: Código único (ex: "2026001")
   - **Data de Nascimento**: Use o seletor de data
   - **Turma**: Selecione da lista de turmas cadastradas
5. Preencha a seção **Dados do Responsável**:
   - **Nome do Responsável**
   - **Telefone**: Ex: (11) 98765-4321
   - **Email**: Email de contato
6. Clique em **Salvar**

### Importação em Massa - Alunos

1. **IMPORTANTE**: Cadastre as turmas primeiro
2. Acesse **Alunos** no menu
3. Clique em **Novo Aluno**
4. Vá para a aba **Importar Arquivo**
5. (Opcional) Clique em **Baixar Modelo CSV** para obter o template
6. Prepare seu arquivo CSV com as colunas:
   ```csv
   nome,matricula,dataNascimento,turma,responsavel_nome,responsavel_telefone,responsavel_email
   João Silva,2026001,2010-05-15,1º Ano A,Maria Silva,(11) 98765-4321,maria@email.com
   ```
7. Clique em **Selecionar Arquivo CSV** e escolha seu arquivo
8. Revise a prévia dos dados
9. Clique em **Importar X Alunos**

---

## 📝 Formato dos Arquivos CSV

### Turmas (template_turmas.csv)

```csv
nome,ano,serie,turno,capacidadeMaxima
1º Ano A,2026,1º Ano,matutino,35
2º Ano B,2026,2º Ano,vespertino,32
3º Ano C,2026,3º Ano,noturno,30
```

**Valores válidos para turno:**
- `matutino`
- `vespertino`
- `noturno`
- `integral`

### Alunos (template_alunos.csv)

```csv
nome,matricula,dataNascimento,turma,responsavel_nome,responsavel_telefone,responsavel_email
João Silva Santos,2026001,2010-05-15,1º Ano A,Maria Silva,(11) 98765-4321,maria@email.com
Ana Paula Costa,2026002,2011-08-20,1º Ano A,Carlos Costa,(11) 91234-5678,carlos@email.com
```

**Formato da data:** `AAAA-MM-DD` (ex: 2010-05-15)  
**Nome da turma:** Deve corresponder exatamente ao nome cadastrado

---

## ⚙️ Recursos Técnicos

### Interface do Usuário
- 🎨 Design Material-UI moderno e responsivo
- 📱 Funciona em desktop, tablet e mobile
- 🔄 Feedback visual em tempo real
- ✅ Validação de formulários
- 🔔 Notificações toast para ações

### Importação de Dados
- 📄 Suporte a arquivos CSV
- 🔍 Validação automática de dados
- 📊 Prévia antes de importar
- ⚡ Processamento em lote otimizado
- 📈 Relatório de importação detalhado

### Gerenciamento
- ✏️ Edição inline de registros
- 🗑️ Exclusão lógica ()
- 🔗 Relacionamento automático entre entidades
- 🔢 Geração automática de códigos
- 📋 Listagem com paginação e filtros

---

## 🎯 Exemplos Práticos

A pasta `/exemplos` contém arquivos CSV prontos para teste:

1. **turmas_exemplo.csv** - 12 turmas de exemplo
2. **alunos_exemplo.csv** - 15 alunos de exemplo

Para testar o sistema:
1. Importe primeiro o arquivo `turmas_exemplo.csv`
2. Depois importe o arquivo `alunos_exemplo.csv`

---

## ⚠️ Dicas Importantes

### ✅ Boas Práticas

- **Sempre cadastre turmas antes de alunos**
- Use matrículas únicas e padronizadas (ex: 2026001, 2026002...)
- Mantenha consistência nos nomes das turmas
- Use letras minúsculas para turnos no CSV
- Teste com poucos registros antes de importar em massa

### ❌ Erros Comuns

**"Turma não encontrada"**
- O nome da turma no CSV deve estar exatamente igual ao cadastrado
- Verifique espaços extras e acentuação

**"Matrícula duplicada"**
- Cada matrícula deve ser única no sistema
- Verifique se o aluno já não foi cadastrado

**"Formato de data inválido"**
- Use sempre o formato AAAA-MM-DD
- Exemplo correto: 2010-05-15

**"Turno inválido"**
- Use apenas: matutino, vespertino, noturno, integral
- Tudo em letras minúsculas

---

## 🔧 Tecnologias Utilizadas

- **Frontend**: React, Material-UI, PapaCSV
- **Backend**: Node.js, Express, MongoDB
- **Upload**: Processamento client-side de CSV
- **Validação**: Regras de negócio no frontend e backend

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique este manual
2. Consulte os arquivos de exemplo em `/exemplos`
3. Baixe os templates dentro do sistema
4. Verifique os logs de erro na tela

---

## 🎉 Funcionalidades Futuras

Possíveis melhorias planejadas:
- 📊 Exportação de dados para CSV/Excel
- 🔍 Busca avançada com múltiplos filtros
- 📧 Envio de emails para responsáveis
- 📱 Geração de QR codes para matrículas
- 📈 Relatórios estatísticos
- 🔄 Importação via Excel (.xlsx)
- 📸 Upload de fotos dos alunos
