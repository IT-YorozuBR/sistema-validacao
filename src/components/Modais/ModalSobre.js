import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalSobre = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-info-circle"></i> Sobre o Sistema
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Sistema de Validação de Expedição 200% Completo</h4>
        <p><strong>Versão 7.0 - Validação com NF, RAN, Ordem e Volume</strong></p>
        <hr />
        <p>Sistema desenvolvido para validação completa de expedição com rastreabilidade por múltiplos identificadores.</p>
        <p><strong>Funcionamento:</strong></p>
        <ol>
          <li><strong>Dados NF:</strong> Registro da chave NF, número RAN e volume</li>
          <li><strong>Produção:</strong> Leitura da etiqueta de produção</li>
          <li><strong>Extração:</strong> Part Number (posições 3-12) e Número da Ordem (M)</li>
          <li><strong>Expedição:</strong> Campo livre (qualquer tamanho/formato)</li>
          <li><strong>Validação:</strong> Sistema busca Part Number no código de expedição</li>
          <li><strong>Resultado:</strong> Liberação ou bloqueio da carga</li>
        </ol>
        <p><strong>Características:</strong></p>
        <ul>
          <li>Registro completo: NF, RAN, Volume, Número da Ordem</li>
          <li>Extração automática do número da NF da chave</li>
          <li>Detecção automática do número da ordem (M) na etiqueta de produção</li>
          <li>Busca inteligente de Part Number (case insensitive)</li>
          <li>Ignora caracteres especiais na busca</li>
          <li>Logs detalhados com todos os identificadores</li>
          <li>Exportação completa para auditoria</li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSobre;