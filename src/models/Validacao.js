const mongoose = require('mongoose');

const validacaoSchema = new mongoose.Schema({
    chave_nf: {
        type: String,
        required: false
    },
    numero_nf: {
        type: String,
        required: true
    },
    numero_ran: {
        type: String,
        required: false
    },
    numero_ordem: {
        type: String,
        default: 'N/A'
    },
    volume_nf: {
        type: String,
        required: false
    },
    part_number1: {
        type: String,
        required: false
    },
    part_number2: {
        type: String,
        required: false
    },
    resultado: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        default: 'SISTEMA'
    },
    codigo_expedicao: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Índice para melhorar performance de filtros
validacaoSchema.index({ numero_nf: 1 });
validacaoSchema.index({ numero_ran: 1 });
validacaoSchema.index({ numero_ordem: 1 });
validacaoSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Validacao', validacaoSchema);
