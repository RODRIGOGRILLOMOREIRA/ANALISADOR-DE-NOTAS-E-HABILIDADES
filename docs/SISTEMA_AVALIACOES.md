# 📊 Sistema de Avaliações - Documentação Completa

## ✨ Funcionalidades Implementadas

### 🎯 Visão Geral
O sistema de avaliações permite o lançamento e gerenciamento completo de notas de alunos por trimestre, com cálculos automáticos e atualização em tempo real.

---

## 🚀 Funcionalidades Principais

### 1. **Lançamento de Notas por Trimestre**
- ✅ Suporte para 3 trimestres (1º, 2º e 3º)
- ✅ Seleção de ano letivo
- ✅ Filtros por turma e disciplina
- ✅ Visualização de todos os alunos da turma

### 2. **Múltiplas Avaliações por Trimestre**
- ✅ Adicionar quantas avaliações forem necessárias
- ✅ Cada avaliação possui:
  - **Tipo** (obrigatório)
  - **Descrição** (opcional)
  - **Nota** (0 a 10)
  - **Peso** (editável)
- ✅ Interface para adicionar/remover avaliações

### 3. **Tipos de Avaliação Disponíveis**

| Tipo | Descrição | Cor |
|------|-----------|-----|
| 🎯 Prova | Avaliações escritas formais | Azul |
| 📝 Trabalho | Trabalhos individuais ou em grupo | Roxo |
| 🙋 Participação | Participação em aulas | Verde |
| 📊 Simulado | Simulados e testes | Laranja |
| ✍️ Atividade | Atividades práticas | Azul claro |
| 🎤 Seminário | Apresentações e seminários | Roxo |
| 🔬 Projeto | Projetos de longo prazo | Azul |
| 🔍 Pesquisa | Pesquisas acadêmicas | Azul claro |
| 📋 Outro | Outros tipos de avaliação | Cinza |

### 4. **Pesos Editáveis**
- ✅ Cada avaliação pode ter peso diferente
- ✅ Peso padrão: 1.0
- ✅ Peso mínimo: 0.1
- ✅ Sem limite máximo
- ✅ Cálculo proporcional automático

**Exemplo de Cálculo:**
```
Avaliação 1: Prova = 8.0 (Peso: 2.0)
Avaliação 2: Trabalho = 9.0 (Peso: 1.0)
Avaliação 3: Participação = 7.0 (Peso: 0.5)

Cálculo:
Soma das notas ponderadas = (8.0 × 2.0) + (9.0 × 1.0) + (7.0 × 0.5)
                           = 16.0 + 9.0 + 3.5
                           = 28.5

Soma dos pesos = 2.0 + 1.0 + 0.5 = 3.5

Nota Trimestral = 28.5 ÷ 3.5 = 8.14
```

### 5. **Cálculo Automático da Nota Trimestral**
- ✅ Calculada em tempo real no frontend
- ✅ Salva automaticamente no backend
- ✅ Fórmula: `(Σ(nota × peso)) / Σ(peso)`
- ✅ Arredondamento para 2 casas decimais
- ✅ Validação de valores (0-10)

### 6. **Cálculo Automático da Média Anual**
- ✅ Média simples dos 3 trimestres
- ✅ Atualização automática
- ✅ Exibida na tabela de alunos
- ✅ Cores indicativas de desempenho:
  - 🟢 Verde: Nota ≥ 7.0 (Aprovado)
  - 🟡 Amarela: Nota entre 5.0 e 6.9 (Recuperação)
  - 🔴 Vermelha: Nota < 5.0 (Reprovado)

**Exemplo de Cálculo da Média Anual:**
```
1º Trimestre: 8.14
2º Trimestre: 7.50
3º Trimestre: 8.86

Média Anual = (8.14 + 7.50 + 8.86) / 3 = 8.17
```

