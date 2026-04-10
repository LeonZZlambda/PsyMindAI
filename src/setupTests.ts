// Register jest-dom matchers with Vitest's `expect`
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers as any);

// Ensure a sane localStorage for tests (some environments / node flags can break jsdom localStorage)
if (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== 'function') {
	let _store = {} as Record<string, string>;
	globalThis.localStorage = {
		getItem: (k: string) => (_store.hasOwnProperty(k) ? _store[k] : null),
		setItem: (k: string, v: string) => { _store[k] = String(v); },
		removeItem: (k: string) => { delete _store[k]; },
		clear: () => { _store = {}; }
	} as any;
}
