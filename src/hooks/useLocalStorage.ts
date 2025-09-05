
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValueArg: T | (() => T)) {
  const getInitialValue = useCallback((): T => {
    // This function should not run on the server.
    if (typeof window === 'undefined') {
      return initialValueArg instanceof Function ? initialValueArg() : initialValueArg;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : (initialValueArg instanceof Function ? initialValueArg() : initialValueArg);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValueArg instanceof Function ? initialValueArg() : initialValueArg;
    }
  }, [key, initialValueArg]);

  const [storedValue, setStoredValue] = useState<T>(getInitialValue);

  const setValue = (value: T | ((val: T) => T)) => {
    if (typeof window === 'undefined') {
      console.warn(`Tried to set localStorage key "${key}" even though no "window" exists.`);
      return;
    }
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key);
      if (item) {
        try {
          const parsedItem = JSON.parse(item);
          if (JSON.stringify(parsedItem) !== JSON.stringify(storedValue)) {
            setStoredValue(parsedItem);
          }
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}" in useEffect:`, error);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}" on storage event:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}