### 7. **Atualização em Tempo Real com Dashboard**
- ✅ Auto-refresh a cada 30 segundos
- ✅ Botão ON/OFF para ativar/desativar
- ✅ Botão manual de atualização
- ✅ Sincronização automática com dashboard
- ✅ Indicador visual de carregamento

---

## 🎨 Interface do Usuário

### Estrutura da Página

```
┌─────────────────────────────────────────┐
│  📊 Lançamento de Avaliações            │
│                          [Auto ON] [⟳]  │
├─────────────────────────────────────────┤
│  Filtros                                │
│  [Turma ▼] [Disciplina ▼] [Trim ▼] [Ano]│
├─────────────────────────────────────────┤
│  Lista de Alunos                        │
│  ┌───────────────────────────────────┐ │
│  │ Matrícula │ Nome │ Notas │ Média │ │
│  │ 2026001   │ João │ 8.5   │ 8.2   │ │
│  │ 2026002   │ Maria│ 9.0   │ 8.8   │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Componentes Principais

#### 1. **Barra de Filtros**
- Seleção de Turma
- Seleção de Disciplina
- Seleção de Trimestre (1º, 2º ou 3º)
- Ano Letivo (editável)

#### 2. **Tabela de Alunos**
Colunas:
- **Matrícula**: Código único do aluno
- **Nome**: Nome completo
- **Avaliações**: Quantidade de avaliações lançadas
- **Nota Trimestral**: Nota calculada (com cor)
- **Média Anual**: Média dos 3 trimestres (com cor)
- **Ações**: Botões de editar/excluir

#### 3. **Diálogo de Lançamento**
Ao clicar em um aluno:
- Cabeçalho com nome e matrícula do aluno
- Lista de avaliações adicionadas
- Botão "Adicionar Nova Avaliação"
- Cards individuais para cada avaliação:
  - Seletor de tipo
  - Campo de descrição
  - Campo de nota (0-10)
  - Campo de peso
  - Botão de remover
- Card de visualização da nota calculada
- Botões de Cancelar e Salvar

---

## 🔧 Como Usar

### Passo a Passo: Lançar Avaliações

#### 1. **Selecionar Contexto**
```
1. Escolha uma Turma
2. Escolha uma Disciplina
3. Escolha o Trimestre (1º, 2º ou 3º)
4. Confirme o Ano (padrão: ano atual)
```

#### 2. **Lançar Notas para um Aluno**
```
1. Na tabela, clique no ícone 📝 do aluno
2. No diálogo aberto:
   - A primeira avaliação vem pré-carregada
   - Preencha:
     * Tipo de avaliação
     * Descrição (opcional)
     * Nota (0 a 10)
     * Peso (padrão: 1.0)
```

#### 3. **Adicionar Múltiplas Avaliações**
```
1. Clique em "Adicionar Nova Avaliação"
2. Preencha os dados da nova avaliação
3. Repita quantas vezes necessário
4. A nota trimestral é calculada automaticamente
```

#### 4. **Editar Pesos**
```
1. Ajuste o valor do peso de cada avaliação
2. O cálculo é atualizado em tempo real
3. Use pesos maiores para avaliações mais importantes
```

#### 5. **Salvar**
```
1. Clique em "Salvar Avaliações"
2. O sistema valida automaticamente:
   - Notas entre 0 e 10
   - Pelo menos uma avaliação válida
3. Sucesso: volta para a lista e atualiza
```

### Passo a Passo: Editar Avaliações

```
1. Clique no ícone ✏️ do aluno
2. As avaliações existentes serão carregadas
3. Modifique conforme necessário:
   - Alterar notas
   - Alterar pesos
   - Adicionar novas avaliações
   - Remover avaliações existentes
4. Clique em "Salvar Avaliações"
```

### Passo a Passo: Excluir Avaliações

```
1. Clique no ícone 🗑️ do aluno
2. Confirme a exclusão
3. IMPORTANTE: Isso remove TODAS as avaliações
   daquele aluno naquele trimestre
