/**
 * Utility functions for handling external links and determining when to warn users.
 */

const TRUSTED_DOMAINS = [
  'github.com',
  'docs.psymind.ai',
  'psymind.ai'
];

/**
 * Checks if a URL is an external HTTP/HTTPS link.
 */
export const isExternalUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url, window.location.href);
    return (
      (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') &&
      urlObj.hostname !== window.location.hostname
    );
  } catch (error) {
    // Malformed URLs or simple relative paths that can't be parsed
    return false;
  }
};

/**
 * Checks if we should warn the user before navigating to the given URL or anchor element.
 */
export const shouldWarnForExternalLink = (anchor: HTMLAnchorElement): boolean => {
  const url = anchor.href;
  
  // 1. Ignore if no URL
  if (!url) return false;

  // 2. Ignore special protocols
  const lowerUrl = url.toLowerCase();
  if (
    lowerUrl.startsWith('mailto:') ||
    lowerUrl.startsWith('tel:') ||
    lowerUrl.startsWith('sms:') ||
    lowerUrl.startsWith('blob:') ||
    lowerUrl.startsWith('javascript:')
  ) {
    return false;
  }

  // 3. Ignore if explicitly bypassed
  if (anchor.hasAttribute('data-bypass-external-warning')) {
    return false;
  }

  // 4. Ignore downloads
  if (anchor.hasAttribute('download')) {
    return false;
  }

  // 5. Must be an actual external link
  if (!isExternalUrl(url)) {
    return false;
  }

  try {
    const urlObj = new URL(url, window.location.href);
    
    // 6. Check against whitelist
    const hostname = urlObj.hostname.toLowerCase();
    
    // Allow if hostname exactly matches or is a subdomain of a trusted domain
    const isTrusted = TRUSTED_DOMAINS.some(domain => {
      const lowerDomain = domain.toLowerCase();
      return hostname === lowerDomain || hostname.endsWith(`.${lowerDomain}`);
    });

    return !isTrusted;
  } catch (error) {
    // If it can't be parsed, don't warn/intercept (fallback to default behavior)
    return false;
  }
};
