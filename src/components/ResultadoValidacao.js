import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const ResultadoValidacao = ({ dadosNF, etiquetaProducao, etiquetaExpedicao, onFinalizar, onNovaNF, onLimparTudo }) => {
  const resultado = etiquetaExpedicao.resultado_validacao;
  const sucesso = resultado.encontrado;

  return (
    <Row>
      <Col xs={12}>
        <div className={`comparacao-box ${sucesso ? 'igual' : 'diferente'}`}>
          <h3 className="mb-4">
            <i className="fas fa-balance-scale"></i> RESULTADO DA VALIDAÇÃO COMPLETA
          </h3>

          <div className="dados-container mb-4">
            <div className="dado-item">
              <div className="info-label">Número NF</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-nf)' }}>
                {dadosNF.numero_nf}
              </div>
            </div>

            <div className="dado-item">
              <div className="info-label">RAN</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-ran)' }}>
                {dadosNF.numero_ran}
              </div>
            </div>

            <div className="dado-item">
              <div className="info-label">Volume</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3498db' }}>
                {dadosNF.volume_nf}
              </div>
            </div>

            {etiquetaProducao.numero_ordem && (
              <div className="dado-item">
                <div className="info-label">Número Ordem</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-ordem)' }}>
                  {etiquetaProducao.numero_ordem}
                </div>
              </div>
            )}
          </div>

          <Row className="justify-content-center align-items-center">
            <Col md={4} className="text-center">
              <div className="icon-grande">
                <i className="fas fa-industry"></i>
              </div>
              <h5>Produção</h5>
              <div className="part-number-display">
                {etiquetaProducao.part_number}
              </div>
              <small className="text-muted">Part Number Esperado</small>
            </Col>

            <Col md={2} className="text-center">
              <div className="icon-grande">
                {sucesso ? (
                  <i className="fas fa-search text-success"></i>
                ) : (
                  <i className="fas fa-search-minus text-danger"></i>
                )}
              </div>
              <div>
                {sucesso ? (
                  <span className="badge bg-success">ENCONTRADO</span>
                ) : (
                  <span className="badge bg-danger">NÃO ENCONTRADO</span>
                )}
              </div>
            </Col>

            <Col md={4} className="text-center">
              <div className="icon-grande">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h5>Expedição</h5>
              <div className="codigo-expedicao-box" style={{ maxHeight: '80px' }}>
                {etiquetaExpedicao.codigo_completo.substring(0, 50)}
                {etiquetaExpedicao.codigo_completo.length > 50 && '...'}
              </div>
              <small className="text-muted">Código de Expedição</small>
            </Col>
          </Row>

          <div className="mt-4">
            {sucesso ? (
              <div className="alert alert-success">
                <h4 className="alert-heading">
                  <i className="fas fa-check-circle"></i> VALIDAÇÃO BEM-SUCEDIDA
                </h4>
                <p className="mb-0">
                  <strong>NF:</strong> {dadosNF.numero_nf} | 
                  <strong> RAN:</strong> {dadosNF.numero_ran} | 
                  <strong> Volume:</strong> {dadosNF.volume_nf}<br />
                  <strong>RESULTADO:</strong> Part Number encontrado na etiqueta de expedição<br />
                  <strong>STATUS:</strong> CARGA LIBERADA PARA DESPACHO<br />
                  <strong>POSIÇÃO:</strong> Caractere {resultado.posicao + 1} do código
                </p>
              </div>
            ) : (
              <div className="alert alert-danger">
                <h4 className="alert-heading">
                  <i className="fas fa-times-circle"></i> VALIDAÇÃO FALHOU
                </h4>
                <p className="mb-0">
                  <strong>NF:</strong> {dadosNF.numero_nf} | 
                  <strong> RAN:</strong> {dadosNF.numero_ran} | 
                  <strong> Volume:</strong> {dadosNF.volume_nf}<br />
                  <strong>RESULTADO:</strong> Part Number NÃO encontrado na etiqueta de expedição<br />
                  <strong>STATUS:</strong> CARGA NÃO LIBERADA - VERIFIQUE AS ETIQUETAS<br />
                  <strong>DETALHES:</strong> O sistema buscou "{etiquetaProducao.part_number}" no código fornecido
                </p>
              </div>
            )}
          </div>

          {sucesso && (
            <div className="detalhes-validacao">
              <h5><i className="fas fa-info-circle"></i> Detalhes da Validação:</h5>
              <Row>
                <Col md={3}>
                  <strong>Número NF:</strong><br />
                  <span className="badge badge-nf">{dadosNF.numero_nf}</span>
                </Col>
                <Col md={3}>
                  <strong>RAN:</strong><br />
                  <span className="badge badge-ran">{dadosNF.numero_ran}</span>
                </Col>
                <Col md={3}>
                  <strong>Part Number Esperado:</strong><br />
                  <code>{etiquetaProducao.part_number}</code>
                </Col>
                <Col md={3}>
                  <strong>Part Number Encontrado:</strong><br />
                  <code>{resultado.part_number_encontrado}</code>
                </Col>
              </Row>
            </div>
          )}

          <div className="mt-3">
            <Button 
              variant="success" 
              size="lg" 
              onClick={onFinalizar}
              className="me-2"
            >
              <i className="fas fa-check-double"></i> Finalizar Validação (Próximo Item)
            </Button>
            <Button 
              variant="warning" 
              size="lg" 
              onClick={onNovaNF}
              className="me-2"
            >
              <i className="fas fa-file-invoice"></i> Nova Nota Fiscal
            </Button>
            <Button 
              variant="danger" 
              size="lg" 
              onClick={onLimparTudo}
            >
              <i className="fas fa-broom"></i> Limpar Tudo
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ResultadoValidacao;