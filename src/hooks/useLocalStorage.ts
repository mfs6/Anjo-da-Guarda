
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValueArg: T | (() => T)) {
  // Resolve initialValueArg once to ensure it's stable for dependencies
  const getInitialValue = useCallback(() => {
    return initialValueArg instanceof Function ? initialValueArg() : initialValueArg;
  }, [initialValueArg]);

  // The state that will be returned. 
  // Initialize with the resolved initialValue for SSR and first client render.
  const [storedValue, setStoredValue] = useState<T>(getInitialValue);

  // Effect to load from localStorage on the client after the component mounts.
  useEffect(() => {
    // This check ensures it only runs on the client
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) { // Check for null explicitly
          setStoredValue(JSON.parse(item));
        }
        // If item is null, storedValue remains the initialValue set by useState, which is correct.
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}" in useEffect:`, error);
        // Value remains initialValue in case of error.
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [key]); // Only re-run if the key changes. initialValue is stable via getInitialValue.

  // Effect to save to localStorage whenever storedValue changes.
  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      // If the current storedValue is the same as the initial resolved value,
      // AND localStorage doesn't already have this key, we might not need to write.
      // However, always writing simplifies logic and handles cases where localStorage
      // might have an old/stale value that needs to be overwritten by a "reset" to initialValue.
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue]);
  
  // Effect to handle changes from other tabs/windows (storage event).
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        try {
          if (event.newValue === null) {
            // Value was removed or cleared in another tab, reset to initial.
            setStoredValue(getInitialValue()); 
          } else {
            setStoredValue(JSON.parse(event.newValue));
          }
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}" on storage event:`, error);
          setStoredValue(getInitialValue()); // Fallback to initial value
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, getInitialValue]);

  return [storedValue, setStoredValue] as const;
}
