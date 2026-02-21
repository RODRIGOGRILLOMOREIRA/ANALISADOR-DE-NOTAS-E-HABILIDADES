# 📡 API Endpoints - Referência Rápida

Base URL: `http://localhost:5000/api`

## 🔐 Autenticação

### Registrar Usuário
```http
POST /auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@escola.com",
  "senha": "senha123",
  "tipo": "professor" // "admin", "professor", "coordenador"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@escola.com",
  "senha": "admin123"
}

Response:
{
  "_id": "...",
  "nome": "Admin",
  "email": "admin@escola.com",
  "tipo": "admin",
  "token": "eyJhbGciOiJIUzI1..."
}
```

### Obter Usuário Atual
```http
GET /auth/me
Authorization: Bearer {token}
```

---

## 👨‍🏫 Professores

### Listar Todos
```http
GET /professores
Authorization: Bearer {token}
```

### Buscar por ID
```http
GET /professores/:id
Authorization: Bearer {token}
```

### Criar
```http
POST /professores
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Maria Santos",
  "email": "maria@escola.com",
  "telefone": "(11) 98765-4321",
  "disciplinas": ["disciplinaId1", "disciplinaId2"]
}
```

### Atualizar
```http
PUT /professores/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Maria Santos Updated",
  "telefone": "(11) 99999-9999"
}
```

### Deletar (Soft Delete)
```http
DELETE /professores/:id
Authorization: Bearer {token}
```

---

## 📚 Disciplinas

### Listar Todas
```http
GET /disciplinas
Authorization: Bearer {token}
```

### Buscar por ID
```http
GET /disciplinas/:id
Authorization: Bearer {token}
```

### Criar
```http
POST /disciplinas
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Matemática",
  "codigo": "MAT",
  "cargaHoraria": 80,
  "descricao": "Matemática fundamental"
}
```

### Atualizar
```http
PUT /disciplinas/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "cargaHoraria": 100
}
```

### Deletar
```http
DELETE /disciplinas/:id
Authorization: Bearer {token}
```

---

## 🎓 Turmas

### Listar Todas
```http
GET /turmas
Authorization: Bearer {token}
```

### Buscar por ID
```http
GET /turmas/:id
Authorization: Bearer {token}
```

### Criar
```http
POST /turmas
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "6º A",
  "ano": 2026,
  "serie": "6º ano",
  "turno": "matutino", // "matutino", "vespertino", "noturno", "integral"
  "disciplinas": [
    {
      "disciplina": "disciplinaId1",
      "professor": "professorId1"
    },
    {
      "disciplina": "disciplinaId2",
      "professor": "professorId2"
    }
  ]
}
```

### Atualizar
```http
PUT /turmas/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "6º B"
}
```

### Deletar
```http
DELETE /turmas/:id
Authorization: Bearer {token}
```

---

## 👨‍🎓 Alunos

### Listar Todos
```http
GET /alunos
Authorization: Bearer {token}

# Com filtro por turma:
GET /alunos?turma=turmaId
Authorization: Bearer {token}
```

### Buscar por ID
```http
GET /alunos/:id
Authorization: Bearer {token}
```

### Criar
```http
POST /alunos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Pedro Henrique",
  "matricula": "2026001",
  "dataNascimento": "2014-05-15",
  "responsavel": {
    "nome": "Ana Henrique",
    "telefone": "(11) 91111-1111",
    "email": "ana@email.com"
  },
  "turma": "turmaId"
}
```

### Atualizar
```http
PUT /alunos/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "responsavel": {
    "telefone": "(11) 92222-2222"
  }
}
```

### Deletar
```http
DELETE /alunos/:id
Authorization: Bearer {token}
```

---

## 📝 Avaliações

### Listar Avaliações
```http
GET /avaliacoes
Authorization: Bearer {token}

# Com filtros:
GET /avaliacoes?aluno=alunoId&turma=turmaId&disciplina=disciplinaId&ano=2026&trimestre=1
Authorization: Bearer {token}
```

### Buscar por ID
```http
GET /avaliacoes/:id
Authorization: Bearer {token}
```

### Criar/Atualizar Avaliação
```http
POST /avaliacoes
Authorization: Bearer {token}
Content-Type: application/json

{
  "aluno": "alunoId",
  "disciplina": "disciplinaId",
  "turma": "turmaId",
  "professor": "professorId",
  "ano": 2026,
  "trimestre": 1, // 1, 2 ou 3
  "avaliacoes": [
    {
      "tipo": "prova", // "prova", "trabalho", "participacao", "simulado", "outro"
      "descricao": "Prova Bimestral",
      "nota": 8.5, // 0 a 10
      "peso": 2,
      "data": "2026-03-15"
    },
    {
      "tipo": "trabalho",
      "descricao": "Trabalho em Grupo",
      "nota": 9.0,
      "peso": 1,
      "data": "2026-03-20"
    }
  ],
  "observacoes": "Bom desempenho"
}

# Nota do trimestre é calculada automaticamente!
# Cálculo: (8.5*2 + 9.0*1) / (2+1) = 8.67
```

### Adicionar Nova Nota a Avaliação Existente
```http
POST /avaliacoes/:id/notas
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo": "participacao",
  "descricao": "Participação em aula",
  "nota": 10.0,
  "peso": 1
}
```

### Obter Média Anual de um Aluno
```http
GET /avaliacoes/aluno/:alunoId/media-anual?disciplina=disciplinaId&ano=2026
Authorization: Bearer {token}

Response:
{
  "mediaAnual": 8.45,
  "avaliacoes": [
    { "trimestre": 1, "notaTrimestre": 8.5, "avaliacoes": [...] },
    { "trimestre": 2, "notaTrimestre": 8.2, "avaliacoes": [...] },
    { "trimestre": 3, "notaTrimestre": 8.7, "avaliacoes": [...] }
  ]
}
```

### Atualizar
```http
PUT /avaliacoes/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "observacoes": "Melhorou bastante"
}
```

### Importar Avaliações em Lote 🆕
```http
POST /avaliacoes/importar
Authorization: Bearer {token}
Content-Type: application/json

{
  "avaliacoes": [
    {
      "matricula_aluno": "2026001",
      "aluno_nome": "João Silva",
      "codigo_disciplina": "MAT",
      "disciplina_nome": "Matemática",
      "turma_nome": "1º Ano A",
      "professor_nome": "Prof. Carlos",
      "ano": 2026,
      "trimestre": 1,
      "tipo_avaliacao": "prova",
      "descricao": "Prova Bimestral",
      "nota": 8.5,
      "peso": 3,
      "data_avaliacao": "2026-03-15",
      "observacoes": "Ótimo desempenho"
    },
    {
      "matricula_aluno": "2026002",
      "codigo_disciplina": "POR",
      "turma_nome": "1º Ano A",
      "nota": 9.0,
      "tipo_avaliacao": "trabalho",
      "descricao": "Trabalho em Grupo"
    }
  ]
}

Response:
{
  "message": "Importação concluída",
  "total": 2,
  "sucesso": 2,
  "erros": 0,
  "detalhes": [
    { "linha": 1, "status": "sucesso", "avaliacaoId": "..." },
    { "linha": 2, "status": "sucesso", "avaliacaoId": "..." }
  ]
}

# Campos Obrigatórios:
- matricula_aluno OU aluno_nome
- codigo_disciplina OU disciplina_nome
- turma_nome
- nota

# Campos Opcionais:
- professor_nome, ano, trimestre, tipo_avaliacao, descricao, peso, data_avaliacao, observacoes

# Busca Inteligente:
- Alunos: por matrícula ou nome (case-insensitive)
- Disciplinas: por código ou nome (case-insensitive)
- Turmas/Professores: por nome (case-insensitive)
```

### Deletar
```http
DELETE /avaliacoes/:id
Authorization: Bearer {token}
```

---

## 🎯 Habilidades

### Listar Habilidades
```http
GET /habilidades
Authorization: Bearer {token}

# Com filtros:
GET /habilidades?disciplina=disciplinaId&turma=turmaId&ano=2026&trimestre=1
Authorization: Bearer {token}
```

### Buscar por ID
```http
GET /habilidades/:id
Authorization: Bearer {token}
```

### Criar
```http
POST /habilidades
Authorization: Bearer {token}
Content-Type: application/json

{
  "codigo": "EF06MA01",
  "descricao": "Comparar, ordenar, ler e escrever números naturais",
  "disciplina": "disciplinaId",
  "ano": 2026,
  "trimestre": 1, // 1, 2 ou 3
  "turma": "turmaId",
  "alunosDesempenho": [
    {
      "aluno": "alunoId1",
      "nivel": "desenvolvido", // "nao-desenvolvido", "em-desenvolvimento", "desenvolvido", "plenamente-desenvolvido"
      "observacao": "Demonstrou boa compreensão"
    },
    {
      "aluno": "alunoId2",
      "nivel": "em-desenvolvimento",
      "observacao": "Precisa praticar mais"
    }
  ]
}
```

### Atualizar Desempenho de Aluno
```http
PUT /habilidades/:id/desempenho
Authorization: Bearer {token}
Content-Type: application/json

{
  "alunoId": "alunoId1",
  "nivel": "plenamente-desenvolvido",
  "observacao": "Excelente evolução!"
}
```

### Atualizar Habilidade
```http
PUT /habilidades/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "descricao": "Descrição atualizada"
}
```

