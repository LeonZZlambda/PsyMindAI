const isProd = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') || (import.meta && import.meta.env && import.meta.env.PROD);

const logger = {
  debug: (...args: any[]) => { if (!isProd) console.debug(...args); },
  info: (...args: any[]) => { console.info(...args); },
  warn: (...args: any[]) => { console.warn(...args); },
  error: (...args: any[]) => { console.error(...args); }
};

export default logger;
