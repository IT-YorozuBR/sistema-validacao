# ⚡ Quick Reference - Comandos Essenciais

## 🚀 Iniciar Aplicação

```bash
# Terminal 1: Servidor Node.js
npm run server

# Terminal 2: React (opcional, se quiser desenvolvimento)
npm start

# Ou ambos simultâneos:
npm run dev
```

## 🧪 Testar API (curl)

```bash
# Lista todas validações
curl http://localhost:3001/api/validacoes

# Filtrar
curl "http://localhost:3001/api/validacoes?filtro=NF-001"

# Inserir validação
curl -X POST http://localhost:3001/api/validacoes \
  -H "Content-Type: application/json" \
  -d '{"numero_nf":"NF-001","resultado":"OK","chave_nf":"123456"}'

# Ler logs
curl http://localhost:3001/api/logs
```

## 🔧 Verificações Rápidas

```bash
# Verificar MONGO_URI
cat .env | grep MONGO_URI

# Validar sintaxe
node --check server.js

# Instalar dependências
npm install

# Ver versão mongoose
npm list mongoose
```

## 🛠️ Troubleshooting Rápido

| Problema | Comando | Solução |
|----------|---------|---------|
| "Cannot find module mongoose" | `npm install mongoose` | Instalar dependência |
| MONGO_URI undefined | `echo $MONGO_URI` | Verificar .env |
| Conexão recusada | `ping 8.8.8.8` | Testar internet |
| Porta em uso | `netstat -an \| grep 3001` | Matar processo |
| Reset banco | Deletar em MongoDB | Dashboard do MongoDB Atlas |

## 📱 Postman/Insomnia

### POST - Inserir Validação
```
URL: http://localhost:3001/api/validacoes
Body (JSON):
{
  "numero_nf": "NF-001",
  "numero_ran": "RAN-001",
  "resultado": "OK",
  "chave_nf": "123456789"
}
```

### GET - Listar
```
URL: http://localhost:3001/api/validacoes
```

### GET - Filtrar
```
URL: http://localhost:3001/api/validacoes?filtro=NF-001
```

## 📚 Arquivos de Documentação

```
DEPLOYMENT_SUMMARY.md      ← Leia isto primeiro!
MIGRACAO_MONGODB.md        ← Entenda as mudanças
CHECKLIST_VALIDACAO.md     ← Valide passo-a-passo
TROUBLESHOOTING.md         ← Se der erro
DOCS_README.md             ← Índice geral
```

## 🔐 Variáveis de Ambiente

```env
# Em .env:
MONGO_URI=mongodb+srv://lucasg_db_user:xDcAg769gTEQtaML@cluster0.pdmdsmd.mongodb.net/?appName=Cluster0
SERVER_PORT=3001
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3001/api
```

## 💾 MongoDB Atlas

- **Console**: https://cloud.mongodb.com
- **Database**: Criada automaticamente ao inserir
- **Collection**: validacoes
- **Dados**: Aparecem em tempo real

## 📊 Índices Database

MongoDB criadosautomaticamente:
- `numero_nf` ✅
- `numero_ran` ✅
- `numero_ordem` ✅
- `createdAt` ✅

## ⚠️ NÃO FAÇA

```javascript
// ❌ NUNCA faça isto:
const uri = "mongodb+srv://...";
```

```bash
# ❌ NUNCA comite .env
git add .env

# ❌ NUNCA acesse com 0.0.0.0 em produção
mongodb+srv://...@cluster.net/?ipWhitelist=0.0.0.0/0
```

## ✅ SEMPRE FAÇA

```javascript
// ✅ SEMPRE use variável de ambiente
const uri = process.env.MONGO_URI;
```

```bash
# ✅ SEMPRE configure .env.example para documentar
cp .env.example .env

# ✅ SEMPRE use .gitignore
.env  # ← Esta linha garante proteção
```

## 🎯 Fluxo Típico

1. `npm install` → Instala mongoose
2. `npm run server` → Inicia servidor
3. Testar com `curl http://localhost:3001/api/validacoes`
4. Abrir MongoDB Atlas → Verificar dados
5. Começar a inserir validações

## 📞 Se der Erro

```
1. Ler mensagem de erro completamente
2. Procurar em TROUBLESHOOTING.md
3. Executar check: node --check server.js
4. Verificar .env: cat .env
5. Ver logs: tail logs/sistema_validacao.log
```

---

**Salve este arquivo para referência rápida! ⚡**
