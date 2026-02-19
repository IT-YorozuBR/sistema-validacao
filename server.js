const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const DB_FILE = path.join(__dirname, 'ValidacaoPN.db');
const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'sistema_validacao.log');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Configurar logs
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

function logMessage(level, message) {
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const levelPadded = level.toUpperCase().padEnd(8);
    const formattedMessage = `${timestamp} | ${levelPadded} | ${message}\n`;
    
    fs.appendFileSync(LOG_FILE, formattedMessage);
    console.log(formattedMessage);
}

// Banco de dados
const db = new sqlite3.Database(DB_FILE);

// Criar/atualizar tabela
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS validacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chave_nf TEXT,
        numero_nf TEXT,
        numero_ran TEXT,
        numero_ordem TEXT,
        volume_nf TEXT,
        part_number1 TEXT,
        part_number2 TEXT,
        resultado TEXT,
        data TEXT,
        hora TEXT,
        usuario TEXT,
        codigo_expedicao TEXT
    )`);

    // Verificar e adicionar colunas se necessário
    db.all("PRAGMA table_info(validacoes)", (err, rows) => {
        if (err) {
            logMessage('error', `Erro ao verificar tabela: ${err.message}`);
            return;
        }

        const colunasExistentes = rows.map(row => row.name);
        const colunasNecessarias = ['chave_nf', 'numero_nf', 'numero_ran', 'numero_ordem', 'volume_nf', 'codigo_expedicao'];

        colunasNecessarias.forEach(coluna => {
            if (!colunasExistentes.includes(coluna)) {
                db.run(`ALTER TABLE validacoes ADD COLUMN ${coluna} TEXT`, (err) => {
                    if (err) {
                        logMessage('error', `Erro ao adicionar coluna ${coluna}: ${err.message}`);
                    } else {
                        logMessage('info', `Coluna ${coluna} adicionada com sucesso`);
                    }
                });
            }
        });
    });
});

logMessage('info', 'Servidor iniciado');

// Rotas da API
app.get('/api/validacoes', (req, res) => {
    const { filtro } = req.query;
    
    let query = "SELECT * FROM validacoes ORDER BY id DESC";
    let params = [];

    if (filtro) {
        query = "SELECT * FROM validacoes WHERE numero_nf LIKE ? OR numero_ran LIKE ? OR numero_ordem LIKE ? OR part_number1 LIKE ? OR part_number2 LIKE ? OR resultado LIKE ? OR data LIKE ? OR hora LIKE ? OR usuario LIKE ? OR codigo_expedicao LIKE ? ORDER BY id DESC";
        const like = `%${filtro}%`;
        params = Array(10).fill(like);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            logMessage('error', `Erro ao buscar validações: ${err.message}`);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows || []);
    });
});

app.post('/api/validacoes', (req, res) => {
    const {
        chave_nf, numero_nf, numero_ran, numero_ordem,
        volume_nf, part_number1, part_number2, resultado,
        usuario, codigo_expedicao
    } = req.body;

    const data = new Date().toLocaleDateString('pt-BR').split('/').reverse().join('-');
    const hora = new Date().toLocaleTimeString('pt-BR');

    const query = `INSERT INTO validacoes 
        (chave_nf, numero_nf, numero_ran, numero_ordem, volume_nf, part_number1, part_number2, resultado, data, hora, usuario, codigo_expedicao) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [
        chave_nf, numero_nf, numero_ran, numero_ordem || 'N/A',
        volume_nf, part_number1, part_number2, resultado,
        data, hora, usuario || 'SISTEMA', codigo_expedicao
    ], function(err) {
        if (err) {
            logMessage('error', `Erro ao inserir validação: ${err.message}`);
            res.status(500).json({ error: err.message });
            return;
        }

        logMessage('info', `Validação registrada - ID: ${this.lastID}, NF: ${numero_nf}, Resultado: ${resultado}`);
        res.json({ 
            id: this.lastID,
            message: 'Validação registrada com sucesso'
        });
    });
});

app.get('/api/logs', (req, res) => {
    if (fs.existsSync(LOG_FILE)) {
        const logs = fs.readFileSync(LOG_FILE, 'utf8');
        res.send(logs);
    } else {
        res.send('Arquivo de log não encontrado.');
    }
});

app.post('/api/logs', (req, res) => {
    const { level, message } = req.body;
    logMessage(level, message);
    res.json({ success: true });
});

// Servir React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    logMessage('info', `Servidor rodando na porta ${PORT}`);
});