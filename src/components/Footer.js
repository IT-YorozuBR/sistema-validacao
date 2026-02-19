import React from 'react';

const Footer = () => {
  const ano = new Date().getFullYear();

  return (
    <div className="footer" style={{
      backgroundColor: '#2c3e50',
      color: '#bdc3c7',
      padding: '15px 0',
      marginTop: '30px',
      fontSize: '0.9rem'
    }}>
      <div className="container text-center">
        Desenvolvido pela TI - Yorozu do Brasil - {ano}
      </div>
    </div>
  );
};

export default Footer;