# 📥 Sistema de Importação de Avaliações e Frequências

## 🎯 Visão Geral

Funcionalidade completa de importação em massa de **Avaliações (Notas)** e **Frequências** através de arquivos CSV e Excel, seguindo as mesmas boas práticas já implementadas para Alunos e Turmas.

## ✨ Características Implementadas

### Backend

#### Avaliações
**Endpoint:** `POST /api/avaliacoes/importar`

**Funcionalidades:**
- Importação em lote de avaliações
- Busca inteligente de alunos por matrícula ou nome
- Busca inteligente de disciplinas por código ou nome
- Busca inteligente de turmas e professores por nome
- Validação completa de dados
- Criação ou atualização automática de avaliações existentes
- Relatório detalhado de sucessos e erros

**Campos Suportados:**
- **Obrigatórios:** `matricula_aluno` ou `aluno_nome`, `codigo_disciplina` ou `disciplina_nome`, `turma_nome`, `nota`
- **Opcionais:** `professor_nome`, `ano`, `trimestre`, `tipo_avaliacao`, `descricao`, `peso`, `data_avaliacao`, **`habilidades_codigos`** 🆕, `observacoes`

**🎯 Novidade - Vinculação de Habilidades BNCC:**
- Campo `habilidades_codigos` permite vincular habilidades à avaliação
- Aceita códigos separados por vírgula ou ponto e vírgula (Ex: `EF06MA01,EF06MA02`)
- Sistema busca automaticamente as habilidades cadastradas
- Habilidades são vinculadas à avaliação para análise pedagógica
- Habilidades não encontradas são ignoradas sem gerar erro

**📥 Template Personalizado por Turma:**
**Endpoint:** `GET /api/avaliacoes/template/:turmaId?disciplinaId=X&trimestre=Y&ano=Z`

**Funcionalidades:**
- Gera template CSV/Excel com todos os alunos da turma selecionada
- Inclui informações da disciplina e turma
- Lista todas as habilidades disponíveis para a disciplina selecionada
- Reduz erros de digitação de nomes e matrículas
- Facilita o trabalho do professor com dados pré-preenchidos

#### Frequências
**Endpoint:** `POST /api/frequencias/importar`

**Funcionalidades:**
- Importação em lote de frequências
- Busca inteligente de alunos, disciplinas, turmas e professores
- Atualização automática de registros existentes (mesma data/aluno/disciplina)
- Validação de status e datas
- Cálculo automático de mês e trimestre
- Relatório detalhado com contadores de criados, atualizados e erros

**Campos Suportados:**
- **Obrigatórios:** `matricula_aluno` ou `aluno_nome`, `codigo_disciplina` ou `disciplina_nome`, `turma_nome`, `data`
- **Opcionais:** `professor_nome`, `status` (presente, falta, falta-justificada, atestado), `periodo`, `observacao`

### Frontend

#### Página de Avaliações
- ✅ Botão "Importar" no cabeçalho da página
- ✅ Diálogo de importação com abas (Upload e Instruções)
- ✅ Suporte para CSV e Excel (.xlsx)
- ✅ **Seletores de Turma e Disciplina** para template personalizado 🆕
- ✅ **Exibição de habilidades disponíveis** da disciplina selecionada 🆕
- ✅ Botões para download de templates (CSV e Excel)
- ✅ Preview dos dados antes da importação (inclui habilidades)
- ✅ Feedback visual do processo de importação
- ✅ Mensagens de sucesso e erro detalhadas
- ✅ **Instruções completas** sobre como preencher habilidades 🆕

#### Página de Frequências
- ✅ Botão "Importar" no cabeçalho da página
- ✅ Diálogo de importação com abas (Upload e Instruções)
- ✅ Suporte para CSV e Excel (.xlsx)
- ✅ Botões para download de templates (CSV e Excel)
- ✅ Preview dos dados antes da importação
- ✅ Feedback visual com contadores (criados, atualizados, erros)
- ✅ Mensagens de sucesso e erro detalhadas

