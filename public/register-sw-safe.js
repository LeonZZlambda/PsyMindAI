(function(){
  if (!('serviceWorker' in navigator)) return;
  // Only attempt registration in secure contexts (https or localhost)
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;
  // Skip SW registration in development mode
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;

  window.addEventListener('load', async () => {
    try {
      const swUrl = '/sw.js';
      // Fetch the SW script first to ensure it's actually a JS file (not an HTML fallback)
      const res = await fetch(swUrl, { method: 'GET', cache: 'no-store' });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !/javascript|ecmascript|module/i.test(contentType)) {
        console.info('[SW] sw.js not available or not JavaScript; skipping registration', contentType);
        return;
      }

      let scriptUrl = swUrl;
      if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
          const policy = window.trustedTypes.createPolicy('dompurify', {
            createScriptURL: function(s) { return s; }
          });
          scriptUrl = policy.createScriptURL(swUrl);
        } catch (e) {
          console.warn('[SW] Trusted Types policy creation failed, using raw URL:', e);
        }
      }

      const reg = await navigator.serviceWorker.register(scriptUrl, { scope: '/' });
      console.info('[SW] registered', reg);
    } catch (err) {
      // Gracefully handle registration failures without leaving uncaught promise rejections
      console.warn('[SW] registration failed:', err && (err.message || err));
    }
  });
})();