### Deletar
```http
DELETE /habilidades/:id
Authorization: Bearer {token}
```

---

## � Frequências

### Listar Frequências
```http
GET /frequencias
Authorization: Bearer {token}

# Com filtros:
GET /frequencias?aluno=alunoId&turma=turmaId&disciplina=disciplinaId&data=2026-03-15&status=falta&ano=2026&mes=3&trimestre=1
Authorization: Bearer {token}
```

### Registrar Frequência
```http
POST /frequencias
Authorization: Bearer {token}
Content-Type: application/json

{
  "aluno": "alunoId",
  "turma": "turmaId",
  "disciplina": "disciplinaId",
  "professor": "professorId",
  "data": "2026-03-15",
  "status": "presente", // "presente", "falta", "falta-justificada", "atestado"
  "periodo": "matutino", // "matutino", "vespertino", "noturno", "integral"
  "observacao": "Participação ativa"
}

# OU Registrar múltiplas frequências de uma vez:
{
  "registros": [
    {
      "aluno": "alunoId1",
      "turma": "turmaId",
      "disciplina": "disciplinaId",
      "professor": "professorId",
      "data": "2026-03-15",
      "status": "presente",
      "periodo": "matutino"
    },
    {
      "aluno": "alunoId2",
      "turma": "turmaId",
      "disciplina": "disciplinaId",
      "professor": "professorId",
      "data": "2026-03-15",
      "status": "falta",
      "periodo": "matutino"
    }
  ]
}
```

### Registrar Chamada da Turma
```http
POST /frequencias/turma/:turmaId/chamada
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": "2026-03-15",
  "disciplina": "disciplinaId",
  "professor": "professorId",
  "periodo": "matutino",
  "presencas": {
    "alunoId1": "presente",
    "alunoId2": "falta",
    "alunoId3": "presente"
  }
}
```

### Obter Frequência de um Aluno
```http
GET /frequencias/aluno/:alunoId?ano=2026&trimestre=1&disciplina=disciplinaId
Authorization: Bearer {token}

Response:
{
  "total": 60,
  "presencas": 55,
  "faltas": 3,
  "faltasJustificadas": 2,
  "percentualPresenca": 91.67,
  "statusFrequencia": {
    "color": "success",
    "label": "Boa Frequência"
  },
  "frequencias": [...]
}
```

### Obter Frequência da Turma em uma Data
```http
GET /frequencias/turma/:turmaId/dia/:data?disciplina=disciplinaId
Authorization: Bearer {token}
```

### Dashboard de Frequência
```http
GET /frequencias/dashboard?turma=turmaId&ano=2026&mes=3
Authorization: Bearer {token}

Response:
{
  "totalAlunos": 30,
  "percentualPresencaGeral": 85.5,
  "alunosCriticos": [
    {
      "aluno": { "nome": "João Silva", "matricula": "2026001" },
      "percentualPresenca": 65.0,
      "totalFaltas": 21
    }
  ],
  "estatisticasPorDia": [...]
}
```

### Importar Frequências em Lote 🆕
```http
POST /frequencias/importar
Authorization: Bearer {token}
Content-Type: application/json

{
  "frequencias": [
    {
      "matricula_aluno": "2026001",
      "aluno_nome": "João Silva",
      "codigo_disciplina": "MAT",
      "disciplina_nome": "Matemática",
      "turma_nome": "1º Ano A",
      "professor_nome": "Prof. Carlos",
      "data": "2026-03-15",
      "status": "presente",
      "periodo": "matutino",
      "observacao": ""
    },
    {
      "matricula_aluno": "2026002",
      "codigo_disciplina": "POR",
      "turma_nome": "1º Ano A",
      "data": "2026-03-15",
      "status": "falta",
      "periodo": "matutino",
      "observacao": "Aluna avisou"
    }
  ]
}

Response:
{
  "message": "Importação concluída",
  "total": 2,
  "criados": 1,
  "atualizados": 1,
  "erros": 0,
  "detalhes": [
    { "linha": 1, "status": "criado", "frequenciaId": "..." },
    { "linha": 2, "status": "atualizado", "frequenciaId": "..." }
  ]
}

# Campos Obrigatórios:
- matricula_aluno OU aluno_nome
- codigo_disciplina OU disciplina_nome
- turma_nome
- data (formato: dd/mm/aaaa)

# Campos Opcionais:
- professor_nome, status (padrão: "presente"), periodo, observacao

# Busca Inteligente:
- Alunos: por matrícula ou nome (case-insensitive)
- Disciplinas: por código ou nome (case-insensitive)
- Turmas/Professores: por nome (case-insensitive)

# Atualização Inteligente:
- Para a mesma data/aluno/disciplina, o registro existente é atualizado
```

