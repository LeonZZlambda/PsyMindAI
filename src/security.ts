import DOMPurify from 'dompurify'

// Type definitions for Trusted Types API (if not present in global types)
declare global {
  interface Window {
    trustedTypes?: {
      createPolicy: (name: string, rules: any) => any;
      defaultPolicy?: any;
    };
  }
}

/**
 * Trusted Types Implementation
 * Centralizes DOM-based XSS mitigation and satisfying CSP require-trusted-types-for 'script'.
 */
export function initSecurityPolicies() {
  const tt = window.trustedTypes;
  if (tt && tt.createPolicy) {
    if (!tt.defaultPolicy) {
      tt.createPolicy('default', {
        createHTML: (to_be_sanitized: string) => {
          return DOMPurify.sanitize(to_be_sanitized, { RETURN_TRUSTED_TYPE: true }) as unknown as string;
        },
        createScriptURL: (s: string) => s,
        createScript: (s: string) => s,
      });
    }
  }
}
