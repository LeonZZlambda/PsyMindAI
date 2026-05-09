export const RTL_LANGUAGES = ['ar', 'fa', 'ur', 'he'];

export const isRTL = (lang: string): boolean => RTL_LANGUAGES.includes(lang.split('-')[0]);
