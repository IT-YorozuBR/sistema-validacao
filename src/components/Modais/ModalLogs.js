import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalLogs = ({ show, onHide, logs, onRefresh }) => {
  // logs é uma string com quebras de linha
  const textoLogs = typeof logs === 'string' ? logs : '';

  const copiarLogs = () => {
    navigator.clipboard.writeText(textoLogs)
      .then(() => alert('Logs copiados para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-file-alt"></i> Visualizador de Logs
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <Button variant="primary" onClick={onRefresh} className="me-2">
            <i className="fas fa-sync-alt"></i> Atualizar
          </Button>
          <Button variant="success" onClick={copiarLogs}>
            <i className="fas fa-copy"></i> Copiar
          </Button>
        </div>
        <div className="log-content">
          {textoLogs ? (
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.85rem' }}>
              {textoLogs}
            </pre>
          ) : (
            <p className="text-muted">Nenhum log disponível.</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalLogs;