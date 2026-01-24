import { useState, useCallback } from 'react';

/**
 * Custom hook for managing array state with common operations
 * @param {Array} initialValue - Initial array value (default: [])
 * @returns {Object} - { items, add, remove, update, clear, set }
 */
const useArrayState = (initialValue = []) => {
  const [items, setItems] = useState(initialValue);

  const add = useCallback((item) => {
    setItems(prev => [...prev, item]);
  }, []);

  const remove = useCallback((index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const update = useCallback((index, newItem) => {
    setItems(prev => prev.map((item, i) => i === index ? newItem : item));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const set = useCallback((newItems) => {
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
};

export default useArrayState;
