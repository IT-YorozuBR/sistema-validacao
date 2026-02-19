import React from 'react';
import { Navbar as BSNavbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const Navbar = ({ onShowHistorico, onShowLogs, onShowSobre, onNovaNF, onLimparTudo }) => {
  return (
    <BSNavbar bg="light" expand="lg" className="shadow-sm mb-4">
      <Container>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title={<><i className="fas fa-cogs"></i> Sistema</>} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={onShowHistorico}>
                <i className="fas fa-history"></i> Histórico de Validações
              </NavDropdown.Item>
              <NavDropdown.Item href="?exportar=1">
                <i className="fas fa-file-export"></i> Exportar Relatório
              </NavDropdown.Item>
              <NavDropdown.Item onClick={onShowLogs}>
                <i className="fas fa-file-alt"></i> Visualizar Logs
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onNovaNF}>
                <i className="fas fa-file-invoice"></i> Nova Nota Fiscal
              </NavDropdown.Item>
              <NavDropdown.Item onClick={onLimparTudo}>
                <i className="fas fa-broom"></i> Limpar Tudo
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onShowSobre}>
                <i className="fas fa-info-circle"></i> Sobre
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;