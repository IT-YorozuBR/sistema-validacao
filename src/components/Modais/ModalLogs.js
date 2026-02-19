import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalLogs = ({ show, onHide, logs, onRefresh }) => {
  const copiarLogs = () => {
    navigator.clipboard.writeText(logs)
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
          {logs}
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