### Arquivos de Exemplo

Criados na pasta `exemplos/`:
- ✅ `avaliacoes_exemplo.csv` - 10 registros de exemplo
- ✅ `frequencias_exemplo.csv` - 15 registros de exemplo
- ✅ README.md atualizado com documentação completa

## 📋 Como Usar

### Importar Avaliações

1. **Preparar o arquivo:**
   
   **Opção A - Template Personalizado por Turma (RECOMENDADO):** 🆕
   - Acesse **Avaliações** no menu
   - Clique no botão **Importar**
   - Selecione a aba **Upload**
   - **Selecione a Turma** no dropdown
   - **Selecione a Disciplina** no dropdown
   - O sistema exibirá as **habilidades disponíveis** para aquela disciplina
   - Clique em **Baixar Template CSV** ou **Baixar Template Excel**
   - O arquivo virá com todos os alunos da turma e campos pré-preenchidos
   - Preencha apenas as notas e habilidades desejadas
   
   **Opção B - Template Genérico:**
   - Use o arquivo `exemplos/avaliacoes_exemplo.csv` como referência
   - Preencha todos os dados manualmente

2. **Preencher Habilidades (opcional):** 🎯
   - Na coluna `habilidades_codigos`, adicione os códigos das habilidades BNCC
   - Separe por vírgula ou ponto e vírgula: `EF06MA01,EF06MA02`
   - Os códigos devem corresponder às habilidades cadastradas
   - Deixe vazio se não quiser vincular habilidades

3. **Importar:**
   - Clique em **Selecionar Arquivo** e escolha seu CSV ou Excel
   - Revise a lista de dados a serem importados (com habilidades se preenchidas)
   - Clique em **Importar**

4. **Verificar resultados:**
   - O sistema mostrará quantas avaliações foram importadas com sucesso
   - Erros serão reportados com detalhes
   - As avaliações com habilidades vinculadas aparecerão imediatamente na lista

### Importar Frequências

1. **Preparar o arquivo:**
   - Baixe o template CSV ou Excel diretamente do sistema
   - Ou use o arquivo `exemplos/frequencias_exemplo.csv` como referência
   - Preencha os dados conforme as especificações

2. **Importar:**
   - Acesse **Frequências** no menu
   - Clique no botão **Importar**
   - Selecione a aba **Upload**
   - Clique em **Selecionar Arquivo** e escolha seu CSV ou Excel
   - Revise a lista de dados a serem importados
   - Clique em **Importar**

3. **Verificar resultados:**
   - O sistema mostrará quantas frequências foram criadas e atualizadas
   - Erros serão reportados com detalhes
   - As frequências aparecerão imediatamente na lista

## 🔍 Validações Implementadas

### Avaliações
- ✅ Validação de campos obrigatórios
- ✅ Verificação de existência de aluno, disciplina e turma
- ✅ Validação de nota (0 a 10)
- ✅ Validação de trimestre (1, 2 ou 3)
- ✅ Validação de tipo de avaliação
- ✅ Calculo automático de nota trimestral

### Frequências
- ✅ Validação de campos obrigatórios
- ✅ Verificação de existência de aluno, disciplina e turma
- ✅ Validação de data
- ✅ Validação de status (presente, falta, falta-justificada, atestado)
- ✅ Validação de período
- ✅ Atualização inteligente de registros duplicados

## 🛡️ Boas Práticas Aplicadas

1. **Separação de responsabilidades:**
   - Controllers dedicados para lógica de importação
   - Services no frontend para comunicação com API
   - Componentes reutilizáveis no frontend

2. **Tratamento de erros:**
   - Try-catch em todas as operações críticas
   - Mensagens de erro detalhadas para o usuário
   - Logs no console para debugging
   - Retorno estruturado com detalhes de sucessos e falhas

