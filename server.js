import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import database from './src/services/database.js';
import logger from './src/services/logger.js';
import validacaoRoutes from './src/routes/validacaoRoutes.js';
import healthRoutes from './src/routes/healthRoutes.js';

dotenv.config();

// ✅ Configurar __dirname e __filename para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 3001;
const LOG_DIR = path.join(__dirname, 'logs');

// ✅ Trust proxy
app.set('trust proxy', 1);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// ✅ Configurar logs em arquivo
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function logMessage(level, message) {
  const timestamp = new Date().toLocaleString('pt-BR', { 
    timeZone: 'America/Sao_Paulo' 
  });
  const levelPadded = level.toUpperCase().padEnd(8);
  const formattedMessage = `${timestamp} | ${levelPadded} | ${message}\n`;
  
  fs.appendFileSync(LOG_FILE, formattedMessage);
  console.log(formattedMessage);
}

// ✅ Conectar ao MongoDB (usando serviço database)
async function conectarBancoDados() {
  try {
    await database.connect();
    logMessage('info', 'Conectado ao MongoDB com sucesso');
  } catch (error) {
    logMessage('error', `Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
}

// ✅ Importar modelo antigo (mantém compatibilidade)
import Validacao from './src/models/Validacao.js';

// ============================================================================
// ROTAS ANTIGAS (mantidas para compatibilidade)
// ============================================================================

// GET /api/validacoes - Listar com filtro
app.get('/api/validacoes/antigo/buscar', async (req, res) => {
  try {
    const { filtro } = req.query;
    let query = {};

    if (filtro) {
      const searchRegex = new RegExp(filtro, 'i');
      query = {
        $or: [
          { numero_nf: searchRegex },
          { numero_ran: searchRegex },
          { numero_ordem: searchRegex },
          { part_number1: searchRegex },
          { part_number2: searchRegex },
          { resultado: searchRegex },
          { data: searchRegex },
          { hora: searchRegex },
          { usuario: searchRegex },
          { codigo_expedicao: searchRegex }
        ]
      };
    }

    const validacoes = await Validacao.find(query).sort({ createdAt: -1 });
    res.json(validacoes || []);
  } catch (error) {
    logMessage('error', `Erro ao buscar validações: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/validacoes - Criar validação (antigo)
app.post('/api/validacoes/antigo/registrar', async (req, res) => {
  try {
    const {
      chave_nf, numero_nf, numero_ran, numero_ordem,
      volume_nf, part_number1, part_number2, resultado,
      usuario, codigo_expedicao
    } = req.body;

    const data = new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-');
    const hora = new Date().toLocaleTimeString('pt-BR');

    const validacao = new Validacao({
      chave_nf,
      numero_nf,
      numero_ran,
      numero_ordem: numero_ordem || 'N/A',
      volume_nf,
      part_number1,
      part_number2,
      resultado,
      data,
      hora,
      usuario: usuario || 'SISTEMA',
      codigo_expedicao
    });

    const savedValidacao = await validacao.save();

    logMessage('info', `Validação registrada - ID: ${savedValidacao._id}, NF: ${numero_nf}, Resultado: ${resultado}`);
    res.json({
      id: savedValidacao._id,
      message: 'Validação registrada com sucesso'
    });
  } catch (error) {
    logMessage('error', `Erro ao inserir validação: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/logs - Ler logs
app.get('/api/logs', (req, res) => {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const logs = fs.readFileSync(LOG_FILE, 'utf8');
      const logLines = logs.split('\n').reverse();
      res.json({
        total: logLines.length,
        logs: logLines.slice(0, 100) // Últimas 100 linhas
      });
    } else {
      res.json({ message: 'Arquivo de log não encontrado', logs: [] });
    }
  } catch (error) {
    logMessage('error', `Erro ao ler logs: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/logs - Registrar log manualmente
app.post('/api/logs', (req, res) => {
  try {
    const { level, message } = req.body;
    if (!level || !message) {
      return res.status(400).json({ error: 'level e message são obrigatórios' });
    }
    logMessage(level, message);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// ROTAS NOVAS (novo sistema refatorado)
// ============================================================================

// Health check
app.use('/api/health', healthRoutes);

// Validações (novo sistema)
app.use('/api/validacoes', validacaoRoutes);

// ============================================================================
// ROTAS GERAIS
// ============================================================================

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    mensagem: 'Sistema de Validação - MongoDB',
    versao: '1.0.0',
    endpoints: {
      health: '/api/health',
      validacoes: '/api/validacoes',
      logs: '/api/logs',
      legacy: {
        buscar: '/api/validacoes/antigo/buscar',
        registrar: '/api/validacoes/antigo/registrar'
      }
    }
  });
});

// Servir React build (se existir)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'build', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      error: 'Build não encontrado',
      message: 'Execute: npm run build'
    });
  }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// Error handling middleware
app.use((err, req, res, next) => {
  logMessage('error', `Erro na aplicação: ${err.message}`);

  const statusCode = err.statusCode || 500;
  const mensagem = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    sucesso: false,
    erro: {
      mensagem,
      statusCode,
    },
  });
});

// 404 middleware
app.use((req, res) => {
  logMessage('warn', `Rota não encontrada: ${req.method} ${req.path}`);
  res.status(404).json({
    sucesso: false,
    erro: {
      mensagem: 'Rota não encontrada',
      statusCode: 404,
    },
  });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

async function iniciarServidor() {
  try {
    await conectarBancoDados();
    
    app.listen(PORT, () => {
      logMessage('info', `Servidor rodando na porta ${PORT}`);
      logMessage('info', '--- Sistema de Validação MongoDB Iniciado ---');
    });
  } catch (error) {
    logMessage('error', `Erro ao iniciar servidor: ${error.message}`);
    process.exit(1);
  }
}

// Tratamento de sinais de encerramento
process.on('SIGINT', async () => {
  logMessage('info', 'Recebido SIGINT, encerrando...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logMessage('info', 'Recebido SIGTERM, encerrando...');
  await database.disconnect();
  process.exit(0);
});

iniciarServidor();

export default app;