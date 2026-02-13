# 🚀 Guia de Desenvolvimento

Este guia ajudará você a continuar o desenvolvimento das funcionalidades restantes.

## 📁 Estrutura de Arquivos

### Backend (server/)
```
src/
├── config/           # Configuração (database.js)
├── models/           # Modelos Mongoose (✅ Completo)
├── controllers/      # Lógica de negócio (✅ Completo)
├── routes/           # Rotas da API (✅ Completo)
├── middleware/       # Middlewares (✅ auth.js)
└── server.js         # Arquivo principal (✅ Completo)
```

### Frontend (client/)
```
src/
├── components/       # Componentes reutilizáveis
│   ├── Layout.js     # ✅ Menu lateral e header
│   └── PrivateRoute.js # ✅ Proteção de rotas
├── context/          
│   └── AuthContext.js # ✅ Gerenciamento de autenticação
├── pages/            # Páginas da aplicação
│   ├── Login.js      # ✅ Completo
│   ├── Home.js       # ✅ Completo
│   ├── Professores.js # ✅ CRUD completo
│   ├── Disciplinas.js # ✅ CRUD completo
│   ├── Dashboard.js  # ✅ Gráficos e estatísticas
│   ├── Turmas.js     # ⚠️ Básico - Precisa implementar
│   ├── Alunos.js     # ⚠️ Básico - Precisa implementar
│   ├── Avaliacoes.js # ⚠️ Básico - Precisa implementar
│   └── Habilidades.js # ⚠️ Básico - Precisa implementar
└── services/
    ├── api.js        # ✅ Configuração do Axios
    └── index.js      # ✅ Todos os serviços da API
```

## 🛠️ Como Implementar as Páginas Restantes

### 1. Turmas (client/src/pages/Turmas.js)

**Modelo de referência:** Veja `Professores.js` e `Disciplinas.js`

**Campos do formulário:**
- Nome da turma (ex: "6º A")
- Ano letivo
- Série (ex: "6º ano")
- Turno (matutino/vespertino/noturno/integral)
- Disciplinas (select múltiplo)
- Professores por disciplina

**Exemplo de implementação:**
```javascript
// Similar a Professores.js, mas com campos específicos:
const [formData, setFormData] = useState({
  nome: '',
  ano: new Date().getFullYear(),
  serie: '',
  turno: 'matutino',
  disciplinas: [] // Array de { disciplina: id, professor: id }
});

// Use turmaService.getAll(), .create(), .update(), .delete()
```

### 2. Alunos (client/src/pages/Alunos.js)

**Campos do formulário:**
- Nome completo
- Matrícula (único)
- Data de nascimento
- Nome do responsável
- Telefone do responsável
- Email do responsável
- Turma (select)

**Funcionalidades extras:**
- Filtrar alunos por turma
- Exibir lista de alunos de uma turma específica
- Ver histórico de notas do aluno

### 3. Avaliações (client/src/pages/Avaliacoes.js)

**A página mais importante!**

**Estrutura sugerida:**
```javascript
// Filtros no topo
- Selecionar Turma
- Selecionar Disciplina
- Selecionar Trimestre (1, 2 ou 3)

// Tabela de lançamento
- Coluna: Nome do aluno
- Coluna: Prova (peso 2)
- Coluna: Trabalho (peso 1)
- Coluna: Participação (peso 1)
- Coluna: Nota do Trimestre (calculada automaticamente)
- Botão: Salvar/Atualizar

// Card lateral ou abaixo
- Média Anual do Aluno (calcula automaticamente dos 3 trimestres)
```

**Exemplo de código:**
```javascript
const handleAdicionarNota = async (alunoId, avaliacaoData) => {
  await avaliacaoService.create({
    aluno: alunoId,
    disciplina: selectedDisciplina,
    turma: selectedTurma,
    professor: user._id, // professor logado
    ano: 2026,
    trimestre: selectedTrimestre,
    avaliacoes: [
      {
        tipo: 'prova',
        descricao: 'Prova Bimestral',
        nota: 8.5,
        peso: 2,
        data: new Date()
      },
      {
        tipo: 'trabalho',
        descricao: 'Trabalho em Grupo',
        nota: 9.0,
        peso: 1,
        data: new Date()
      }
    ]
  });
};

// Buscar média anual
const mediaAnual = await avaliacaoService.getMediaAnual(alunoId, {
  disciplina: disciplinaId,
  ano: 2026
});
```

### 4. Habilidades (client/src/pages/Habilidades.js)

