import { useEffect, useState } from 'react';

const identity = (value) => value;
const resolve = (value) => (typeof value === 'function' ? value() : value);

/**
 * Safely read a JSON value from localStorage.
 * `validate` returns the cleaned value, or undefined if the stored shape is wrong.
 * Missing data → initialValue. Unparseable / invalid data → initialValue + corrupted flag.
 */
export function readStorage(key, initialValue, validate = identity) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return { value: resolve(initialValue), corrupted: false };
    const value = validate(JSON.parse(raw));
    if (value === undefined) throw new Error(`Invalid data shape for "${key}"`);
    return { value, corrupted: false };
  } catch (error) {
    console.warn(`[storage] Could not read "${key}", falling back to defaults.`, error);
    return { value: resolve(initialValue), corrupted: true };
  }
}

/** useState that persists to localStorage. Returns [value, setValue, wasCorrupted]. */
export function useLocalStorage(key, initialValue, validate = identity) {
  // Lazy initializer: localStorage is read only once, on the first render.
  const [initial] = useState(() => readStorage(key, initialValue, validate));
  const [value, setValue] = useState(initial.value);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Quota exceeded or storage disabled: the app keeps working in memory.
      console.warn(`[storage] Could not save "${key}".`, error);
    }
  }, [key, value]);

  return [value, setValue, initial.corrupted];
}
