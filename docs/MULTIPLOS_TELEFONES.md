# Migração de Telefones - Múltiplos Telefones por Responsável

## Alterações Implementadas

O sistema foi atualizado para suportar **múltiplos telefones** no cadastro de responsáveis de alunos.

### Modificações Realizadas:

1. **Modelo de Dados (Backend)**
   - Arquivo: `server/src/models/Aluno.js`
   - Campo `responsavel.telefone` (String) → `responsavel.telefones` (Array de Strings)

2. **Interface de Cadastro (Frontend)**
   - Arquivo: `client/src/pages/Alunos.js`
   - Adicionados botões para adicionar/remover telefones
   - Interface permite gerenciar múltiplos telefones dinamicamente

3. **Visualização na Tabela**
   - Telefones exibidos separados por " | "
   - Exemplo: (11) 98765-4321 | (11) 91234-5678

4. **Importação de Arquivos (CSV/Excel)**
   - Suporte para múltiplos telefones no campo `responsavel_telefone`
   - Separadores aceitos: vírgula (,) ou ponto e vírgula (;)
   - Exemplo no CSV: `"(11) 98765-4321, (11) 91234-5678"`

5. **Templates Atualizados**
   - Template CSV e Excel incluem exemplos com múltiplos telefones
   - Arquivo de exemplo: `exemplos/alunos_exemplo.csv`

## Como Usar

### Cadastro Manual
1. Acesse a página de Alunos
2. Clique em "Novo Aluno" ou edite um existente
3. No campo "Telefone(s)":
   - Digite o primeiro telefone
   - Clique no botão **+** (AddCircle) para adicionar mais telefones
   - Clique no botão **-** (RemoveCircle) para remover um telefone

### Importação via CSV/Excel
Use o campo `responsavel_telefone` com múltiplos telefones separados:

**CSV:**
```csv
nome,matricula,dataNascimento,turma,responsavel_nome,responsavel_telefone,responsavel_email
Ana Costa,2026002,2011-08-20,1º Ano A,Carlos Costa,"(11) 91234-5678, (11) 98888-9999",carlos@email.com
```

**Excel:**
| responsavel_telefone |
|---------------------|
| (11) 91234-5678, (11) 98888-9999 |

## Migração de Dados Existentes

Se você já possui alunos cadastrados com o campo antigo `telefone`, execute o script de migração:

### Passo a Passo:

1. **Backup do Banco de Dados** (recomendado)
```bash
mongodump --uri="sua-connection-string" --out=./backup
```

2. **Executar Script de Migração**
```bash
cd server
node scripts/migrar-telefones-alunos.js
```

O script irá:
- Buscar todos os alunos com `responsavel.telefone`
- Converter para `responsavel.telefones` (array)
- Remover o campo antigo
- Manter a compatibilidade total

### Resultado Esperado:
```
Iniciando migração de telefones...
Encontrados 15 alunos com o campo telefone antigo
Migrado aluno: João Silva - 2026001
Migrado aluno: Ana Paula Costa - 2026002
...
Migração concluída!
Total de alunos migrados: 15
```

## Compatibilidade

- ✅ Novos cadastros já usam múltiplos telefones
- ✅ Importações CSV/Excel suportam múltiplos telefones
- ✅ Dados antigos podem ser migrados com o script
- ✅ Sistema responsivo para mobile e tablets

## Observações

- O sistema normaliza telefones vazios automaticamente
- Ao menos um campo de telefone sempre está disponível
- Telefones duplicados são permitidos (caso necessário)
- A exibição na tabela é otimizada para não ocupar muito espaço

## Suporte

Em caso de dúvidas ou problemas:
1. Verifique se a migração foi executada
2. Confirme que o servidor foi reiniciado após as alterações
3. Limpe o cache do navegador (Ctrl+F5)
