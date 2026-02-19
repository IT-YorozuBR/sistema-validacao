import React from 'react';

const ProgressoPassos = ({ temDadosNF, temProducao, temExpedicao }) => {
  return (
    <div className="progresso-passos">
      <div className={`passo ${temDadosNF ? 'concluido' : 'ativo'}`}>
        <div className="passo-icon">
          <i className="fas fa-file-invoice"></i>
        </div>
        <div className="passo-texto">1. Dados NF/RAN</div>
      </div>
      <div className={`passo ${temProducao ? 'concluido' : (temDadosNF ? 'ativo' : '')}`}>
        <div className="passo-icon">
          <i className="fas fa-industry"></i>
        </div>
        <div className="passo-texto">2. Produção</div>
      </div>
      <div className={`passo ${temExpedicao ? 'concluido' : (temProducao ? 'ativo' : '')}`}>
        <div className="passo-icon">
          <i className="fas fa-shipping-fast"></i>
        </div>
        <div className="passo-texto">3. Expedição</div>
      </div>
    </div>
  );
};

export default ProgressoPassos;