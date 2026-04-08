import i18n from '../../i18n/config';
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
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN'
};

/** HTTP status → tipo normalizado (Gemini / proxies / CDN). */
const HTTP_ERROR_MAP = {
  400: ERROR_TYPES.INVALID_KEY,
  401: ERROR_TYPES.INVALID_KEY,
  403: ERROR_TYPES.FORBIDDEN,
  404: ERROR_TYPES.NOT_FOUND,
  408: ERROR_TYPES.UNAVAILABLE,
  429: ERROR_TYPES.RATE_LIMIT,
  500: ERROR_TYPES.SERVER_ERROR,
  502: ERROR_TYPES.SERVER_ERROR,
  503: ERROR_TYPES.UNAVAILABLE,
  504: ERROR_TYPES.UNAVAILABLE
};

function translateErrorType(errorType) {
  const key = `api.errors.${errorType}`;
  return i18n.t(key, { defaultValue: i18n.t('api.errors.UNKNOWN') });
}

function statusFromParsedBody(body) {
  if (!body || typeof body !== 'object') return undefined;
  const err = body.error;
  if (!err || typeof err !== 'object') return undefined;
  const code = err.code;
  if (typeof code === 'number' && code >= 400 && code < 600) return code;
  if (typeof code === 'string' && /^\d{3}$/.test(code)) {
    const n = Number(code);
    if (n >= 400 && n < 600) return n;
  }
  return undefined;
}

function tryParseJsonMessage(message) {
  if (typeof message !== 'string' || !message.trim().startsWith('{')) return null;
  try {
    return JSON.parse(message);
  } catch {
    return null;
  }
}

function resolveHttpStatus(error) {
  if (error == null) return undefined;

  if (typeof error.status === 'number' && error.status >= 400 && error.status < 600) {
    return error.status;
  }

  const fromResponse = error.response?.status ?? error.response?.statusCode;
  if (typeof fromResponse === 'number') return fromResponse;

  const fromNested = error.error?.code ?? error.code;
  if (typeof fromNested === 'number' && fromNested >= 400 && fromNested < 600) {
    return fromNested;
  }

  const parsed = tryParseJsonMessage(error.message);
  const fromBody = statusFromParsedBody(parsed);
  if (fromBody != null) return fromBody;

  return undefined;
}

function isLikelyNetworkError(error) {
  const name = error?.name;
  if (name === 'TypeError' || name === 'NetworkError') return true;
  const msg = String(error?.message || '').toLowerCase();
  return (
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('load failed') ||
    msg.includes('network request failed') ||
    (msg.includes('sending request') && msg.includes('exception'))
  );
}

export function parseError(error) {
  let errorData = error;
  try {
    errorData = typeof error === 'string' ? JSON.parse(error) : error;
  } catch {
    errorData = error;
  }

  const message = errorData?.message;

  if (message === 'EMPTY_RESPONSE') {
    const errorType = ERROR_TYPES.EMPTY_RESPONSE;
    Telemetry.trackError('GEMINI_API', { type: errorType, code: null, details: message });
    return {
      type: errorType,
      code: null,
      message: translateErrorType(errorType),
      details: message
    };
  }

  if (message === 'API_KEY_MISSING') {
    const errorType = ERROR_TYPES.API_KEY_MISSING;
    Telemetry.trackError('GEMINI_API', { type: errorType, code: null, details: message });
    return {
      type: errorType,
      code: null,
      message: translateErrorType(errorType),
      details: message
    };
  }

  if (isLikelyNetworkError(errorData)) {
    const errorType = ERROR_TYPES.NETWORK;
    Telemetry.trackError('GEMINI_API', { type: errorType, code: null, details: message });
    return {
      type: errorType,
      code: null,
      message: translateErrorType(errorType),
      details: message
    };
  }

  const errorCode = resolveHttpStatus(errorData);
  const errorType =
    (errorCode != null && HTTP_ERROR_MAP[errorCode]) || ERROR_TYPES.UNKNOWN;
  const details = message;

  Telemetry.trackError('GEMINI_API', { type: errorType, code: errorCode, details });

  return {
    type: errorType,
    code: errorCode,
    message: translateErrorType(errorType),
    details
  };
}

export function createErrorResponse(errorType, details = null) {
  return {
    success: false,
    error: errorType,
    userMessage: translateErrorType(errorType),
    details
  };
}
