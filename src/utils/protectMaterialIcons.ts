/**
 * Material Icons Translation Protection
 * 
 * Automatically adds translate="no" to all Material Symbols icons
 * to prevent Google Translate from breaking icon ligatures.
 */

export function protectMaterialIcons() {
  if (typeof document === 'undefined') return;

  const applyProtection = () => {
    const icons = document.querySelectorAll('.material-symbols-outlined');
    icons.forEach((icon) => {
      if (!icon.hasAttribute('translate')) {
        icon.setAttribute('translate', 'no');
      }
    });
  };

  // Apply immediately
  applyProtection();

  // Re-apply when DOM changes (for dynamically added icons)
  const observer = new MutationObserver(() => {
    applyProtection();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}
