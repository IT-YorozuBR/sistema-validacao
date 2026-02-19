import api from './api';

const logger = {
  async log(level, message) {
    try {
      await api.post('/logs', { level, message });
    } catch (error) {
      console.error('Erro ao registrar log:', error);
    }
  },

  info(message) {
    return this.log('info', message);
  },

  warning(message) {
    return this.log('warning', message);
  },

  error(message) {
    return this.log('error', message);
  },

  success(message) {
    return this.log('success', message);
  }
};

export default logger;