```

---

## 📈 Exemplos Práticos

### Exemplo 1: Configuração Tradicional

**Cenário:** Sistema tradicional com 3 avaliações de pesos iguais

```
Disciplina: Matemática
Trimestre: 1º
Aluno: João Silva

Avaliações:
1. Prova 1
   - Tipo: Prova
   - Nota: 8.0
   - Peso: 1.0

2. Prova 2
   - Tipo: Prova
   - Nota: 7.5
   - Peso: 1.0

3. Trabalho
   - Tipo: Trabalho
   - Nota: 9.0
   - Peso: 1.0

Nota Trimestral = (8.0 + 7.5 + 9.0) / 3 = 8.17
```

### Exemplo 2: Pesos Diferenciados

**Cenário:** Prova vale mais que trabalhos

```
Disciplina: Português
Trimestre: 2º
Aluno: Maria Santos

Avaliações:
1. Prova Bimestral
   - Tipo: Prova
   - Nota: 8.5
   - Peso: 3.0

2. Trabalho de Redação
   - Tipo: Trabalho
   - Nota: 9.0
   - Peso: 1.5

3. Participação
   - Tipo: Participação
   - Nota: 10.0
   - Peso: 0.5

Cálculo:
= (8.5 × 3.0) + (9.0 × 1.5) + (10.0 × 0.5)
= 25.5 + 13.5 + 5.0
= 44.0

Soma Pesos = 3.0 + 1.5 + 0.5 = 5.0

Nota Trimestral = 44.0 / 5.0 = 8.80
```

### Exemplo 3: Múltiplas Avaliações Pequenas

**Cenário:** Várias atividades pequenas + uma prova grande

```
Disciplina: História
Trimestre: 3º
Aluno: Pedro Costa

Avaliações:
1. Atividade 1 - Nota: 8.0, Peso: 0.5
2. Atividade 2 - Nota: 9.0, Peso: 0.5
3. Atividade 3 - Nota: 7.5, Peso: 0.5
4. Atividade 4 - Nota: 8.5, Peso: 0.5
5. Seminário - Nota: 9.0, Peso: 1.0
6. Prova Final - Nota: 8.0, Peso: 3.0

Cálculo:
= (8.0×0.5) + (9.0×0.5) + (7.5×0.5) + (8.5×0.5) + (9.0×1.0) + (8.0×3.0)
= 4.0 + 4.5 + 3.75 + 4.25 + 9.0 + 24.0
= 49.5

Soma Pesos = 0.5 + 0.5 + 0.5 + 0.5 + 1.0 + 3.0 = 6.0

