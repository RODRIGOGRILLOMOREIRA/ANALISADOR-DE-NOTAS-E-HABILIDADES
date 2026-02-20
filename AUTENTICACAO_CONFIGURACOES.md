# Sistema de Autenticação e Configurações

## 📋 Visão Geral

Sistema completo de autenticação com interface moderna, gerenciamento de configurações escolares e controle de permissões por tipo de usuário.

## 🎨 Página de Login Moderna

### Características Visuais

#### Modo Escuro
- **Gradiente de fundo**: #1a1a1a → #2d3748 (135deg)
- **Elementos decorativos**: Círculos flutuantes animados
- **Logo da escola**: Avatar 80x80px com logo personalizada ou ícone padrão
- **Botões**: Gradiente cyan (#00bcd4 → #26c6da)

#### Modo Claro
- **Gradiente de fundo**: #667eea → #764ba2 (135deg)
- **Elementos decorativos**: Círculos flutuantes animados
- **Logo da escola**: Avatar 80x80px com logo personalizada ou ícone padrão
- **Botões**: Gradiente roxo (#667eea → #764ba2)

### Funcionalidades

1. **Campos de Login**
   - Email com ícone PersonOutline
   - Senha com ícone LockOutlined e toggle de visibilidade
   - Validação em tempo real

2. **Seletor de Tipo de Usuário**
   - Administrador
   - Coordenador
   - Professor
   - Aluno
   - Responsável

3. **Esqueci Minha Senha**
   - Link que redireciona para `/configuracoes?tab=senha`
   - Abre diretamente na aba de redefinição de senha

4. **Toggle de Tema**
   - Botão no canto superior direito
   - Alterna entre modo claro e escuro

5. **Integração Dinâmica**
   - Carrega nome da escola via API
   - Exibe logo personalizada (se configurada)
   - Fallback para valores padrão

## ⚙️ Página de Configurações

### Aba 1: Informações da Escola

#### Upload de Logo
- **Tamanho recomendado**: 300x300px
- **Formatos aceitos**: PNG, JPG
- **Armazenamento**: Base64 no MongoDB
- **Funcionalidades**:
  - Preview em tempo real
  - Upload com botão
  - Remoção com confirmação
  - Avatar padrão quando não há logo

#### Informações Básicas
- Nome da Escola
- CNPJ
- Código INEP
- Diretor(a)
- Coordenador(a)

#### Endereço Completo
- Rua
- Número
- Complemento
- Bairro
- CEP
- Cidade
- Estado

#### Contato
- Telefone fixo
- Celular
- Email
- Site

### Aba 2: Redefinir Senha

#### Campos
- **Senha Atual**: Obrigatória para validação
- **Nova Senha**: Mínimo 6 caracteres
- **Confirmar Nova Senha**: Deve coincidir

#### Validações
- Senha atual correta
- Senhas novas coincidem
- Comprimento mínimo
- Mensagens de erro claras

### Aba 3: Configurações do Sistema

#### Parâmetros Acadêmicos
- **Ano Letivo Atual**: Número (ex: 2024)
- **Trimestre Atual**: 1, 2 ou 3
- **Nota Mínima para Aprovação**: 0.0 a 10.0
- **Frequência Mínima (%)**: 0 a 100

#### Configurações Salvas
- Botão "Salvar Configurações"
- Loading state durante salvamento
- Toast de confirmação

## 🔐 Sistema de Permissões

### Tipos de Usuário

#### 1. Administrador/Coordenador
- **Acesso**: TOTAL
- **Permissões**:
  - Visualizar todos os dados
  - Criar, editar, excluir registros
  - Gerenciar configurações
  - Upload de logo
  - Alterar parâmetros do sistema
  - Gerenciar usuários

#### 2. Professor
- **Acesso**: RESTRITO À SUA DISCIPLINA
- **Permissões**:
  - Visualizar apenas turmas vinculadas
  - Lançar notas nas suas disciplinas
  - Lançar frequências
  - Visualizar relatórios dos seus alunos
  - Ver habilidades das suas disciplinas

#### 3. Aluno
- **Acesso**: APENAS SEUS DADOS
- **Permissões**:
  - Visualizar suas notas
  - Ver frequências próprias
  - Acessar relatórios pessoais
  - Visualizar habilidades desenvolvidas

#### 4. Responsável
- **Acesso**: DADOS DO(S) ALUNO(S) VINCULADO(S)
- **Permissões**:
  - Visualizar notas dos filhos
  - Ver frequências dos alunos
  - Acessar relatórios dos filhos
  - Acompanhar desenvolvimento

### Middleware de Autenticação

```javascript
// Require auth para todas as rotas protegidas
const { auth } = require('../middleware/auth');

// Apenas admin/coordenador
const { isAdmin } = require('../middleware/auth');

// Professor, admin ou coordenador
const { isProfessor } = require('../middleware/auth');

// Aluno, responsavel ou admin
const { isAlunoOrResponsavel } = require('../middleware/auth');
```

### Exemplos de Uso

```javascript
// Rota acessível apenas por admin
router.put('/settings', auth, isAdmin, updateSettings);

// Rota para professores e admin
router.post('/avaliacoes', auth, isProfessor, criarAvaliacao);

// Rota para alunos e responsáveis
router.get('/minhas-notas', auth, isAlunoOrResponsavel, getMinhasNotas);
```

## 🏫 Context de Escola

### Funcionalidades

```javascript
import { useSchool } from '../context/SchoolContext';

const Component = () => {
  const { schoolSettings, loading, loadSchoolSettings, updateSchoolSettings } = useSchool();
  
  return (
    <div>
      <h1>{schoolSettings?.nomeEscola}</h1>
      <img src={schoolSettings?.logo} />
    </div>
  );
};
```

### Dados Disponíveis

- `schoolSettings.nomeEscola`
- `schoolSettings.logo`
- `schoolSettings.endereco.*`
- `schoolSettings.contato.*`
- `schoolSettings.configuracoes.*`

## 🎯 Layout Atualizado

### AppBar (Topo)
- Logo da escola (32x32px) - apenas desktop
- Nome da escola dinâmico
- Nome do usuário e tipo
- Toggle de tema

### Drawer (Menu Lateral)
- Logo da escola (40x40px)
- Nome da escola
- Menu de navegação completo
- **Nova opção**: Configurações (ícone Settings)

## 🚀 Fluxo de Uso

### 1. Primeiro Acesso
1. Acesse a página de login
2. Sistema mostra nome padrão: "Sistema de Gestão Escolar"
3. Faça login como administrador
4. Acesse Configurações
5. Configure nome, logo e dados da escola
6. Salve as configurações

### 2. Uso Diário
1. Logo e nome aparecem automaticamente no login
2. Após login, logo aparece em todas as páginas
3. Usuários veem apenas o que têm permissão
4. Configurações disponíveis apenas para admin

### 3. Redefinição de Senha
1. Na tela de login, clique em "Esqueceu a senha?"
2. Sistema redireciona para Configurações (aba Senha)
3. Digite senha atual
4. Digite nova senha (2x)
5. Confirme alteração

## 📡 Endpoints da API

### Configurações

```javascript
// Buscar configurações (público - para login page)
GET /api/settings

// Atualizar configurações (admin only)
PUT /api/settings
Headers: Authorization: Bearer {token}
Body: { nomeEscola, endereco, contato, etc }

// Upload logo (admin only)
POST /api/settings/logo
Headers: Authorization: Bearer {token}
Body: { logo: "data:image/png;base64,..." }

// Deletar logo (admin only)
DELETE /api/settings/logo
Headers: Authorization: Bearer {token}
```

### Autenticação

```javascript
// Login
POST /api/auth/login
Body: { email, senha }

// Alterar senha
PUT /api/auth/change-password
Headers: Authorization: Bearer {token}
Body: { senhaAtual, novaSenha }

// Dados do usuário atual
GET /api/auth/me
Headers: Authorization: Bearer {token}
```

## 🎨 Personalização de Cores

### Tema Padrão

```javascript
// Dark Mode
cores: {
  primaria: '#00bcd4',  // Cyan
  secundaria: '#000000', // Preto
  fundo: '#1a1a1a'      // Cinza escuro
}

// Light Mode
cores: {
  primaria: '#667eea',  // Roxo
  secundaria: '#764ba2', // Roxo escuro
  fundo: '#ffffff'      // Branco
}
```

### Como Personalizar

1. Acesse Configurações → Sistema
2. (Funcionalidade futura) Seletor de cores
3. Salve e aplique automaticamente

## 📝 Validações

### Logo
- Tamanho máximo: 2MB (recomendado)
- Formatos: PNG, JPG, JPEG
- Conversão automática para Base64

### Senhas
- Mínimo: 6 caracteres
- Deve coincidir na confirmação
- Senha atual obrigatória para mudança

### Dados da Escola
- Nome da escola: obrigatório
- Email: formato válido
- CEP: padrão brasileiro (opcional)
- CNPJ: validação básica (opcional)

## 🔄 Atualizações em Tempo Real

- Logo atualizada instantaneamente após upload
- Nome da escola reflete em todas as páginas
- Configurações salvas persistem no banco
- Context global mantém dados sincronizados

## 🎯 Próximos Passos

1. **Filtros por Permissão**
   - Professores veem apenas suas turmas/disciplinas
   - Alunos veem apenas seus dados
   - Dashboard personalizado por tipo de usuário

2. **Relatórios Personalizados**
   - Por tipo de usuário
   - Exportação PDF com logo da escola
   - Cabeçalhos personalizados

3. **Notificações**
   - Sistema de avisos por tipo de usuário
   - Alertas de frequência baixa
   - Avisos de notas abaixo da média

4. **Multi-escola**
   - Suporte para múltiplas unidades
   - Configurações por escola
   - Relatórios consolidados