### Justificar Falta
```http
PUT /frequencias/:id/justificar
Authorization: Bearer {token}
Content-Type: application/json

{
  "descricao": "Atestado médico",
  "anexo": "url-do-anexo",
  "dataJustificativa": "2026-03-16"
}
```

### Atualizar Frequência
```http
PUT /frequencias/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "falta-justificada",
  "observacao": "Atestado apresentado"
}
```

### Deletar Frequência
```http
DELETE /frequencias/:id
Authorization: Bearer {token}
```

---

## �📊 Dashboard

### Estatísticas Gerais
```http
GET /dashboard/estatisticas
Authorization: Bearer {token}

# Com filtros:
GET /dashboard/estatisticas?turma=turmaId&disciplina=disciplinaId&ano=2026&trimestre=1&pontoCorte=6.0
Authorization: Bearer {token}

Response:
{
  "totalAvaliacoes": 50,
  "mediaGeral": 7.85,
  "aprovados": 42,
  "reprovados": 8,
  "percentualAprovacao": 84.0,
  "pontoCorte": 6.0
}
```

### Desempenho por Disciplina
```http
GET /dashboard/desempenho-disciplina?turma=turmaId&ano=2026&trimestre=1
Authorization: Bearer {token}

Response:
[
  {
    "disciplina": "Matemática",
    "codigo": "MAT",
    "media": 8.5
  },
  {
    "disciplina": "Português",
    "codigo": "POR",
    "media": 7.8
  }
]
```

### Evolução Trimestral
```http
GET /dashboard/evolucao-trimestral?turma=turmaId&disciplina=disciplinaId&ano=2026
Authorization: Bearer {token}

Response:
[
  { "trimestre": 1, "media": 7.5, "totalAlunos": 30 },
  { "trimestre": 2, "media": 8.0, "totalAlunos": 30 },
  { "trimestre": 3, "media": 8.3, "totalAlunos": 30 }
]
```

### Alunos em Risco
```http
GET /dashboard/alunos-risco?turma=turmaId&ano=2026&pontoCorte=6.0
Authorization: Bearer {token}

Response:
[
  {
    "aluno": {
      "_id": "...",
      "nome": "João Silva",
      "matricula": "2026001"
    },
    "disciplinasComDificuldade": [
      {
        "disciplina": "Matemática",
        "trimestre": 2,
        "nota": 5.5
      },
      {
        "disciplina": "Português",
        "trimestre": 2,
        "nota": 5.8
      }
    ]
  }
]
```

### Habilidades Desenvolvidas
```http
GET /dashboard/habilidades-desenvolvidas?turma=turmaId&disciplina=disciplinaId&ano=2026&trimestre=1
Authorization: Bearer {token}

Response:
{
  "nao-desenvolvido": 5,
  "em-desenvolvimento": 12,
  "desenvolvido": 20,
  "plenamente-desenvolvido": 8
}
```

---

## 🔒 Controle de Acesso

### Rotas Públicas
- `POST /auth/login`
- `POST /auth/register`

### Rotas Autenticadas (qualquer usuário logado)
- `GET /auth/me`
- `GET` em todas as rotas

### Rotas de Admin (apenas administradores)
- `POST`, `PUT`, `DELETE` em:
  - `/professores`
  - `/disciplinas`
  - `/turmas`
  - `/alunos`

### Rotas de Professor ou Admin
- `POST`, `PUT`, `DELETE` em:
  - `/avaliacoes`
  - `/habilidades`

---

## 🧪 Testando no PowerShell

### 1. Fazer Login
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Body '{"email":"admin@escola.com","senha":"admin123"}' `
  -ContentType "application/json"

$token = $response.token
Write-Host "Token: $token"
```

### 2. Listar Professores
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/professores" `
  -Headers @{Authorization="Bearer $token"}
```

### 3. Criar Disciplina
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/disciplinas" `
  -Method POST `
  -Headers @{Authorization="Bearer $token"} `
  -Body '{"nome":"Física","codigo":"FIS","cargaHoraria":60}' `
  -ContentType "application/json"
```

### 4. Ver Dashboard
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/dashboard/estatisticas" `
  -Headers @{Authorization="Bearer $token"}
```

---

## 📝 Códigos de Status HTTP

- `200 OK` - Sucesso
- `201 Created` - Recurso criado
- `400 Bad Request` - Erro nos dados enviados
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro no servidor

---

## 💡 Dicas

1. **Sempre inclua o token nas rotas protegidas**
2. **Os IDs são ObjectIds do MongoDB** (24 caracteres hexadecimais)
3. **As notas são calculadas automaticamente** ao salvar avaliações
4. **Soft delete**: itens deletados ficam com `ativo: false`
5. **Populate automático**: relacionamentos são carregados automaticamente

---

**📚 Para mais detalhes, veja o código em `server/src/`**
