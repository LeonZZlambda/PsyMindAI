import DOMPurify from 'dompurify'

/**
 * Trusted Types Implementation
 * Centralizes DOM-based XSS mitigation and satisfying CSP require-trusted-types-for 'script'.
 */
export function initSecurityPolicies() {
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    if (!window.trustedTypes.defaultPolicy) {
      window.trustedTypes.createPolicy('default', {
        createHTML: (to_be_sanitized: string) => {
          return DOMPurify.sanitize(to_be_sanitized, { RETURN_TRUSTED_TYPE: true }) as unknown as string;
        },
        createScriptURL: (s: string) => s,
        createScript: (s: string) => s,
      });
    }
  }
}
