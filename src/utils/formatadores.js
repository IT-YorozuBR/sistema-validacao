export const formatarChaveNF = (chave) => {
  const numeros = chave.replace(/\D/g, '');
  const grupos = numeros.match(/.{1,4}/g);
  return grupos ? grupos.join(' ') : numeros;
};

export const formatarDataHora = () => {
  const agora = new Date();
  return {
    data: agora.toLocaleDateString('pt-BR').split('/').reverse().join('-'),
    hora: agora.toLocaleTimeString('pt-BR')
  };
};

export const truncarTexto = (texto, tamanho = 20) => {
  if (!texto) return '';
  return texto.length > tamanho ? `${texto.substring(0, tamanho)}...` : texto;
};