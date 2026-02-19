export const validarChaveNF = (chave) => {
  // Remove caracteres não numéricos
  const chaveLimpa = chave.replace(/[^0-9]/g, '');

  // Verifica se tem 44 dígitos
  if (chaveLimpa.length !== 44) {
    return {
      valida: false,
      erro: 'Chave NF deve conter 44 dígitos',
      chave_limpa: chaveLimpa
    };
  }

  // Verifica o código da UF (primeiros 2 dígitos)
  const uf = parseInt(chaveLimpa.substring(0, 2));
  if (uf < 11 || uf > 99) {
    return {
      valida: false,
      erro: 'Código da UF inválido',
      chave_limpa: chaveLimpa
    };
  }

  // Verifica o formato AAMM (ano e mês)
  const aamm = chaveLimpa.substring(2, 6);
  const mes = parseInt(aamm.substring(2, 4));
  
  if (mes < 1 || mes > 12) {
    return {
      valida: false,
      erro: 'Mês inválido na chave NF',
      chave_limpa: chaveLimpa
    };
  }

  // Extrai o número da NF (posições 25-33, 9 dígitos)
  const numeroNf = chaveLimpa.substring(25, 34);

  // Formata a chave para exibição
  const chaveFormatada = chaveLimpa.match(/.{1,4}/g).join(' ');

  return {
    valida: true,
    chave_limpa: chaveLimpa,
    chave_formatada: chaveFormatada,
    uf: chaveLimpa.substring(0, 2),
    aamm: aamm,
    cnpj: chaveLimpa.substring(6, 20),
    modelo: chaveLimpa.substring(20, 22),
    serie: chaveLimpa.substring(22, 25),
    numero_nf: numeroNf,
    codigo: chaveLimpa.substring(34, 42),
    dv: chaveLimpa.substring(43, 44)
  };
};

export const extrairDadosEtiquetaProducao = (etiqueta) => {
  const dados = {
    part_number: null,
    numero_ordem: null,
    codigo_completo: etiqueta
  };

  if (etiqueta.length >= 13) {
    dados.part_number = etiqueta.substring(3, 13);
  }

  // Procura pelo número da ordem (começa com M seguido de números)
  const match = etiqueta.match(/M\d+/);
  if (match) {
    dados.numero_ordem = match[0];
  }

  return dados;
};

export const validarPartNumberEtiquetaExpedicao = (codigo, partNumberEsperado) => {
  const codigoUpper = codigo.toUpperCase();
  const pnEsperadoUpper = partNumberEsperado.toUpperCase();

  // Verifica se o part number está contido no código de expedição
  const posicao = codigoUpper.indexOf(pnEsperadoUpper);
  if (posicao !== -1) {
    return {
      encontrado: true,
      posicao: posicao,
      part_number_encontrado: pnEsperadoUpper
    };
  }

  // Tenta encontrar por similaridade (para códigos com formatação diferente)
  const codigoSemEspacos = codigoUpper.replace(/[^A-Z0-9]/g, '');
  const pnSemEspacos = pnEsperadoUpper.replace(/[^A-Z0-9]/g, '');

  const posicao2 = codigoSemEspacos.indexOf(pnSemEspacos);
  if (posicao2 !== -1) {
    return {
      encontrado: true,
      posicao: posicao2,
      part_number_encontrado: pnSemEspacos,
      observacao: 'Part Number encontrado após remoção de caracteres especiais'
    };
  }

  return {
    encontrado: false,
    codigo_buscado: codigoUpper,
    part_number_esperado: pnEsperadoUpper
  };
};