Nota Trimestral = 49.5 / 6.0 = 8.25
```

---

## 🔄 Sincronização com Dashboard

### Como Funciona?

1. **Auto-Refresh Ativado (padrão)**
   - A cada 30 segundos, o sistema busca novas avaliações
   - Atualização silenciosa em background
   - Não interrompe o trabalho do usuário

2. **Botão Toggle Auto ON/OFF**
   - Verde: Auto-refresh ativo
   - Cinza: Auto-refresh desativado
   - Clique para alternar

3. **Botão Atualizar Manual**
   - Atualiza imediatamente
   - Útil quando auto-refresh está desativado
   - Desabilitado se filtros não estiverem completos

4. **Impacto no Dashboard**
   - Estatísticas são recalculadas automaticamente
   - Gráficos são atualizados
   - Alunos em risco são identificados
   - Médias são recalculadasem tempo real

---

## ⚙️ Recursos Técnicos

### Frontend (React)
- **Estado Local**: useState para gerenciar dados
- **Efeitos**: useEffect para carregamento e auto-refresh
- **Validação**: Validação em tempo real de notas
- **Cálculos**: Função pura para calcular notas
- **Material-UI**: Interface moderna e responsiva

### Backend (Node.js + MongoDB)
- **Model**: Schema Mongoose com validações
- **Hooks**: Pre-save para calcular notas automaticamente
- **Índices**: Otimizações para queries rápidas
- **API REST**: Endpoints completos CRUD
- **Validações**: Regras de negócio no backend

### Sincronização
- **Polling**: Requisições periódicas (30s)
- **Debounce**: Evita requisições duplicadas
- **Loading States**: Indicadores visuais de carregamento

---

## 🎯 Validações e Regras

### Validações de Nota
- ✅ Nota mínima: 0.0
- ✅ Nota máxima: 10.0
- ✅ Casas decimais: até 2
- ✅ Obrigatória para salvar

### Validações de Peso
- ✅ Peso mínimo: 0.1
- ✅ Sem máximo definido
- ✅ Padrão: 1.0
- ✅ Aceita decimais

### Regras de Negócio
- 📌 Aluno só pode ter UMA avaliação por trimestre/disciplina
- 📌 Cada avaliação pode ter N sub-avaliações
- 📌 Nota trimestral é calculada automaticamente
- 📌 Média anual considera apenas trimestres com nota
- 📌 Não é possível ter avaliação sem aluno/turma/disciplina

---

## 🎨 Indicadores Visuais

### Cores das Notas
```
🟢 Verde (≥ 7.0)  = Aprovado com bom desempenho
🟡 Amarelo (5.0-6.9) = Em recuperação
🔴 Vermelho (< 5.0) = Reprovado
```

### Chips e Badges
- **Matrícula**: Chip azul outlined
- **Quantidade de Avaliações**: Chip azul sólido
- **Nota Trimestral**: Chip colorido por desempenho
- **Média Anual**: Chip outlined colorido

### Ícones
- 📝 Adicionar/Editar
- 🗑️ Excluir
- ⟳ Atualizar
- 💾 Salvar
- ❌ Cancelar

---

## 📱 Responsividade

O sistema é totalmente responsivo:
- **Desktop**: Layout completo com todas as colunas
- **Tablet**: Colunas adaptadas, diálogo full-width
- **Mobile**: Cards verticais, inputs full-width

---

## 🚀 Próximos Passos Sugeridos

### Melhorias Futuras
1. **Exportação de Boletins**
   - Gerar PDF com notas do aluno
   - Exportar planilha Excel da turma

2. **Histórico de Alterações**
   - Log de quem alterou e quando
   - Auditoria de notas

3. **Notificações**
   - Email para responsáveis
   - Alertas de baixo desempenho

4. **Comparativos**
   - Gráficos de evolução por aluno
   - Comparação com média da turma

5. **Recuperação**
   - Sistema de avaliações de recuperação
   - Substituição de notas

---

## ✅ Checklist de Funcionalidades

- [x] Lançamento de notas por trimestre (1º, 2º, 3º)
- [x] Múltiplas avaliações por trimestre
- [x] Pesos editáveis para cada avaliação
- [x] Cálculo automático da nota trimestral
- [x] Cálculo automático da média anual
- [x] 9 tipos diferentes de avaliação
- [x] Interface intuitiva e moderna
- [x] Validações de dados
- [x] Edição de avaliações existentes
- [x] Exclusão de avaliações
- [x] Filtros por turma/disciplina/trimestre
- [x] Cores indicativas de desempenho
- [x] Auto-refresh (30s)
- [x] Atualização manual
- [x] Sincronização com dashboard
- [x] Responsivo (mobile/tablet/desktop)

---

## 🎉 Conclusão

O sistema de avaliações está completo e pronto para uso em produção! Todas as funcionalidades solicitadas foram implementadas seguindo as melhores práticas de desenvolvimento fullstack.

**Para usar:**
1. Acesse o menu "Avaliações"
2. Selecione turma e disciplina
3. Lance as notas dos alunos
4. O sistema calcula tudo automaticamente! 📊✨
