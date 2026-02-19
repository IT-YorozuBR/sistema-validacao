import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { formatarChaveNF } from '../utils/formatadores';

const DadosNF = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    chave_nf: '',
    numero_ran: '',
    volume_nf: '1'
  });

  const chaveRef = useRef(null);

  useEffect(() => {
    chaveRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'chave_nf') {
      setFormData(prev => ({
        ...prev,
        [name]: formatarChaveNF(value)
      }));
    } else if (name === 'numero_ran') {
      setFormData(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleKeyPress = (e, nextField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField) {
        document.getElementById(nextField)?.focus();
      } else {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="nf-box">
      <h3 className="mb-4">
        <i className="fas fa-file-invoice"></i> PASSO 1: REGISTRAR DADOS DA NOTA FISCAL
      </h3>

      <Form onSubmit={handleSubmit} id="formDadosNF">
        <Row>
          <Col md={6} className="mb-3">
            <Form.Label className="fw-bold">Chave da Nota Fiscal (44 dígitos):</Form.Label>
            <Form.Control
              type="text"
              name="chave_nf"
              ref={chaveRef}
              value={formData.chave_nf}
              onChange={handleChange}
              onKeyPress={(e) => handleKeyPress(e, 'numero_ran')}
              placeholder="Digite ou escaneie a chave da nota fiscal"
              size="lg"
            />
            <Form.Text>
              <strong>FORMATO:</strong> 44 dígitos<br />
              <strong>VALIDAÇÃO:</strong> Sistema verifica formato, UF, mês e ano
            </Form.Text>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Label className="fw-bold">Número do RAN:</Form.Label>
            <Form.Control
              type="text"
              name="numero_ran"
              id="numero_ran"
              value={formData.numero_ran}
              onChange={handleChange}
              onKeyPress={(e) => handleKeyPress(e, 'volume_nf')}
              placeholder="Digite o número do RAN"
              size="lg"
            />
            <Form.Text>
              <strong>RAN:</strong> Número do Romaneio de Acompanhamento de Nota
            </Form.Text>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Label className="fw-bold">QTD Rack:</Form.Label>
            <Form.Control
              type="number"
              name="volume_nf"
              id="volume_nf"
              value={formData.volume_nf}
              onChange={handleChange}
              onKeyPress={(e) => handleKeyPress(e)}
              placeholder="Digite o volume da nota"
              min="1"
              size="lg"
            />
            <Form.Text>
              <strong>QTD Rack:</strong> Número da quantidade de rack/sequência da nota
            </Form.Text>
          </Col>

          <Col md={6} className="mb-3">
            <div className="alert alert-info">
              <i className="fas fa-info-circle"></i> <strong>Informações que serão extraídas:</strong><br />
              • Número da NF (da chave)<br />
              • Número da ordem (da etiqueta de produção)
            </div>
          </Col>
        </Row>

        <Button type="submit" className="btn-nf btn-lg w-100">
          <i className="fas fa-check"></i> Registrar Dados da Nota Fiscal
        </Button>
      </Form>
    </div>
  );
};

export default DadosNF;