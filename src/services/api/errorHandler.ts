import { i18n } from '@/i18n/config';
import { Telemetry } from '@/services/analytics/telemetry';

/**
 * Error type constants for API error categorization
 */
export enum ErrorType {
  API_KEY_MISSING = 'API_KEY_MISSING',
  INVALID_KEY = 'INVALID_KEY',
  RATE_LIMIT = 'RATE_LIMIT',
  CONTEXT_LENGTH_EXCEEDED = 'CONTEXT_LENGTH_EXCEEDED',
  SAFETY_FILTER = 'SAFETY_FILTER',
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  EMPTY_RESPONSE = 'EMPTY_RESPONSE',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  UNKNOWN = 'UNKNOWN'
}

/**
 * HTTP status code to error type mapping
 */
const HTTP_ERROR_MAP: Record<number, ErrorType> = {
  400: ErrorType.INVALID_KEY,
  401: ErrorType.API_KEY_MISSING,
  403: ErrorType.INVALID_KEY,
  429: ErrorType.RATE_LIMIT,
  500: ErrorType.SERVICE_UNAVAILABLE,
  502: ErrorType.SERVICE_UNAVAILABLE,
  503: ErrorType.SERVICE_UNAVAILABLE,
  504: ErrorType.TIMEOUT
};

/**
 * Structured error response
 */
export interface ApiError {
  type: ErrorType;
  code: number | null;
  message: string;
  details: string | undefined;
}

/**
 * Parsed error body structure
 */
interface ParsedErrorBody {
  error?: {
    code?: number;
    message?: string;
  };
  message?: string;
}

/**
 * Error object with flexible structure
 */
interface ErrorObject {
  name?: string;
  message?: string;
  status?: number;
  code?: number;
  response?: {
    status?: number;
    statusCode?: number;
  };
  error?: {
    code?: number;
  };
}

/**
 * Translates error type to user-friendly message
 */
function translateErrorType(errorType: ErrorType): string {
  const translations: Record<ErrorType, string> = {
    [ErrorType.API_KEY_MISSING]: i18n.t('errors.apiKeyMissing'),
    [ErrorType.INVALID_KEY]: i18n.t('errors.invalidKey'),
    [ErrorType.RATE_LIMIT]: i18n.t('errors.rateLimit'),
    [ErrorType.CONTEXT_LENGTH_EXCEEDED]: i18n.t('errors.contextLengthExceeded'),
    [ErrorType.SAFETY_FILTER]: i18n.t('errors.safetyFilter'),
    [ErrorType.NETWORK]: i18n.t('errors.network'),
    [ErrorType.TIMEOUT]: i18n.t('errors.timeout'),
    [ErrorType.EMPTY_RESPONSE]: i18n.t('errors.emptyResponse'),
    [ErrorType.SERVICE_UNAVAILABLE]: i18n.t('errors.serviceUnavailable'),
    [ErrorType.UNKNOWN]: i18n.t('errors.unknown')
  };

  return translations[errorType] || 'Erro desconhecido';
}

/**
 * Extracts HTTP status from parsed JSON body
 */
function statusFromParsedBody(parsed: ParsedErrorBody | null): number | undefined {
  if (!parsed) return undefined;
  return parsed.error?.code ?? parsed.message ? 500 : undefined;
}

/**
 * Safely parses JSON from error message string
 */
function tryParseJsonMessage(message: string | undefined): ParsedErrorBody | null {
  if (typeof message !== 'string' || !message.trim().startsWith('{')) return null;
  try {
    return JSON.parse(message);
  } catch {
    return null;
  }
}

/**
 * Resolves HTTP status from various error object locations
 */
function resolveHttpStatus(error: ErrorObject | null | undefined): number | undefined {
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

/**
 * Detects if error is likely a network/connectivity error
 */
function isLikelyNetworkError(error: ErrorObject | null | undefined): boolean {
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

/**
 * Main error parsing function
 * Converts raw errors to structured ApiError objects with telemetry tracking
 */
export function parseError(error: unknown): ApiError {
  let errorData: ErrorObject | unknown = error;
  try {
    errorData = typeof error === 'string' ? JSON.parse(error) : error;
  } catch {
    errorData = error;
  }

  const message = (errorData as ErrorObject)?.message;

  if (message === 'EMPTY_RESPONSE') {
    const errorType = ErrorType.EMPTY_RESPONSE;
    Telemetry.trackError('GEMINI_API', { type: errorType, code: null, details: message });
    return {
      type: errorType,
      code: null,
      message: translateErrorType(errorType),
      details: message
    };
  }

  if (message === 'API_KEY_MISSING') {
    const errorType = ErrorType.API_KEY_MISSING;
    Telemetry.trackError('GEMINI_API', { type: errorType, code: null, details: message });
    return {
      type: errorType,
      code: null,
      message: translateErrorType(errorType),
      details: message
    };
  }

  if (isLikelyNetworkError(errorData as ErrorObject)) {
    const errorType = ErrorType.NETWORK;
    Telemetry.trackError('GEMINI_API', { type: errorType, code: null, details: message });
    return {
      type: errorType,
      code: null,
      message: translateErrorType(errorType),
      details: message
    };
  }

  const errorCode = resolveHttpStatus(errorData as ErrorObject);
  const errorType =
    (errorCode != null && HTTP_ERROR_MAP[errorCode]) || ErrorType.UNKNOWN;
  const details = message;

  Telemetry.trackError('GEMINI_API', { type: errorType, code: errorCode, details });

  return {
    type: errorType,
    code: errorCode,
    message: translateErrorType(errorType),
    details
  };
}
