import i18n from '../../i18n/config';
import { Telemetry } from '../analytics/telemetry';

/**
 * Error type constants for API error categorization
 */
export enum ErrorType {
  API_KEY_MISSING = 'API_KEY_MISSING',
  INVALID_KEY = 'INVALID_KEY',
  RATE_LIMIT = 'RATE_LIMIT',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  UNAVAILABLE = 'UNAVAILABLE',
  EMPTY_RESPONSE = 'EMPTY_RESPONSE',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN'
}

/**
 * HTTP status code to error type mapping
 */
const HTTP_ERROR_MAP: Record<number, ErrorType> = {
  400: ErrorType.INVALID_KEY,
  401: ErrorType.INVALID_KEY,
  403: ErrorType.FORBIDDEN,
  404: ErrorType.NOT_FOUND,
  408: ErrorType.UNAVAILABLE,
  429: ErrorType.RATE_LIMIT,
  500: ErrorType.SERVER_ERROR,
  502: ErrorType.SERVER_ERROR,
  503: ErrorType.UNAVAILABLE,
  504: ErrorType.UNAVAILABLE
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
 * Error response sent to client
 */
export interface ErrorResponse {
  success: false;
  error: ErrorType;
  userMessage: string;
  details: string | null | undefined;
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
    [ErrorType.API_KEY_MISSING]: i18n.t('api.errors.API_KEY_MISSING'),
    [ErrorType.INVALID_KEY]: i18n.t('api.errors.INVALID_KEY'),
    [ErrorType.RATE_LIMIT]: i18n.t('api.errors.RATE_LIMIT'),
    [ErrorType.FORBIDDEN]: i18n.t('api.errors.FORBIDDEN'),
    [ErrorType.NOT_FOUND]: i18n.t('api.errors.NOT_FOUND'),
    [ErrorType.SERVER_ERROR]: i18n.t('api.errors.SERVER_ERROR'),
    [ErrorType.UNAVAILABLE]: i18n.t('api.errors.UNAVAILABLE'),
    [ErrorType.EMPTY_RESPONSE]: i18n.t('api.errors.EMPTY_RESPONSE'),
    [ErrorType.NETWORK]: i18n.t('api.errors.NETWORK'),
    [ErrorType.UNKNOWN]: i18n.t('api.errors.UNKNOWN')
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
    code: errorCode ?? null,
    message: translateErrorType(errorType),
    details
  };
}

/**
 * Creates a standardized error response object
 */
export function createErrorResponse(
  errorType: ErrorType,
  details: string | null | undefined = null
): ErrorResponse {
  return {
    success: false,
    error: errorType,
    userMessage: translateErrorType(errorType),
    details
  };
}
