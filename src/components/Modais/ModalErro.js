import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalErro = ({ show, titulo, mensagem, onClose }) => {
  return (
    <Modal 
      show={show} 
      onHide={onClose}
      size="lg"
      backdrop="static"
    >
      <Modal.Header style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none' }}>
        <Modal.Title>
          <i className="fas fa-exclamation-triangle"></i> {titulo}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#e74c3c', color: 'white', textAlign: 'center', padding: '2rem' }}>
        <i className="fas fa-times-circle fa-4x mb-3"></i>
        <h4>ERRO NA VALIDAÇÃO</h4>
        <div className="alert alert-light text-dark mt-3 text-start">
          <pre style={{ whiteSpace: 'pre-wrap', marginBottom: 0 }}>
            {mensagem}
          </pre>
        </div>
        <p className="mt-3">
          A carga <strong>NÃO</strong> está liberada para despacho.
        </p>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#e74c3c', border: 'none' }}>
        <Button variant="light" onClick={onClose}>
          <i className="fas fa-times"></i> Fechar e Tentar Novamente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalErro;