import { useState, useCallback } from 'react';
import { 
  validarChaveNF, 
  extrairDadosEtiquetaProducao, 
  validarPartNumberEtiquetaExpedicao 
} from '../utils/validadores';
import api from '../services/api';
import logger from '../services/logger';

const useValidacao = () => {
  const [dadosNF, setDadosNF] = useState(null);
  const [etiquetaProducao, setEtiquetaProducao] = useState(null);
  const [etiquetaExpedicao, setEtiquetaExpedicao] = useState(null);
  const [resultadoValidacao, setResultadoValidacao] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [modalErro, setModalErro] = useState(null);
  const [modalSucesso, setModalSucesso] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [logs, setLogs] = useState('');

  const mostrarAviso = (mensagem) => {
    setAviso(mensagem);
    setTimeout(() => setAviso(null), 5000);
  };

  const registrarDadosNF = async (dados) => {
    const { chave_nf, numero_ran, volume_nf } = dados;

    if (!chave_nf) {
      mostrarAviso('Digite a chave da nota fiscal!');
      await logger.warning('Tentativa de registrar chave NF vazia');
      return false;
    }

    const validacaoChave = validarChaveNF(chave_nf);

    if (!validacaoChave.valida) {
      mostrarAviso(`Chave NF inválida: ${validacaoChave.erro}`);
      await logger.warning(`Chave NF inválida: ${validacaoChave.erro}`);
      return false;
    }

    if (!numero_ran) {
      mostrarAviso('Informe o número do RAN!');
      await logger.warning('Tentativa de registrar sem número RAN');
      return false;
    }

    if (!volume_nf || volume_nf <= 0) {
      mostrarAviso('Informe um volume válido (maior que 0)!');
      await logger.warning(`Volume NF inválido: ${volume_nf}`);
      return false;
    }

    const novosDados = {
      chave: validacaoChave,
      numero_ran: numero_ran.toUpperCase().trim(),
      volume_nf,
      numero_nf: validacaoChave.numero_nf
    };

    setDadosNF(novosDados);
    setEtiquetaProducao(null);
    setEtiquetaExpedicao(null);
    setResultadoValidacao(null);

    await logger.info(`Dados NF registrados - NF: ${validacaoChave.numero_nf}, RAN: ${numero_ran}, Volume: ${volume_nf}`);
    return true;
  };

  const lerEtiquetaProducao = async (etiqueta) => {
    if (!dadosNF) {
      mostrarAviso('Primeiro registre os dados da nota fiscal!');
      await logger.warning('Tentativa de ler etiqueta sem dados NF');
      return false;
    }

    const etiquetaLimpa = etiqueta.toUpperCase().replace(/\s/g, '');

    if (etiquetaLimpa.length < 13) {
      mostrarAviso('Etiqueta de produção muito curta! Mínimo 13 caracteres.');
      await logger.warning(`Etiqueta produção muito curta: ${etiquetaLimpa.length} caracteres`);
      return false;
    }

    const dados = extrairDadosEtiquetaProducao(etiquetaLimpa);

    if (!dados.part_number) {
      mostrarAviso('Não foi possível extrair o Part Number da etiqueta de produção.');
      return false;
    }

    setEtiquetaProducao(dados);
    setEtiquetaExpedicao(null);
    setResultadoValidacao(null);

    await logger.info(`Etiqueta de produção lida - PartNumber: ${dados.part_number}, Ordem: ${dados.numero_ordem || 'N/A'}`);
    return true;
  };

  const validarEtiquetaExpedicao = async (codigo) => {
    if (!dadosNF) {
      mostrarAviso('Primeiro registre os dados da nota fiscal!');
      return false;
    }

    if (!etiquetaProducao) {
      mostrarAviso('Primeiro leia a etiqueta de produção!');
      return false;
    }

    if (!codigo) {
      mostrarAviso('Digite o código da etiqueta de expedição!');
      await logger.warning('Tentativa de validar código de expedição vazio');
      return false;
    }

    const partNumberEsperado = etiquetaProducao.part_number;
    const resultado = validarPartNumberEtiquetaExpedicao(codigo, partNumberEsperado);

    setEtiquetaExpedicao({
      codigo_completo: codigo,
      resultado_validacao: resultado
    });

    await logger.info(`Etiqueta de expedição validada - Código: ${codigo.substring(0, 50)}, PartNumber Esperado: ${partNumberEsperado}`);

    if (resultado.encontrado) {
      setResultadoValidacao({
        status: 'sucesso',
        mensagem: 'Part Number encontrado na etiqueta de expedição! Carga liberada para despacho.',
        detalhes: resultado
      });

      setModalSucesso({
        titulo: 'CARGA LIBERADA',
        mensagem: 'Part Number encontrado na etiqueta de expedição! Carga liberada para despacho.'
      });

      // Registrar no banco
      try {
        await api.post('/validacoes', {
          chave_nf: dadosNF.chave.chave_limpa,
          numero_nf: dadosNF.numero_nf,
          numero_ran: dadosNF.numero_ran,
          numero_ordem: etiquetaProducao.numero_ordem,
          volume_nf: dadosNF.volume_nf,
          part_number1: partNumberEsperado,
          part_number2: resultado.part_number_encontrado,
          resultado: 'LIBERADO',
          usuario: 'SISTEMA',
          codigo_expedicao: codigo
        });

        await logger.info(`VALIDAÇÃO BEM-SUCEDIDA - NF: ${dadosNF.numero_nf}, RAN: ${dadosNF.numero_ran}, PartNumber: ${partNumberEsperado} - CARGA LIBERADA`);
      } catch (error) {
        await logger.error(`Erro ao registrar validação: ${error.message}`);
      }
    } else {
      setResultadoValidacao({
        status: 'erro',
        mensagem: 'Part Number NÃO encontrado na etiqueta de expedição! Verifique as etiquetas.',
        detalhes: resultado
      });

      const mensagemErro = `Part Number NÃO encontrado na etiqueta de expedição!\n` +
        `NF: ${dadosNF.numero_nf}\n` +
        `RAN: ${dadosNF.numero_ran}\n` +
        `Volume: ${dadosNF.volume_nf}\n` +
        `Ordem: ${etiquetaProducao.numero_ordem || 'N/A'}\n` +
        `Esperado: ${resultado.part_number_esperado}\n` +
        `Código lido: ${resultado.codigo_buscado}`;

      setModalErro({
        titulo: 'ERRO - PART NUMBER INCORRETO',
        mensagem: mensagemErro
      });

      // Registrar no banco
      try {
        await api.post('/validacoes', {
          chave_nf: dadosNF.chave.chave_limpa,
          numero_nf: dadosNF.numero_nf,
          numero_ran: dadosNF.numero_ran,
          numero_ordem: etiquetaProducao.numero_ordem,
          volume_nf: dadosNF.volume_nf,
          part_number1: partNumberEsperado,
          part_number2: 'NÃO ENCONTRADO',
          resultado: 'REJEITADO',
          usuario: 'SISTEMA',
          codigo_expedicao: codigo
        });

        await logger.warning(`VALIDAÇÃO FALHOU - NF: ${dadosNF.numero_nf}, RAN: ${dadosNF.numero_ran}, PartNumber: ${partNumberEsperado} - CARGA BLOQUEADA`);
      } catch (error) {
        await logger.error(`Erro ao registrar validação: ${error.message}`);
      }
    }

    return true;
  };

  const finalizarValidacao = () => {
    setEtiquetaProducao(null);
    setEtiquetaExpedicao(null);
    setResultadoValidacao(null);
    setModalErro(null);
    setModalSucesso(null);
    logger.info('Validação finalizada pelo usuário');
  };

  const novaNotaFiscal = () => {
    setDadosNF(null);
    setEtiquetaProducao(null);
    setEtiquetaExpedicao(null);
    setResultadoValidacao(null);
    setModalErro(null);
    setModalSucesso(null);
    logger.info('Nova nota fiscal iniciada');
  };

  const limparTudo = () => {
    setDadosNF(null);
    setEtiquetaProducao(null);
    setEtiquetaExpedicao(null);
    setResultadoValidacao(null);
    setModalErro(null);
    setModalSucesso(null);
    logger.info('Sistema limpo completamente');
  };

  const buscarRegistros = async (filtro = '') => {
    try {
      const data = await api.get('/validacoes', { filtro });
      setRegistros(data);
    } catch (error) {
      await logger.error(`Erro ao buscar registros: ${error.message}`);
    }
  };

  const atualizarLogs = async () => {
    try {
      const data = await api.get('/logs');
      setLogs(data);
    } catch (error) {
      await logger.error(`Erro ao buscar logs: ${error.message}`);
    }
  };

  return {
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
  };
};

export default useValidacao;