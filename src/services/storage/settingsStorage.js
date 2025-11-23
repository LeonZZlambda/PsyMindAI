export function loadSetting(key, defaultValue) {
  if (typeof window === 'undefined') return defaultValue;
  return localStorage.getItem(key) || defaultValue;
}

export function saveSetting(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}

export function loadBooleanSetting(key, defaultValue = false) {
  if (typeof window === 'undefined') return defaultValue;
  const value = localStorage.getItem(key);
  return value === 'true';
}
