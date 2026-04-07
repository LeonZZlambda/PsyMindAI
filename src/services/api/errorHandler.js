import { Telemetry } from '../analytics/telemetry';

export const ERROR_TYPES = {
  API_KEY_MISSING: 'API_KEY_MISSING',
  INVALID_KEY: 'INVALID_KEY',
  RATE_LIMIT: 'RATE_LIMIT',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  UNAVAILABLE: 'UNAVAILABLE',
  EMPTY_RESPONSE: 'EMPTY_RESPONSE',
  UNKNOWN: 'UNKNOWN'
};

const ERROR_MESSAGES = {
  [ERROR_TYPES.API_KEY_MISSING]: '🔑 Para que eu possa conversar com você com todo o meu potencial, preciso que uma API Key seja configurada no arquivo .env.',
  [ERROR_TYPES.INVALID_KEY]: '🔑 Ops, parece que a chave de acesso (API Key) expirou ou é inválida. Que tal gerar uma nova em https://aistudio.google.com/app/apikey ? 💜',
  [ERROR_TYPES.RATE_LIMIT]: 'Desculpe! 💜 Eu estou um pouco sobrecarregada agora com muitas mensagens. Você se importa de aguardar um momentinho e tentar novamente?',
  [ERROR_TYPES.FORBIDDEN]: '🚫 Ah, a API Key atual parece estar sem as permissões necessárias. Você poderia verificar a configuração? 💜',
  [ERROR_TYPES.NOT_FOUND]: '❌ Ops, ocorreu um problema e o modelo de IA que estou tentando acessar não foi encontrado nas configurações.',
  [ERROR_TYPES.SERVER_ERROR]: '⚠️ Eita, parece que meus sistemas estão passando por uma instabilidade temporária. Tente novamente em instantes.',
  [ERROR_TYPES.UNAVAILABLE]: '🔧 Meu serviço está temporariamente indisponível. Vamos tentar de novo em instantes?',
  [ERROR_TYPES.UNKNOWN]: 'Desculpe, eu não consegui me conectar agora, estava processando muita informação ao mesmo tempo! 💜 Tente me enviar sua mensagem de novo em alguns instantes.'
};

const HTTP_ERROR_MAP = {
  400: ERROR_TYPES.INVALID_KEY,
  429: ERROR_TYPES.RATE_LIMIT,
  403: ERROR_TYPES.FORBIDDEN,
  404: ERROR_TYPES.NOT_FOUND,
  500: ERROR_TYPES.SERVER_ERROR,
  503: ERROR_TYPES.UNAVAILABLE
};

export function parseError(error) {
  let errorData;
  try {
    errorData = typeof error === 'string' ? JSON.parse(error) : error;
  } catch (e) {
    errorData = error;
  }
  const errorCode = errorData?.status || errorData?.response?.status || errorData?.error?.code || error.code || error.status;
  
  const errorType = HTTP_ERROR_MAP[errorCode] || ERROR_TYPES.UNKNOWN;
  const details = error.message;

  Telemetry.trackError('GEMINI_API', { type: errorType, code: errorCode, details });

  return {
    type: errorType,
    code: errorCode,
    message: ERROR_MESSAGES[errorType],
    details
  };
}

export function createErrorResponse(errorType, details = null) {
  return {
    success: false,
    error: errorType,
    userMessage: ERROR_MESSAGES[errorType],
    details
  };
}
