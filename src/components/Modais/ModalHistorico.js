import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import TabelaValidacoes from '../TabelaValidacoes';

const ModalHistorico = ({ show, onHide, registros, onSearch }) => {
  const [filtro, setFiltro] = useState('');

  const handleSearch = (e) => {
    const valor = e.target.value;
    setFiltro(valor);
    onSearch(valor);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-history"></i> Histórico de Validações
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Pesquisar por NF, RAN, Ordem, PartNumber..."
            value={filtro}
            onChange={handleSearch}
          />
        </Form.Group>
        <TabelaValidacoes registros={registros} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
        <Button variant="primary" href="?exportar=1">
          <i className="fas fa-file-export"></i> Exportar Relatório
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalHistorico;