import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalSucesso = ({ show, titulo, mensagem, onClose }) => {
  return (
    <Modal 
      show={show} 
      onHide={onClose}
      backdrop="static"
    >
      <Modal.Header style={{ backgroundColor: '#27ae60', color: 'white', border: 'none' }}>
        <Modal.Title>
          <i className="fas fa-check-circle"></i> {titulo}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#27ae60', color: 'white', textAlign: 'center', padding: '2rem' }}>
        <i className="fas fa-thumbs-up fa-4x mb-3"></i>
        <h4>{mensagem}</h4>
        <p className="mt-3">
          A carga está <strong>LIBERADA</strong> para despacho.
        </p>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#27ae60', border: 'none' }}>
        <Button variant="light" onClick={onClose}>
          <i className="fas fa-check"></i> OK e Próximo Item
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSucesso;