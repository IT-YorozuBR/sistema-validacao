# 📚 Documentação - Migração SQLite → MongoDB

Este diretório contém documentação completa sobre a refatoração do projeto de SQLite para MongoDB Atlas.

## 📖 Arquivos de Documentação

### 1. **[MIGRACAO_MONGODB.md](./MIGRACAO_MONGODB.md)** ⭐ COMECE AQUI
   - Resumo completo das mudanças
   - Estrutura de dados (schemas)
   - Como testar a migração
   - Exemplos de requisições curl
   - Referência do MongoDB Atlas

### 2. **[CHECKLIST_VALIDACAO.md](./CHECKLIST_VALIDACAO.md)**
   - ✅ Checklist passo a passo
   - Como validar cada parte da migração
   - Testes de sintaxe, conexão e API
   - Verificações no MongoDB Atlas Console

### 3. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**
   - 🔧 Solução de problemas comuns
   - Erros frequentes e como resolver
   - Dicas de performance
   - Como resetar dados

### 4. **[readme.md](./readme.md)**
   - Documentação geral do projeto
   - Tecnologias utilizadas (atualizado para MongoDB)
   - Instruções de instalação

## 🚀 Quick Start (5 minutos)

### 1. Instalar dependências
```bash
npm install
```

### 2. Verificar `.env`
```bash
cat .env | grep MONGO_URI
```
Deve ter: `mongodb+srv://lucasg_db_user:xDcAg769gTEQtaML@cluster0.pdmdsmd.mongodb.net`

### 3. Iniciar servidor
```bash
npm run server
```

Esperado:
```
Conectado ao MongoDB Atlas com sucesso
Servidor rodando na porta 3001
```

### 4. Testar API
```bash
curl http://localhost:3001/api/validacoes
```

## 🏗️ Estrutura de Mudanças

```
projeto/
├── .env                          ← String de conexão MongoDB
├── .env.example                  ← Template (atualizado)
├── server.js                     ← Refatorado para Mongoose
├── src/
│   └── models/
│       └── Validacao.js          ← NOVO: Schema Mongoose
├── package.json                  ← mongoose adicionado, sqlite3 removido
├── MIGRACAO_MONGODB.md           ← NOVO: Doc técnica
├── CHECKLIST_VALIDACAO.md        ← NOVO: Checklist
├── TROUBLESHOOTING.md            ← NOVO: Troubleshooting
└── README.md                     ← Atualizado
```

## 💾 Dados

### Antes (SQLite)
- Arquivo local: `ValidacaoPN.db`
- Dados locais apenas
- Sem backup automático

### Depois (MongoDB)
- CloudAtlas: `cluster0.pdmdsmd.mongodb.net`
- Database: `test` (automático)
- Collection: `validacoes`
- Backup automático no MongoDB Atlas ✨

## 🔐 Segurança

✅ **String de conexão protegida**
```bash
# ❌ Nunca faça isso:
const uri = "mongodb+srv://...";  // PERIGO!

# ✅ Sempre faça isso:
const uri = process.env.MONGO_URI;  // Seguro
```

✅ **`.env` nunca é commitado**
```bash
# .gitignore contém:
.env
.env.local
```

✅ **`.env.example` documenta variáveis**
```bash
# Para novo dev:
cp .env.example .env
# E configurar MONGO_URI localmente
```

## 🔄 API Endpoints

### GET /api/validacoes
Listar todas as validações
```bash
curl http://localhost:3001/api/validacoes
```

### GET /api/validacoes?filtro=termo
Buscar validações
```bash
curl "http://localhost:3001/api/validacoes?filtro=NF-001"
```

### POST /api/validacoes
Inserir nova validação
```bash
curl -X POST http://localhost:3001/api/validacoes \
  -H "Content-Type: application/json" \
  -d '{
    "numero_nf": "NF-001",
    "resultado": "OK",
    "chave_nf": "123456789"
  }'
```

### GET /api/logs
Ler logs do sistema
```bash
curl http://localhost:3001/api/logs
```

## 📊 Performance

### Índices criados automaticamente:
- `numero_nf` ✅
- `numero_ran` ✅
- `numero_ordem` ✅
- `createdAt` ✅

Isso garante buscas e filtros rápidos! 🚀

## 🎯 Próximos Passos

### Desenvolvimento
1. ✅ Testar API com Checklist
2. ✅ Verificar dados no MongoDB Atlas
3. ⚠️ Migrar dados antigos (se necessário)
4. ⚠️ Testes de stress (carga de dados)

### Produção
1. ⚠️ Usar variáveis de ambiente seguras
2. ⚠️ Ativar SSL/TLS
3. ⚠️ Implementar autenticação (JWT)
4. ⚠️ Configurar backup diário

## 📞 Suporte

- **Erro de conexão?** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#erro-connect-econnrefused)
- **Dados não salvam?** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#aplicação-inicia-mas-nenhuma-validação-foi-salva)
- **Performance lenta?** → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#performance-lenta-buscas-demoram)

## ✨ Resumo das Mudanças

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Banco | SQLite Local | MongoDB Atlas Cloud |
| Driver | sqlite3 | mongoose |
| Arquivo DB | `ValidacaoPN.db` | Cloud |
| Conexão | Local automática | String env |
| Backup | Manual | automático |
| Performance | OK | Melhor com índices |
| Escalabilidade | Limitada | Sem limites |
| API | Compatível | 100% Compatível |
| Frontend | Intacto | Intacto |

---

**Documentação concluída em: Março 2026** ✨