3. **UX/UI:**
   - Feedback visual durante importação
   - Preview de dados antes de importar
   - Mensagens de sucesso/erro com toast notifications
   - Templates downloadáveis diretamente do sistema
   - Instruções claras no diálogo de importação

4. **Performance:**
   - Processamento em lote no backend
   - Validação antes de salvar no banco
   - Uso de índices no MongoDB para buscas rápidas
   - Queries otimizadas com populate seletivo

5. **Segurança:**
   - Autenticação obrigatória (middleware auth)
   - Validação de permissões (isProfessorOrAdmin para avaliações)
   - Sanitização de dados de entrada
   - Validação de tipos de dados

## 📊 Estrutura de Retorno da API

### Avaliações
```json
{
  "message": "Importação concluída",
  "total": 10,
  "sucesso": 8,
  "erros": 2,
  "detalhes": [
    {
      "linha": 1,
      "status": "sucesso",
      "avaliacaoId": "60f7b3b3b3b3b3b3b3b3b3b3"
    },
    {
      "linha": 2,
      "erro": "Aluno, disciplina ou turma não encontrados",
      "dados": {...}
    }
  ]
}
```

### Frequências
```json
{
  "message": "Importação concluída",
  "total": 15,
  "criados": 10,
  "atualizados": 3,
  "erros": 2,
  "detalhes": [
    {
      "linha": 1,
      "status": "criado",
      "frequenciaId": "60f7b3b3b3b3b3b3b3b3b3b3"
    },
    {
      "linha": 5,
      "status": "atualizado",
      "frequenciaId": "60f7b3b3b3b3b3b3b3b3b3b3"
    }
  ]
}
```

## 🔄 Fluxo de Importação

```
┌─────────────────┐
│   Usuário       │
│ seleciona CSV/  │
│     Excel       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Leitura do    │
│    Arquivo      │
│  (Papa/XLSX)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Validação     │
│   Cliente       │
│  (campos obrig.)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Preview       │
│   dos Dados     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Envio para    │
│      API        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validação      │
│   Servidor      │
│ (busca refs,    │
│  valida dados)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Processamento  │
│   em Lote       │
│ (criar/atualiz.)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Retorno       │
│  Detalhado      │
│ (sucesso/erros) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Feedback      │
│   ao Usuário    │
│  (toast/alert)  │
└─────────────────┘
```

## 📝 Arquivos Modificados

### Backend
- `server/src/controllers/avaliacaoController.js` - Adicionado método `importarAvaliacoes`
- `server/src/controllers/frequenciaController.js` - Adicionado método `importarFrequencias`
- `server/src/routes/avaliacoes.js` - Adicionada rota `/importar`
- `server/src/routes/frequencias.js` - Adicionada rota `/importar`

### Frontend
- `client/src/pages/Avaliacoes.js` - Adicionada funcionalidade de importação
- `client/src/pages/Frequencias.js` - Adicionada funcionalidade de importação
- `client/src/services/index.js` - Adicionados métodos `importar` nos services

### Exemplos
- `exemplos/avaliacoes_exemplo.csv` - Criado
- `exemplos/frequencias_exemplo.csv` - Criado
- `exemplos/README.md` - Atualizado

## 🚀 Próximos Passos (Sugestões)

- [ ] Adicionar validação de habilidades na importação de avaliações
- [ ] Permitir importação de múltiplas notas por aluno/disciplina/trimestre
- [ ] Adicionar opção de exportação de avaliações e frequências
- [ ] Implementar importação assíncrona para arquivos muito grandes
- [ ] Adicionar histórico de importações realizadas
- [ ] Implementar reversão de importações
- [ ] Adicionar suporte para mais formatos (ODS, Google Sheets)

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação em `exemplos/README.md`
2. Baixe os templates diretamente do sistema
3. Verifique o console do navegador para erros detalhados
4. Analise o retorno da API para identificar problemas específicos

---

**Desenvolvido com boas práticas e seguindo os padrões do sistema** ✨
