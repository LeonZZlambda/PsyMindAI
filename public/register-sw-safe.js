(function(){
  if (!('serviceWorker' in navigator)) return;
  // Only attempt registration in secure contexts (https or localhost)
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.info('[SW] registered', reg);
    } catch (err) {
      // Gracefully handle registration failures without leaving uncaught promise rejections
      console.warn('[SW] registration failed:', err && (err.message || err));
    }
  });
})();
