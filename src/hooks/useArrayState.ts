import { useState, useCallback } from 'react';

export interface UseArrayStateReturn<T> {
  items: T[];
  add: (item: T) => void;
  remove: (index: number) => void;
  update: (index: number, item: T) => void;
  clear: () => void;
  set: (items: T[]) => void;
}

/**
 * Custom hook for managing array state with common operations
 * @param initialValue - Initial array value (default: [])
 */
function useArrayState<T>(initialValue: T[] = []): UseArrayStateReturn<T> {
  const [items, setItems] = useState<T[]>(initialValue);

  const add = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);

  const remove = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const update = useCallback((index: number, newItem: T) => {
    setItems(prev => prev.map((item, i) => i === index ? newItem : item));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const set = useCallback((newItems: T[]) => {
    setItems(newItems);
  }, []);

  return {
    items,
    add,
    remove,
    update,
    clear,
    set,
  };
}

export default useArrayState;
