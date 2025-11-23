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
  [ERROR_TYPES.API_KEY_MISSING]: '🔑 Configure sua API Key do Gemini no arquivo .env para ativar a IA.',
  [ERROR_TYPES.INVALID_KEY]: '🔑 API Key expirada ou inválida. Gere uma nova em https://aistudio.google.com/app/apikey',
  [ERROR_TYPES.RATE_LIMIT]: '⏱️ Muitas requisições. Aguarde alguns segundos e tente novamente.',
  [ERROR_TYPES.FORBIDDEN]: '🚫 API Key sem permissões. Verifique sua configuração.',
  [ERROR_TYPES.NOT_FOUND]: '❌ Modelo não encontrado. Verifique a configuração da API.',
  [ERROR_TYPES.SERVER_ERROR]: '⚠️ Erro no servidor do Gemini. Tente novamente em instantes.',
  [ERROR_TYPES.UNAVAILABLE]: '🔧 Serviço temporariamente indisponível. Tente novamente.',
  [ERROR_TYPES.UNKNOWN]: '❌ Erro inesperado ao conectar com a IA. Tente novamente.'
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
  const errorData = typeof error === 'string' ? JSON.parse(error) : error;
  const errorCode = errorData?.error?.code || error.code;
  
  const errorType = HTTP_ERROR_MAP[errorCode] || ERROR_TYPES.UNKNOWN;
  
  return {
    type: errorType,
    code: errorCode,
    message: ERROR_MESSAGES[errorType],
    details: error.message
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
