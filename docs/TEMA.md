# 🎨 Sistema de Tema Claro/Escuro

## Descrição

Sistema de alternância entre tema claro e escuro com cores predominantes **preto** e **verde ciano** (#00CED1).

## Características

### 🌙 Tema Escuro (Padrão)
- **Fundo principal**: #0A0E14 (preto azulado)
- **Fundo de cards**: #151A23 (cinza escuro)
- **Cor primária**: #00CED1 (verde ciano)
- **Cor secundária**: #00FFFF (ciano brilhante)
- **Texto**: #E6E8EA (branco suave)
- **Drawer**: #000000 (preto puro)

### ☀️ Tema Claro
- **Fundo principal**: #F5F5F5 (cinza claro)
- **Fundo de cards**: #FFFFFF (branco)
- **Cor primária**: #008B8B (verde ciano escuro)
- **Cor secundária**: #00CED1 (verde ciano)
- **Texto**: #1A1A1A (preto)
- **Drawer**: #FAFAFA (branco off)

## Como Usar

### Alternar Tema

O botão de alternância está disponível em dois locais:

1. **Tela de Login**: Canto superior direito
2. **Layout principal**: AppBar (após login), ao lado do nome do usuário

### Persistência

A preferência de tema é salva automaticamente no `localStorage` e restaurada ao recarregar a página.

## Implementação Técnica

### Arquivos Criados

1. **`client/src/theme.js`**
   - Define os temas claro e escuro
   - Personaliza componentes Material-UI
   - Cores, tipografia e estilos customizados

2. **`client/src/context/ThemeContext.js`**
   - Provider do contexto de tema
   - Gerencia estado isDarkMode
   - Persiste preferência no localStorage

3. **`client/src/hooks/useTheme.js`**
   - Hook customizado para acessar o tema
   - Retorna `{ isDarkMode, toggleTheme }`

### Hooks Customizados

```javascript
import { useTheme } from './hooks/useTheme';

function MeuComponente() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <Button onClick={toggleTheme}>
      {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
    </Button>
  );
}
```

### Componentes Estilizados

Todos os componentes Material-UI herdam automaticamente as cores do tema:

- **AppBar**: Preto (escuro) / Branco (claro)
- **Drawer**: Bordas em verde ciano
- **Buttons**: Sombras em verde ciano
- **Cards**: Bordas sutis em verde ciano
- **Tables**: Cabeçalho com fundo verde ciano
- **Chips**: Bordas em verde ciano

## Personalização

### Alterar Cores

Edite `client/src/theme.js`:

```javascript
const darkColors = {
  primary: '#00CED1',    // Verde ciano principal
  secondary: '#00FFFF',  // Ciano brilhante
  background: '#0A0E14', // Fundo escuro
  // ...
};
```

### Adicionar Novos Estilos

```javascript
// Em theme.js
components: {
  MuiNomeDoComponente: {
    styleOverrides: {
      root: {
        // seus estilos
      },
    },
  },
}
```

## Acessibilidade

- ✅ Contraste adequado entre texto e fundo (WCAG AA)
- ✅ Ícones descritivos (sol para claro, lua para escuro)
- ✅ Tooltips em todos os botões de alternância
- ✅ Transições suaves entre temas

## Exemplos de Uso

### Em Páginas

```javascript
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../hooks/useTheme';

function MinhaPage() {
  const { isDarkMode } = useTheme();
  const theme = useMuiTheme();
  
  return (
    <Box sx={{
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    }}>
      Modo atual: {isDarkMode ? 'Escuro' : 'Claro'}
    </Box>
  );
}
```

### Estilos Condicionais

```javascript
<Typography
  sx={{
    color: isDarkMode ? '#00CED1' : '#008B8B',
    fontWeight: 700,
  }}
>
  Texto Colorido
</Typography>
```

## Benefícios

✅ **Reduz fadiga visual** em ambientes escuros
✅ **Economiza bateria** em telas OLED (modo escuro)
✅ **Preferência do usuário** respeitada e salva
✅ **Identidade visual única** com verde ciano
✅ **Totalmente integrado** com Material-UI

## Próximas Melhorias Possíveis

- [ ] Auto-detecção de tema do sistema operacional
- [ ] Mais variações de cores (azul, roxo, laranja)
- [ ] Modo de alto contraste para acessibilidade
- [ ] Animações customizadas na transição de tema
- [ ] Paleta de cores personalizável pelo usuário

---

**✨ Aproveite os temas escuro e claro com verde ciano!**
