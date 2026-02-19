import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { truncarTexto } from '../utils/formatadores';

const TabelaValidacoes = ({ registros }) => {
  const getBadgeResultado = (resultado) => {
    if (resultado === 'LIBERADO') {
      return <Badge bg="success">LIBERADO</Badge>;
    }
    return <Badge bg="danger">REJEITADO</Badge>;
  };

  const getBadgeNumeroOrdem = (numero) => {
    if (numero && numero !== 'N/A') {
      return <Badge bg="warning" text="dark">{numero}</Badge>;
    }
    return <Badge bg="secondary">N/A</Badge>;
  };

  return (
    <div className="table-responsive">
      <Table striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número NF</th>
            <th>RAN</th>
            <th>Número Ordem</th>
            <th>Volume</th>
            <th>Part Number Produção</th>
            <th>Part Number Expedição</th>
            <th>Resultado</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Código Expedição</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id}>
              <td>{registro.id}</td>
              <td>
                <Badge bg="secondary" style={{ backgroundColor: 'var(--color-nf)' }}>
                  {registro.numero_nf}
                </Badge>
              </td>
              <td>
                <Badge bg="secondary" style={{ backgroundColor: 'var(--color-ran)' }}>
                  {registro.numero_ran}
                </Badge>
              </td>
              <td>
                {getBadgeNumeroOrdem(registro.numero_ordem)}
              </td>
              <td>
                <Badge bg="secondary" style={{ backgroundColor: '#3498db' }}>
                  {registro.volume_nf}
                </Badge>
              </td>
              <td>
                <Badge bg="dark">{registro.part_number1}</Badge>
              </td>
              <td>
                <Badge bg="secondary">{registro.part_number2}</Badge>
              </td>
              <td>
                {getBadgeResultado(registro.resultado)}
              </td>
              <td>{registro.data}</td>
              <td>{registro.hora}</td>
              <td>
                <small title={registro.codigo_expedicao}>
                  {truncarTexto(registro.codigo_expedicao, 20)}
                </small>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TabelaValidacoes;