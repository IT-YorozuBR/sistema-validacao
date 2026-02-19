import React from 'react';

const Header = () => {
  return (
    <div className="header" style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px 0',
      marginBottom: '30px'
    }}>
      <div className="container">
        <div className="text-center">
          <h1 style={{ fontWeight: 'bold', fontSize: '2rem', margin: 0 }}>
            VALIDAÇÃO DE EXPEDIÇÃO YAB
          </h1>
          <div style={{ color: '#bdc3c7', fontSize: '1rem' }}>
            Sistema de Conferência 200% - NF, RAN, Ordem, Volume
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;