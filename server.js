const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'sistema_validacao.log');

app.set('trust proxy', 1);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function logMessage(level, message) {
  const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const levelPadded = level.toUpperCase().padEnd(8);
  const formattedMessage = `${timestamp} | ${levelPadded} | ${message}\n`;
  fs.appendFileSync(LOG_FILE, formattedMessage);
  console.log(formattedMessage.trim());
}

const validacaoSchema = new mongoose.Schema({
  chave_nf: String,
  numero_nf: String,
  numero_ran: String,
  numero_ordem: String,
  volume_nf: String,
  part_number1: String,
  part_number2: String,
  resultado: String,
  data: String,
  hora: String,
  usuario: String,
  codigo_expedicao: String,
}, { timestamps: true });

const Validacao = mongoose.model('Validacao', validacaoSchema);

// GET /api/validacoes
app.get('/api/validacoes', async (req, res) => {
  try {
    const { filtro } = req.query;
    let query = {};
    if (filtro) {
      const searchRegex = new RegExp(filtro, 'i');
      query = { $or: [
        { numero_nf: searchRegex }, { numero_ran: searchRegex },
        { numero_ordem: searchRegex }, { part_number1: searchRegex },
        { part_number2: searchRegex }, { resultado: searchRegex },
        { data: searchRegex }, { hora: searchRegex },
        { usuario: searchRegex }, { codigo_expedicao: searchRegex }
      ]};
    }
    const validacoes = await Validacao.find(query).sort({ createdAt: -1 });
    res.json(validacoes || []);
  } catch (error) {
    logMessage('error', `Erro ao buscar validações: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/validacoes
app.post('/api/validacoes', async (req, res) => {
  try {
    const { chave_nf, numero_nf, numero_ran, numero_ordem, volume_nf,
      part_number1, part_number2, resultado, usuario, codigo_expedicao } = req.body;
    const agora = new Date();
    const data = agora.toLocaleDateString('pt-BR').split('/').reverse().join('-');
    const hora = agora.toLocaleTimeString('pt-BR');
    const validacao = new Validacao({
      chave_nf, numero_nf, numero_ran, numero_ordem: numero_ordem || 'N/A',
      volume_nf, part_number1, part_number2, resultado, data, hora,
      usuario: usuario || 'SISTEMA', codigo_expedicao
    });
    const saved = await validacao.save();
    logMessage('info', `Validação registrada - ID: ${saved._id}, NF: ${numero_nf}, Resultado: ${resultado}`);
    res.json({ id: saved._id, message: 'Validação registrada com sucesso' });
  } catch (error) {
    logMessage('error', `Erro ao inserir validação: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/logs
app.get('/api/logs', (req, res) => {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const logs = fs.readFileSync(LOG_FILE, 'utf8');
      const logLines = logs.split('\n').filter(Boolean).reverse();
      res.json({ total: logLines.length, logs: logLines.slice(0, 100) });
    } else {
      res.json({ message: 'Arquivo de log não encontrado', logs: [] });
    }
  } catch (error) {
    logMessage('error', `Erro ao ler logs: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/logs
app.post('/api/logs', (req, res) => {
  try {
    const { level, message } = req.body;
    if (!level || !message) return res.status(400).json({ error: 'level e message são obrigatórios' });
    logMessage(level, message);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado',
    timestamp: new Date().toISOString()
  });
});

// Servir React (deve ficar por último)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'build', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Build não encontrado. Execute: npm run build' });
  }
});

app.use((err, req, res, next) => {
  logMessage('error', `Erro na aplicação: ${err.message}`);
  res.status(err.statusCode || 500).json({
    sucesso: false,
    erro: { mensagem: err.message || 'Erro interno', statusCode: err.statusCode || 500 }
  });
});

async function iniciarServidor() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error('Variável de ambiente MONGODB_URI não definida!');
    await mongoose.connect(MONGODB_URI);
    logMessage('info', 'Conectado ao MongoDB com sucesso');
    app.listen(PORT, () => {
      logMessage('info', `Servidor rodando na porta ${PORT}`);
      logMessage('info', '--- Sistema de Validação MongoDB Iniciado ---');
    });
  } catch (error) {
    logMessage('error', `Erro ao iniciar servidor: ${error.message}`);
    process.exit(1);
  }
}

process.on('SIGINT', async () => { await mongoose.disconnect(); process.exit(0); });
process.on('SIGTERM', async () => { await mongoose.disconnect(); process.exit(0); });

iniciarServidor();