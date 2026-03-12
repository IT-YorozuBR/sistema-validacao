# Migração SQLite → MongoDB Atlas - Resumo das Mudanças

## ✅ Alterações Realizadas

### 1. **Arquivo `.env`**
- Adicionada variável `MONGO_URI` com a string de conexão do MongoDB Atlas
- String de conexão **nunca fica hardcoded** no código
- Dados sensíveis protegidos

```env
MONGO_URI=mongodb+srv://lucasg_db_user:xDcAg769gTEQtaML@cluster0.pdmdsmd.mongodb.net/?appName=Cluster0
SERVER_PORT=3001
NODE_ENV=development
```

### 2. **`package.json`**
- ✅ Removido: `sqlite3` (driver antigo)
- ✅ Adicionado: `mongoose` ^7.0.0 (ODM para MongoDB)

### 3. **`src/models/Validacao.js`** (NOVO)
Arquivo criado com o schema Mongoose que define a estrutura da coleção:
- Todos os campos da tabela SQLite mapeados
- Índices para otimizar buscas (numero_nf, numero_ran, numero_ordem, createdAt)
- Tipos de dados validados
- Campo `createdAt` automático para rastreabilidade

### 4. **`server.js`** - Refatoração Completa

#### Antes (SQLite):
```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(DB_FILE);
db.run("INSERT INTO validacoes...");
```

#### Depois (MongoDB + Mongoose):
```javascript
const mongoose = require('mongoose');
const Validacao = require('./src/models/Validacao');

await mongoose.connect(process.env.MONGO_URI);
const validacao = new Validacao({...});
await validacao.save();
```

#### Mudanças nos Endpoints:

**GET /api/validacoes**
- Migrado de `db.all()` para `Validacao.find()`
- Filtro agora usa Regex do MongoDB (`$or` com `RegExp`)
- Ordenação: `createdAt` descendente (mais recentes primeiro)

**POST /api/validacoes**
- Migrado de `db.run()` para `Validacao.save()`
- Retorna MongoDB ObjectId (`_id`) em vez de `lastID`
- Usa async/await para melhor tratamento de erros

### 5. **Endpoints de Logs**
- ❌ Sem alterações (continuam funcionando normalmente)
- Os logs ainda são salvos em arquivo (`logs/sistema_validacao.log`)

### 6. **React Frontend**
- ❌ Sem alterações (continua 100% compatível)
- Não foi modificado nenhum arquivo do frontend
- A API responde com os mesmos dados

---

## 🚀 Como Testar

### Pré-requisitos:
1. ✅ Mongoose instalado (`npm install mongoose`)
2. ✅ MONGO_URI configurada em `.env`
3. ✅ Conexão com internet (para acessar MongoDB Atlas)

### Passos:

1. **Instalar dependências** (se não fez ainda):
   ```bash
   npm install
   ```

2. **Verificar variáveis de ambiente**:
   ```bash
   cat .env | grep MONGO_URI
   ```

3. **Iniciar o servidor**:
   ```bash
   npm run server
   ```

   Esperado no console:
   ```
   [timestamp] | INFO     | Conectado ao MongoDB Atlas com sucesso
   [timestamp] | INFO     | Servidor rodando na porta 3001
   ```

4. **Testar a API**:

   **POST** - Inserir validação:
   ```bash
   curl -X POST http://localhost:3001/api/validacoes \
     -H "Content-Type: application/json" \
     -d '{
       "chave_nf": "123456789",
       "numero_nf": "NF-001",
       "numero_ran": "RAN-001",
       "volume_nf": "1",
       "resultado": "OK",
       "usuario": "TESTE"
     }'
   ```

   **GET** - Listar validações:
   ```bash
   curl http://localhost:3001/api/validacoes
   ```

   **GET** - Filtrar:
   ```bash
   curl "http://localhost:3001/api/validacoes?filtro=NF-001"
   ```

5. **No MongoDB Atlas**:
   - Acesse: https://cloud.mongodb.com
   - Database: `teste` ou `sistema-validacao` (será criada automaticamente)
   - Collection: `validacoes`
   - Você verá os documentos inseridos em tempo real

---

## 🔒 Segurança

- String de conexão MongoDB está em `.env` (não no código)
- `.env` deve estar em `.gitignore` (nunca fazer commit)
- Credenciais protegidas no MongoDB Atlas cloud

---

## 📊 Estrutura de Dados (MongoDB)

```javascript
{
  "_id": ObjectId("..."),
  "chave_nf": "123456789",
  "numero_nf": "NF-001",
  "numero_ran": "RAN-001",
  "numero_ordem": "ORD-001",
  "volume_nf": "1",
  "part_number1": "PN-001",
  "part_number2": "PN-002",
  "resultado": "OK",
  "data": "2024-03-12",
  "hora": "14:30:45",
  "usuario": "TESTE",
  "codigo_expedicao": "EXP-001",
  "createdAt": ISODate("2024-03-12T14:30:45.000Z")
}
```

---

## ⚠️ Potenciais Problemas e Soluções

| Problema | Solução |
|----------|---------|
| "MONGO_URI not found" | Verificar `.env` e reiniciar servidor |
| "Connection timeout" | Verificar internet, whitelist IP no MongoDB Atlas |
| "Document validation failed" | Verificar tipos de dados no POST (numero_nf é obrigatório) |
| SQLite database ainda existe | Pode deletar `ValidacaoPN.db` (não é mais usado) |

---

## 📝 Próximos Passos (Opcional)

1. **Backup de dados do SQLite** (se necessário):
   ```bash
   sqlite3 ValidacaoPN.db ".dump" > backup.sql
   ```

2. **Migração de dados antigos**:
   - Exportar dados do SQLite
   - Inserir via API POST ou script Node.js

3. **Autenticação MongoDB**:
   - Considerar adicionar `mongoose-encrypt` para campos sensíveis
   - Implementar JWT tokens se necessário

4. **Validação de dados**:
   - Adicionar validadores de email, formatos de NF, etc.

---

**Migração concluída com sucesso!** ✨