**Campos do formulário:**
- Código da habilidade (ex: "EF06MA01")
- Descrição da habilidade
- Disciplina
- Ano
- Trimestre
- Turma

**Registro de desempenho por aluno:**
- Listar todos os alunos da turma
- Para cada aluno, selecionar nível:
  - Não Desenvolvido
  - Em Desenvolvimento
  - Desenvolvido
  - Plenamente Desenvolvido
- Campo de observação para cada aluno

## 📝 Script de População do Banco

Execute o script `seed.js` para criar dados de teste:

```bash
cd server
node seed.js
```

Isso criará:
- 3 usuários (1 admin, 2 professores)
- 6 disciplinas
- 2 professores
- 2 turmas
- 3 alunos
- Avaliações para os 3 trimestres
- Habilidades de exemplo

**Login de teste:**
- Email: `admin@escola.com`
- Senha: `admin123`

## 🎨 Componentes Reutilizáveis

Crie componentes para evitar repetição de código:

### client/src/components/FormDialog.js
```javascript
// Dialog genérico para formulários
export default function FormDialog({ open, title, onClose, onSubmit, children }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSubmit} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
```

### client/src/components/DataTable.js
```javascript
// Tabela genérica com ações
export default function DataTable({ columns, data, onEdit, onDelete }) {
  // Implementação genérica de tabela
}
```

## 🔐 Controle de Acesso

Já implementado no backend! Use os middlewares:

- `auth` - Requer usuário autenticado
- `isAdmin` - Apenas administradores
- `isProfessorOrAdmin` - Professores e admins

```javascript
// Exemplo em uma rota
router.post('/avaliacoes', auth, isProfessorOrAdmin, createAvaliacao);
```

## 📊 Gráficos

O Dashboard já usa Chart.js. Para adicionar novos gráficos:

```javascript
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

const data = {
  labels: ['Jan', 'Fev', 'Mar'],
  datasets: [{
    label: 'Dados',
    data: [12, 19, 3],
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
  }]
};

<Bar data={data} options={{ responsive: true }} />
```

## 🧪 Testando a API

Use o PowerShell para testar endpoints:

```powershell
# Fazer login
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Body '{"email":"admin@escola.com","senha":"admin123"}' `
  -ContentType "application/json"

$token = $response.token

# Buscar professores
Invoke-RestMethod -Uri "http://localhost:5000/api/professores" `
  -Headers @{Authorization="Bearer $token"}
```

## 🚀 Próximas Melhorias

1. **Validação de Formulários**
   - Usar `react-hook-form` ou `formik`
   - Validação em tempo real

2. **Notificações**
   - Já configurado com `react-toastify`
   - Use: `toast.success()`, `toast.error()`, `toast.info()`

3. **Loading States**
   - Adicionar CircularProgress durante carregamento
   - Desabilitar botões durante submit

4. **Confirmação de Exclusão**
   - Usar Dialog do Material-UI ao invés de `window.confirm`

5. **Paginação**
   - Implementar para listas grandes
   - Backend já suporta (adicione `?page=1&limit=10`)

6. **Busca e Filtros**
   - Adicionar campo de busca nas listagens
   - Filtros avançados

7. **Relatórios PDF**
   - Use `jsPDF` ou `react-pdf`
   - Gere boletins e relatórios

8. **PWA (Progressive Web App)**
   - Configure service workers
   - Permita instalação no celular

## 📱 Responsividade

O Material-UI é responsivo por padrão. Use:

```javascript
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    {/* xs: mobile, sm: tablet, md: desktop */}
  </Grid>
</Grid>
```

## 🐛 Debugging

1. **Backend:**
   - Logs estão no console onde rodou `npm run dev`
   - Use `console.log()` nos controllers

2. **Frontend:**
   - Abra DevTools (F12)
   - Veja console para erros
   - Network tab para ver chamadas à API

## 💡 Dicas

1. Sempre teste a API no backend antes de implementar no frontend
2. Use os componentes do Material-UI - documentação: https://mui.com/
3. Mantenha o código organizado seguindo o padrão já criado
4. Faça commits frequentes
5. Teste em diferentes tamanhos de tela

## 📞 Recursos Úteis

- Material-UI: https://mui.com/
- Chart.js: https://www.chartjs.org/
- Mongoose Docs: https://mongoosejs.com/
- Express Docs: https://expressjs.com/
- React Router: https://reactrouter.com/

Boa sorte no desenvolvimento! 🚀
