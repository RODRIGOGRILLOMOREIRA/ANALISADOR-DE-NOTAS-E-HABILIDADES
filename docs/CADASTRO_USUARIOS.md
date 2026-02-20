# Sistema de Cadastro de Usuários

## 📋 Visão Geral

Implementação completa de sistema de auto-cadastro de novos usuários através da página de login, com interface moderna e validações robustas.

## ✨ Funcionalidades

### Página de Cadastro (/register)

#### Design Moderno
- **Layout idêntico ao login**: Mantém a mesma identidade visual
- **Gradientes adaptáveis**:
  - Modo Escuro: #1a1a1a → #2d3748
  - Modo Claro: #667eea → #764ba2
- **Logo da escola**: Exibida no topo (80x80px)
- **Elementos decorativos**: Círculos flutuantes em background

#### Campos do Formulário

1. **Nome Completo**
   - Validação: Campo obrigatório
   - Ícone: PersonOutline
   - AutoFocus: Sim

2. **Email**
   - Validação: Formato de email válido
   - Ícone: Email
   - Pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$`

3. **Tipo de Usuário**
   - Dropdown com 5 opções:
     - Administrador
     - Coordenador
     - Professor (padrão)
     - Aluno
     - Responsável

4. **Senha**
   - Validação: Mínimo 6 caracteres
   - Toggle de visibilidade
   - Ícone: LockOutlined
   - Helper text: "Mínimo 6 caracteres"

5. **Confirmar Senha**
   - Validação: Deve coincidir com senha
   - Toggle de visibilidade independente
   - Ícone: LockOutlined

#### Botões e Navegação

**Botões Superiores:**
- **Voltar (esquerda superior)**: Retorna para /login
  - Ícone: ArrowBack
  - Estilo: Transparente com hover

- **Toggle Tema (direita superior)**: Alterna modo claro/escuro
  - Ícone: Brightness4 / Brightness7
  - Estilo: Transparente com hover

**Botão de Cadastro:**
- Largura completa
- Gradiente baseado no tema
- Loading state com CircularProgress
- Texto: "Cadastrar"

**Link de Login:**
- "Já tem uma conta? **Faça login**"
- Redireciona para /login
- Cor primária com hover underline

## 🔒 Validações

### Frontend (Client-side)

```javascript
// Campos obrigatórios
if (!nome || !email || !senha || !confirmarSenha) {
  return 'Preencha todos os campos';
}

// Confirmação de senha
if (senha !== confirmarSenha) {
  return 'As senhas não coincidem';
}

// Tamanho mínimo da senha
if (senha.length < 6) {
  return 'A senha deve ter no mínimo 6 caracteres';
}

// Formato de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return 'Email inválido';
}
```

### Backend (Server-side)

```javascript
// Verificar se usuário já existe
const userExiste = await User.findOne({ email });
if (userExiste) {
  return res.status(400).json({ message: 'Usuário já existe' });
}

// Senha é automaticamente hasheada pelo mongoose pre-save hook
```

## 🔄 Fluxo de Uso

### 1. Acesso ao Cadastro

**Da página de Login:**
1. Acesse `/login`
2. Clique em "Cadastre-se" (abaixo do botão Entrar)
3. Sistema redireciona para `/register`

**Acesso direto:**
- Digite `/register` na URL

### 2. Preenchimento do Formulário

```
┌─────────────────────────────────┐
│    [Logo da Escola - 80x80]     │
│                                 │
│        Criar Conta              │
│   Sistema de Gestão Escolar     │
├─────────────────────────────────┤
│                                 │
│  Nome Completo _______________  │
│  [PersonOutline]                │
│                                 │
│  Email ________________________ │
│  [Email]                        │
│                                 │
│  Tipo de Usuário ______________ │
│  [Select] ▼ Professor           │
│                                 │
│  Senha ________________________ │
│  [Lock]                  [👁]   │
│  Mínimo 6 caracteres            │
│                                 │
│  Confirmar Senha ______________ │
│  [Lock]                  [👁]   │
│                                 │
│      [  CADASTRAR  ]            │
│                                 │
│  Já tem uma conta? Faça login   │
└─────────────────────────────────┘
```

### 3. Submissão

**Sucesso:**
1. Validações passam
2. POST para `/api/auth/register`
3. Usuário criado no banco
4. Toast de sucesso: "Cadastro realizado com sucesso!"
5. Redirecionamento automático para `/login`
6. Usuário faz login com credenciais criadas

**Erro:**
- Alert vermelho acima do formulário
- Toast de erro
- Campos mantêm valores (exceto senhas)
- Foco no primeiro campo com erro

## 📡 API Endpoint

### Registro de Usuário

```http
POST /api/auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@escola.com",
  "senha": "senha123",
  "tipo": "professor"
}
```

**Resposta de Sucesso (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nome": "João Silva",
  "email": "joao@escola.com",
  "tipo": "professor",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta de Erro (400):**
```json
{
  "message": "Usuário já existe"
}
```

## 🎨 Integração com Tema e Escola

### Context de Escola
```javascript
import { useSchool } from '../context/SchoolContext';

