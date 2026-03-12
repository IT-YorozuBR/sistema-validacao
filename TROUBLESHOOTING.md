# 🔧 Troubleshooting - Migração MongoDB

## Erro: "MONGO_URI não está definida"

**Causa**: Arquivo `.env` não existe ou não tem `MONGO_URI`

**Solução**:
```bash
# Verificar:
cat .env | grep MONGO_URI

# Se não aparecer nada, adicionar:
echo 'MONGO_URI=mongodb+srv://lucasg_db_user:xDcAg769gTEQtaML@cluster0.pdmdsmd.mongodb.net/?appName=Cluster0' >> .env
```

---

## Erro: "connect ECONNREFUSED"

**Causa**: Servidor MongoDB não acessível

**Soluções**:
1. **Verificar internet** - MongoDB Atlas requer conexão online
2. **Whitelist de IP** no MongoDB Atlas:
   - https://cloud.mongodb.com → Security → Network Access
   - Clicar "Add IP Address"
   - Adicionar seu IP ou `0.0.0.0/0` (todos os IPs - apenas teste)

```bash
# Testar conectividade:
ping google.com  # Verificar internet
```

---

## Erro: "MongoServerError: authentication failed"

**Causa**: Credenciais MongoDB inválidas

**Solução**:
1. Verificar string de conexão em `MONGO_URI`
2. Confirmar username/password no MongoDB Atlas:
   - https://cloud.mongodb.com → Security → Database Access
   - Verificar credenciais do usuário `lucasg_db_user`

---

## Erro: "Cannot find module 'mongoose'"

**Causa**: Mongoose não foi instalado

**Solução**:
```bash
npm install mongoose --save

# Ou se `package-lock.json` está desatualizado:
rm -rf node_modules package-lock.json
npm install
```

---

## Erro: "Cannot find module './src/models/Validacao'"

**Causa**: Arquivo não foi criado ou caminho errado

**Solução**:
```bash
# Verificar se existe:
ls -la src/models/

# Se não existir, criar novamente (está em MIGRACAO_MONGODB.md)
```

---

## Aplicação inicia, mas nenhuma validação foi salva

**Causas possíveis**:

### 1. Banco MongoDB não foi selecionado
```javascript
// Mongoose pode estar criando em banco diferente
// Solução: Verificar em MongoDB Atlas qual database foi criada
```

### 2. Collection vazia mas conexão OK
```bash
# Via MongoDB Atlas Console:
# Network Access → Database → Browse Collection
# Verificar se 'validacoes' collection existe
```

### 3. Validação falhando silenciosamente
```bash
# No terminal do servidor, procurar por:
# "validation failed" ou "error"

# Se não conseguir debug, habilitar logs detalhados:
# Modificar server.js linha ~120:
await validacao.save().then(...).catch(err => {
    console.log("ERRO DETALHADO:", err);
});
```

---

## React mostra "Cannot GET /api/validacoes"

**Causa**: Servidor Node.js não está rodando

**Solução**:
```bash
# Em novo terminal:
npm run server

# Verificar:
curl http://localhost:3001/api/validacoes
```

---

## Dados somem depois de reiniciar

**Isso é esperado** se usando MongoDB local (sem persistência!). 

**Se usando MongoDB Atlas**: Dados devem ser persistentes.

**Verificação**:
```bash
# 1. Confirmar que está usando MONGO_URI
echo $MONGO_URI

# 2. Confirmar que é string do MongoDB Atlas
# (deve conter: mongodb+srv://...)
```

---

## Performance lenta (buscas demoram)

**Solução**: Verificar se índices foram criados

```bash
# No MongoDB Atlas Console:
# Database → Collections → validacoes → Indexes
# Deve ter índices em:
# - numero_nf, numero_ran, numero_ordem, createdAt
```

Se não tiver, foram criados quandoValidacao foi importado pela primeira vez, pode levar um minuto.

---

## Como resetar e começar do zero

**Atenção: Isso deleta TODOS os dados do banco!**

```bash
# 1. No MongoDB Atlas:
# https://cloud.mongodb.com → Clusters → ... → Collections → Delete Database

# 2. Ou executar na aplicação (POST para nova validação limpa):
# A collection será criada automaticamente ao inserir

# 3. Remover banco SQLite antigo (se foi criado):
rm -f ValidacaoPN.db
```

---

## Migração de dados antigos do SQLite

Se quiser recuperar dados do banco antigo:

```bash
# 1. Exportar dados do SQLite:
sqlite3 ValidacaoPN.db ".mode json" "SELECT * FROM validacoes;" > dados_antigos.json

# 2. Criar script Node.js para importar (opcional)
# Ou importar manualmente via POST /api/validacoes

# 3. Deletar banco antigo:
rm -f ValidacaoPN.db
```

---

## Logs não aparecem

**Verificar local dos logs**:
```bash
# Logs são salvos em:
ls -la logs/sistema_validacao.log

# Se não existir, isso não é problema de MongoDB
# É problema do sistema de logging (arquivo permissions)

# Criar pasta manualmente:
mkdir -p logs
touch logs/sistema_validacao.log
chmod 666 logs/sistema_validacao.log
```

---

## Servidor roda mas React não consegue acessar API

**Causa**: CORS ou URL errada

**Verificar**:
1. servidor está rodando: `npm run server` ✅
2. URL em React está correta: `REACT_APP_API_URL=http://localhost:3001/api`
3. CORS está habilitado em `server.js` ✅

**Se ainda não funcionar**:
```bash
# Verifica se consegue acessar servidor:
curl http://localhost:3001/api/validacoes

# Se receber dados, problema é no lado React
# Se receber erro, problema é no servidor
```

---

## Mensagens de erro no console (Mongoose warnings)

É normal ver mensagens como:
```
"Deprecation warning: current URL string parser..."
```

Essas são avisos do Mongoose/MongoDB driver versões antigas, não afetam funcionamento.

Para remover, adicionar em `server.js`:
```javascript
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // Pré-versão Mongoose 6.x já estava configurado
});
```

---

## Precisa de mais ajuda?

1. **Documentação MongoDB**: https://docs.mongodb.com
2. **Documentação Mongoose**: https://mongoosejs.com
3. **Logs do servidor**: Verificar arquivo `logs/sistema_validacao.log`
4. **MongoDB Atlas Support**: https://cloud.mongodb.com/support

---
**Última atualização**: Março 2026
