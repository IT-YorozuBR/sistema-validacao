import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const EtiquetaProducao = ({ dados, onSubmit, disabled }) => {
  const [codigo, setCodigo] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!dados && !disabled) {
      inputRef.current?.focus();
    }
  }, [dados, disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (codigo.trim()) {
      onSubmit(codigo);
      setCodigo('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !dados) {
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setCodigo(e.target.value.toUpperCase().replace(/\s/g, ''));
  };

  return (
    <div className={`etiqueta-box ${dados ? 'concluida' : 'ativa'}`}>
      <h4 className="text-center mb-4">
        <i className="fas fa-industry"></i> PASSO 2: ETIQUETA DE PRODUÇÃO
      </h4>

      <Form onSubmit={handleSubmit} id="formEtiquetaProducao">
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Código da Etiqueta de Produção:</Form.Label>
          <Form.Control
            type="text"
            ref={inputRef}
            value={codigo}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Digite ou escaneie a etiqueta de produção"
            disabled={!!dados || disabled}
            size="lg"
          />
          <Form.Text>
            <strong>FORMATO:</strong> mínimo 13 caracteres<br />
            <strong>EXTRAÇÃO:</strong> Part Number (posições 3-12)<br />
            <strong>ORDEM:</strong> Número que começa com "M" (ex: M12345)
          </Form.Text>
        </Form.Group>

        {!dados ? (
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-100"
            disabled={!codigo.trim() || disabled}
          >
            <i className="fas fa-check"></i> Confirmar Leitura
          </Button>
        ) : (
          <Alert variant="success" className="text-center">
            <i className="fas fa-check-circle fa-2x mb-2"></i><br />
            <strong>ETIQUETA DE PRODUÇÃO LIDA</strong>
          </Alert>
        )}
      </Form>

      {dados && (
        <div className="mt-3 text-center">
          <div className="dados-container">
            <div className="dado-item">
              <div className="info-label">Part Number</div>
              <div className="part-number-display" style={{ fontSize: '1.2rem' }}>
                {dados.part_number}
              </div>
            </div>

            {dados.numero_ordem && (
              <div className="dado-item">
                <div className="info-label">Número da Ordem</div>
                <div className="numero-ordem-display">
                  {dados.numero_ordem}
                </div>
              </div>
            )}
          </div>

          <div className="text-muted mt-2">
            <small>Código completo: {dados.codigo_completo}</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default EtiquetaProducao;