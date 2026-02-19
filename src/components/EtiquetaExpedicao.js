import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const EtiquetaExpedicao = ({ dados, partNumberEsperado, onSubmit, disabled }) => {
  const [codigo, setCodigo] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!dados && !disabled && partNumberEsperado) {
      inputRef.current?.focus();
    }
  }, [dados, disabled, partNumberEsperado]);

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
    setCodigo(e.target.value.toUpperCase());
  };

  const renderCodigoDestacado = () => {
    if (!dados) return null;

    const codigo = dados.codigo_completo;
    const resultado = dados.resultado_validacao;

    if (resultado.encontrado && resultado.part_number_encontrado) {
      const pn = resultado.part_number_encontrado;
      const posicao = resultado.posicao;
      const comprimento = pn.length;

      const parte1 = codigo.substring(0, posicao);
      const parte2 = codigo.substring(posicao, posicao + comprimento);
      const parte3 = codigo.substring(posicao + comprimento);

      return (
        <>
          {parte1}
          <span className="highlight-partnumber">{parte2}</span>
          {parte3}
        </>
      );
    }

    return codigo;
  };

  return (
    <div className={`etiqueta-box ${dados ? 'concluida' : (partNumberEsperado ? 'ativa' : '')}`}>
      <h4 className="text-center mb-4">
        <i className="fas fa-shipping-fast"></i> PASSO 3: ETIQUETA DE EXPEDIÇÃO
      </h4>

      {partNumberEsperado ? (
        <>
          <Form onSubmit={handleSubmit} id="formEtiquetaExpedicao">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Código da Etiqueta de Expedição:</Form.Label>
              <Form.Control
                type="text"
                ref={inputRef}
                value={codigo}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Digite ou escaneie a etiqueta de expedição"
                disabled={!!dados || disabled}
                size="lg"
              />
              <Form.Text>
                <strong>CAMPO LIVRE:</strong> Qualquer tamanho/formato<br />
                <strong>BUSCA:</strong> Sistema buscará o Part Number em qualquer parte do código
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
                <i className="fas fa-search"></i> Buscar e Validar Part Number
              </Button>
            ) : (
              <Alert variant="info" className="text-center">
                <i className="fas fa-clipboard-check fa-2x mb-2"></i><br />
                <strong>ETIQUETA VALIDADA</strong>
              </Alert>
            )}
          </Form>

          {dados && (
            <div className="mt-3">
              <div className="info-label text-center">Código de Expedição:</div>
              <div className="codigo-expedicao-box">
                {renderCodigoDestacado()}
              </div>

              {dados.resultado_validacao.encontrado ? (
                <Alert variant="success" className="mt-2">
                  <i className="fas fa-check-circle"></i> 
                  <strong> Part Number encontrado!</strong><br />
                  Posição: {dados.resultado_validacao.posicao}
                  {dados.resultado_validacao.observacao && (
                    <><br /><small>{dados.resultado_validacao.observacao}</small></>
                  )}
                </Alert>
              ) : (
                <Alert variant="danger" className="mt-2">
                  <i className="fas fa-times-circle"></i> 
                  <strong> Part Number NÃO encontrado</strong>
                </Alert>
              )}
            </div>
          )}
        </>
      ) : (
        <Alert variant="warning" className="text-center py-4">
          <i className="fas fa-exclamation-circle fa-3x mb-3"></i><br />
          <h5>AGUARDANDO ETIQUETA DE PRODUÇÃO</h5>
          <p>Leia a etiqueta de produção para habilitar a validação de expedição.</p>
        </Alert>
      )}
    </div>
  );
};

export default EtiquetaExpedicao;