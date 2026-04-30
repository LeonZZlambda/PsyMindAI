(function() {
  try {
    var theme = localStorage.getItem('themeMode') || 'system';
    var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.style.backgroundColor = '#202124';
      document.documentElement.classList.add('dark-theme-init');
    } else {
      document.documentElement.style.backgroundColor = '#FFFFFF';
    }
  } catch (e) {}
})();