// Dados carregados automaticamente
const { schoolSettings } = useSchool();

// Uso no componente
<Typography>{schoolSettings?.nomeEscola}</Typography>
<Avatar src={schoolSettings?.logo} />
```

### Context de Tema
```javascript
import { useTheme } from '../hooks/useTheme';

// Toggle e estado atual
const { isDarkMode, toggleTheme } = useTheme();

// Gradientes dinâmicos
const gradient = isDarkMode
  ? 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)'
  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
```

## 🔐 Segurança

### Senha
- Mínimo 6 caracteres (frontend)
- Hash bcrypt automático (backend - pre-save hook)
- Nunca retorna senha em responses
- Toggle de visibilidade para UX

### Email
- Validação de formato
- Verificação de unicidade no banco
- Lowercase automático (model)
- Trim de espaços

### Tipo de Usuário
- Valores fixos no dropdown
- Validação no enum do model
- Padrão: 'professor'
- Não permite valores arbitrários

## 📱 Responsividade

### Mobile (xs - sm)
- Container: maxWidth="sm"
- Grid com espaçamento reduzido
- Botões de navegação sempre visíveis
- Formulário em coluna única

### Desktop (md+)
- Container centralizado
- Elementos decorativos visíveis
- Hover effects nos botões
- Sombras mais pronunciadas

## 🎯 Estados do Componente

```javascript
const [formData, setFormData] = useState({
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  tipo: 'professor'  // Valor padrão
});

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

## 🔄 Navegação

### Rotas Configuradas

```javascript
// App.js
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />  {/* NOVA */}
  <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
    {/* Rotas protegidas */}
  </Route>
</Routes>
```

### Links

**Login → Register:**
- Texto: "Não tem uma conta? **Cadastre-se**"
- Posição: Abaixo do botão "Entrar"

**Register → Login:**
- Texto: "Já tem uma conta? **Faça login**"
- Posição: Abaixo do botão "Cadastrar"
- Botão: [← Voltar] no topo esquerdo

## 📊 Mensagens e Feedbacks

### Toasts (React-Toastify)

**Sucesso:**
```javascript
toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
```

**Erro:**
```javascript
toast.error('Usuário já existe');
toast.error('Erro ao realizar cadastro');
```

### Alerts (Material-UI)

```javascript
{error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {error}
  </Alert>
)}
```

## 🎨 Personalização de Cores

### Modo Escuro
```css
background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);
button: linear-gradient(135deg, #00bcd4 0%, #26c6da 100%);
paper: rgba(30, 30, 30, 0.9);
```

### Modo Claro
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
button: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
paper: rgba(255, 255, 255, 0.95);
```

## ✅ Checklist de Implementação

- [x] Criar componente Register.js
- [x] Adicionar rota /register no App.js
- [x] Adicionar link "Cadastre-se" no Login.js
- [x] Importar RouterLink no Login.js
- [x] Implementar validações frontend
- [x] Integração com API de cadastro
- [x] Loading states
- [x] Mensagens de erro/sucesso
- [x] Toggle de tema
- [x] Botão voltar
- [x] Design responsivo
- [x] Integração com SchoolContext
- [x] Toggle de visibilidade de senha

## 🚀 Próximas Melhorias

1. **Email de Confirmação**
   - Enviar email para verificar conta
   - Link de ativação
   - Status: pendente/ativo

2. **Validação de CPF**
   - Campo adicional para CPF
   - Validação de formato
   - Unicidade no banco

3. **Código de Convite**
   - Restrição de cadastro por código
   - Diferentes códigos por tipo de usuário
   - Expiração de códigos

4. **Upload de Foto de Perfil**
   - Ao criar conta
   - Preview antes de enviar
   - Crop de imagem

5. **Termos de Uso**
   - Checkbox obrigatório
   - Modal com termos completos
   - Aceite registrado

6. **CAPTCHA**
   - Proteção contra bots
   - reCAPTCHA v3
   - Validação server-side

## 🎓 Tipos de Usuário e Casos de Uso

### Administrador
- Gestores da escola
- Acesso total ao sistema
- Auto-cadastro permitido

### Coordenador
- Coordenadores pedagógicos
- Gestão de turmas e avaliações
- Auto-cadastro permitido

### Professor
- Docentes da escola
- Lançamento de notas e frequências
- **Tipo padrão** no cadastro

### Aluno
- Estudantes
- Visualização de notas próprias
- Cadastro pode ser restrito

### Responsável
- Pais/tutores
- Acompanhamento de alunos
- Vinculação posterior a alunos

## 📝 Observações Finais

1. **Sem moderação**: Cadastros são imediatos
2. **Status ativo**: Usuários criados já ficam ativos
3. **Sem reCAPTCHA**: Implementar se houver spam
4. **Sem email**: Sistema não envia emails (ainda)
5. **Token retornado**: API retorna token, mas Register redireciona para login
