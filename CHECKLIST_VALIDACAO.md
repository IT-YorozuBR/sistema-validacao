# ✅ Checklist de Validação - Migração SQLite → MongoDB

## 1. Configuração de Ambiente
- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] `MONGO_URI` está configurada em `.env` (não em código)
- [ ] `NODE_ENV` está definido como `development` ou `production`
- [ ] `.env` está listado em `.gitignore` (segurança)

## 2. Dependências Instaladas
- [ ] `mongoose` está em `package.json`
- [ ] `sqlite3` foi removido de `package.json`
- [ ] `npm install` foi executado (há `node_modules/mongoose`)

```bash
# Verificar:
npm list mongoose
npm list sqlite3  # Deve estar vazio
```

## 3. Arquivos do Projeto
- [ ] `server.js` - Refatorado com Mongoose
- [ ] `src/models/Validacao.js` - Schema criado
- [ ] `MIGRACAO_MONGODB.md` - Documentação
- [ ] `.env.example` - Atualizado com MONGO_URI
- [ ] Original `ValidacaoPN.db` - Pode ser deletado (opcional)

## 4. Testes de Sintaxe
```bash
node --check server.js          # ✅ Nenhum erro esperado
node --check src/models/Validacao.js  # ✅ Nenhum erro esperado
```

## 5. Teste de Conexão

### 5.1 Iniciar Servidor
```bash
npm run server
```

**Esperado no console:**
```
[TIMESTAMP] | INFO     | Conectado ao MongoDB Atlas com sucesso
[TIMESTAMP] | INFO     | Servidor rodando na porta 3001
```

### 5.2 Se receber erro de conexão:
```
Erro ao conectar ao MongoDB: ...
```
1. Verificar `MONGO_URI` em `.env`
2. Verificar internet (MongoDB Atlas requer conexão online)
3. Verificar se IP está whitelisted no MongoDB Atlas:
   - https://cloud.mongodb.com → Network Access → Add IP Address
   - Adicionar `0.0.0.0/0` (qualquer IP) para testes locais

## 6. Teste de API (com servidor rodando)

### 6.1 Listar Validações (GET)
```bash
curl http://localhost:3001/api/validacoes
```
Esperado: `[]` ou lista de documentos (JSON)

### 6.2 Inserir Validação (POST)
```bash
curl -X POST http://localhost:3001/api/validacoes \
  -H "Content-Type: application/json" \
  -d '{
    "numero_nf": "NF-TEST-001",
    "resultado": "OK",
    "chave_nf": "123456789"
  }'
```
Esperado:
```json
{
  "id": "ObjectId...",
  "message": "Validação registrada com sucesso"
}
```

### 6.3 Filtro (GET com filtro)
```bash
curl "http://localhost:3001/api/validacoes?filtro=NF-TEST"
```
Esperado: JSON com documentos que contenham "NF-TEST"

## 7. MongoDB Atlas Console

1. Acessar: https://cloud.mongodb.com
2. Selecionar projeto e cluster
3. Clicar em "Browse Collections"
4. Verificar database (será criada automaticamente)
5. Collection `validacoes` deve estar lá
6. Inserções feitas via API devem aparecer em tempo real

## 8. Teste com React (Frontend)

```bash
npm start
```
(Em outro terminal, deixar servidor rodando com `npm run server`)

- [ ] Página carrega normalmente
- [ ] Validações aparecem na lista
- [ ] Inserir nova validação funciona
- [ ] Filtro funciona

## 9. Validação de Dados

Testar validações necessárias no schema:

```bash
# Deve falhar (numero_nf é obrigatório):
curl -X POST http://localhost:3001/api/validacoes \
  -H "Content-Type: application/json" \
  -d '{"resultado": "OK"}'

# Esperado: Erro 500 com mensagem de validação
```

## 10. Verificação de Logs

1. Conferir que `logs/sistema_validacao.log` foi criado
2. Verificar conteúdo:
```bash
cat logs/sistema_validacao.log
```

Esperado: Mensagens de conexão, inserções e erros

## 11. Performance (Índices)

MongoDB criou automaticamente índices definidos em `Validacao.js`:
- `numero_nf`
- `numero_ran`
- `numero_ordem`
- `createdAt`

Esses garantem buscas rápidas ✨

## 12. Segurança

- [ ] String de conexão em `.env`, não em código
- [ ] `.env` está em `.gitignore`
- [ ] Não fez commit de `.env` ao repositório
- [ ] Credenciais MongoDB estão seguras

## Próximas Etapas (Opcional)

1. **Migração de dados antigos**: Se havia dados no SQLite
   ```bash
   sqlite3 ValidacaoPN.db ".mode json" "SELECT * FROM validacoes;" > dados.json
   # Depois processar e importar via API ou script
   ```

2. **Backup automático**: Configurar backup no MongoDB Atlas

3. **Ambiente de Produção**:
   - Usar variáveis de ambiente no servidor (Heroku, AWS, etc.)
   - Ativar SSL/TLS certificates
   - Implementar autenticação se necessário

---

**Migração MongoDB concluída com sucesso! 🎉**
