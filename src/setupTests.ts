// Register jest-dom matchers with Vitest
import '@testing-library/jest-dom/vitest';

// Force a sane localStorage for tests.
// Node.js 25+ can expose a broken `globalThis.localStorage` (empty object) when `--localstorage-file` is unset/invalid.
let _store = {} as Record<string, string>;
const testLocalStorage = {
	getItem: (k: string) => (_store.hasOwnProperty(k) ? _store[k] : null),
	setItem: (k: string, v: string) => { _store[k] = String(v); },
	removeItem: (k: string) => { delete _store[k]; },
	clear: () => { _store = {}; }
} as any;

Object.defineProperty(globalThis, 'localStorage', {
	value: testLocalStorage,
	configurable: true,
	writable: true,
});
