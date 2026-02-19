# 📋 Guia de Scripts Úteis

Este documento descreve os scripts disponíveis para gerenciar a aplicação.

## Scripts Disponíveis

### 🚀 Servidor

```bash
# Iniciar servidor em produção
npm start

# Iniciar servidor em modo desenvolvimento (com auto-reload)
npm run dev
```

### 🌱 Banco de Dados

#### 1. Seed Inicial
Popula o banco de dados com dados de exemplo para testes:

```bash
npm run seed
```

**Cria:**
- 1 usuário admin (admin@escola.com / admin123)
- 2 professores
- 6 disciplinas
- 2 turmas
- 3 alunos
- Avaliações dos 3 trimestres

#### 2. Criar Turmas do 1º ao 9º Ano
Cria automaticamente as 9 turmas (1º A ao 9º A):

```bash
npm run criar-turmas
```

**Configuração:**
- 1º ao 5º ano: Turno matutino (capacidade 30-32)
- 6º ao 9º ano: Turno vespertino (capacidade 35)
- Disciplinas e professores atribuídos automaticamente

**⚠️ Importante:** Execute o `seed` antes deste script.

#### 3. Gerar Matrículas Automáticas
Gera matrículas no formato AAAANNNN para alunos sem matrícula:

```bash
npm run gerar-matriculas
```

**Formato:** 
- AAAA = Ano atual
- NNNN = Número sequencial (0001, 0002, etc.)
- Exemplo: 20260001, 20260002

#### 4. Verificar Saúde do Banco
Exibe estatísticas completas do banco de dados:

```bash
npm run verificar
```

**Informações exibidas:**
- ✅ Contagem de documentos (usuários, professores, disciplinas, turmas, alunos, avaliações, habilidades)
- 🎓 Ocupação detalhada de cada turma (com indicadores visuais)
- 💾 Uso de armazenamento (MB/GB e % do limite M0)
- 🔗 Índices criados em cada coleção
- 💡 Recomendações de ações necessárias

**Indicadores de ocupação:**
- 🟢 Verde: < 80% da capacidade
- 🟡 Amarelo: 80-99% da capacidade
- 🔴 Vermelho: 100% da capacidade (turma cheia)

## Fluxo Recomendado de Setup

### Primeira vez (ambiente novo):

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env (copie de .env.example)
cp .env.example .env
# Edite o .env com suas credenciais do MongoDB Atlas

# 3. Popular banco com dados iniciais
npm run seed

# 4. Criar turmas do 1º ao 9º ano
npm run criar-turmas

# 5. Verificar se tudo foi criado corretamente
npm run verificar

# 6. Iniciar servidor
npm run dev
```

### Desenvolvimento diário:

```bash
# Verificar saúde do banco
npm run verificar

# Iniciar servidor em modo watch
npm run dev
```

## Resolução de Problemas

### Erro: "Coleção não encontrada"
Execute o seed primeiro:
```bash
npm run seed
```

### Turmas não foram criadas
Certifique-se de que há professores e disciplinas cadastrados:
```bash
npm run verificar
# Se necessário:
npm run seed
npm run criar-turmas
```

### Alunos sem matrícula
Execute o gerador de matrículas:
```bash
npm run gerar-matriculas
```

### Banco cheio (> 512 MB no M0)
1. Verifique o uso:
```bash
npm run verificar
```

2. Considere:
   - Excluir avaliações antigas
   - Arquivar turmas de anos anteriores
   - Fazer upgrade do plano no MongoDB Atlas

## Manutenção Regular

### Semanal:
```bash
npm run verificar  # Monitorar uso de espaço e ocupação das turmas
```

### Início de Ano Letivo:
```bash
# 1. Criar novas turmas para o novo ano
npm run criar-turmas

# 2. Gerar matrículas para novos alunos
npm run gerar-matriculas

# 3. Verificar estrutura
npm run verificar
```

### Fim de Trimestre:
```bash
# Verificar se todas as avaliações foram lançadas
npm run verificar
```

## Personalização dos Scripts

Os scripts estão localizados em:
- `server/seed.js` - Dados iniciais
- `server/scripts/criar-turmas.js` - Criação de turmas
- `server/scripts/gerar-matriculas.js` - Geração de matrículas
- `server/scripts/verificar-saude.js` - Verificação do banco

Você pode editar estes arquivos para personalizar:
- Número de alunos/professores no seed
- Capacidade máxima das turmas
- Formato das matrículas
- Informações exibidas na verificação

## Dicas

💡 **Use `npm run verificar` sempre que tiver dúvidas sobre o estado do banco**

💡 **Antes de adicionar muitos alunos manualmente, considere editar o `seed.js`**

💡 **Os scripts são idempotentes (podem ser executados múltiplas vezes com segurança)**

💡 **Mantenha backups regulares do banco de dados em ambientes de produção**
