import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Navbar from './components/Navbar';
import ProgressoPassos from './components/ProgressoPassos';
import DadosNF from './components/DadosNF';
import EtiquetaProducao from './components/EtiquetaProducao';
import EtiquetaExpedicao from './components/EtiquetaExpedicao';
import ResultadoValidacao from './components/ResultadoValidacao';
import Footer from './components/Footer';
import ModalErro from './components/Modais/ModalErro';
import ModalSucesso from './components/Modais/ModalSucesso';
import ModalHistorico from './components/Modais/ModalHistorico';
import ModalLogs from './components/Modais/ModalLogs';
import ModalSobre from './components/Modais/ModalSobre';
import useValidacao from './hooks/useValidacao';

function App() {
  const {
    dadosNF,
    etiquetaProducao,
    etiquetaExpedicao,
    resultadoValidacao,
    aviso,
    modalErro,
    modalSucesso,
    registros,
    logs,
    registrarDadosNF,
    lerEtiquetaProducao,
    validarEtiquetaExpedicao,
    finalizarValidacao,
    novaNotaFiscal,
    limparTudo,
    buscarRegistros,
    atualizarLogs
  } = useValidacao();

  const [showHistorico, setShowHistorico] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showSobre, setShowSobre] = useState(false);

  useEffect(() => {
    buscarRegistros();
    atualizarLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <Navbar 
        onShowHistorico={() => setShowHistorico(true)}
        onShowLogs={() => setShowLogs(true)}
        onShowSobre={() => setShowSobre(true)}
        onNovaNF={novaNotaFiscal}
        onLimparTudo={limparTudo}
      />
      
      <Container>
        <ProgressoPassos 
          temDadosNF={!!dadosNF}
          temProducao={!!etiquetaProducao}
          temExpedicao={!!etiquetaExpedicao}
        />

        {aviso && (
          <div className="alert alert-warning alert-dismissible fade show" role="alert">
            <i className="fas fa-exclamation-triangle"></i> {aviso}
            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          </div>
        )}

        {!dadosNF ? (
          <DadosNF onSubmit={registrarDadosNF} />
        ) : (
          <>
            <div className="row mb-4">
              <div className="col-md-6">
                <EtiquetaProducao 
                  dados={etiquetaProducao}
                  onSubmit={lerEtiquetaProducao}
                  disabled={!dadosNF}
                />
              </div>
              <div className="col-md-6">
                <EtiquetaExpedicao 
                  dados={etiquetaExpedicao}
                  partNumberEsperado={etiquetaProducao?.part_number}
                  onSubmit={validarEtiquetaExpedicao}
                  disabled={!etiquetaProducao}
                />
              </div>
            </div>

            {etiquetaProducao && etiquetaExpedicao && (
              <ResultadoValidacao 
                dadosNF={dadosNF}
                etiquetaProducao={etiquetaProducao}
                etiquetaExpedicao={etiquetaExpedicao}
                onFinalizar={finalizarValidacao}
                onNovaNF={novaNotaFiscal}
                onLimparTudo={limparTudo}
              />
            )}
          </>
        )}
      </Container>

      <Footer />

      <ModalErro 
        show={!!modalErro}
        titulo={modalErro?.titulo}
        mensagem={modalErro?.mensagem}
        onClose={finalizarValidacao}
      />

      <ModalSucesso 
        show={!!modalSucesso}
        titulo={modalSucesso?.titulo}
        mensagem={modalSucesso?.mensagem}
        onClose={finalizarValidacao}
      />

      <ModalHistorico 
        show={showHistorico}
        onHide={() => setShowHistorico(false)}
        registros={registros}
        onSearch={buscarRegistros}
      />

      <ModalLogs 
        show={showLogs}
        onHide={() => setShowLogs(false)}
        logs={logs}
        onRefresh={atualizarLogs}
      />

      <ModalSobre 
        show={showSobre}
        onHide={() => setShowSobre(false)}
      />
    </>
  );
}

export default App;