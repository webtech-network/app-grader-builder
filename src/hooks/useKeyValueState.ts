import { useState, useCallback } from 'react';

export interface UseKeyValueStateReturn<T = unknown> {
  state: Record<string, T>;
  set: (key: string, value: T) => void;
  update: (updates: Record<string, T>) => void;
  remove: (key: string) => void;
  clear: () => void;
}

/**
 * Custom hook for managing key-value state (object/dictionary)
 * @param initialValue - Initial object value (default: {})
 */
function useKeyValueState<T = unknown>(initialValue: Record<string, T> = {}): UseKeyValueStateReturn<T> {
  const [state, setState] = useState<Record<string, T>>(initialValue);

  const set = useCallback((key: string, value: T) => {
    setState(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const update = useCallback((updates: Record<string, T>) => {
    setState(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const remove = useCallback((key: string) => {
    setState(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const clear = useCallback(() => {
    setState({} as Record<string, T>);
  }, []);

  return {
    state,
    set,
    update,
    remove,
    clear,
  };
}

export default useKeyValueState;
