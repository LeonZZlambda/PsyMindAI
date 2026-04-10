export function useModalAnimation(onClose?: () => void): [boolean, () => void];
export function useEscapeKey(callback?: () => void, isActive?: boolean): void;
export function usePlatform(): any;
export function useStorageKey<T = any>(key: string, initialValue?: T): [T, (v: T | ((prev: T) => T)) => void];
export const STORAGE_KEYS: Record<string, string>;

export {};
