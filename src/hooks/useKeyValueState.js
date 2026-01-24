import { useState, useCallback } from 'react';

/**
 * Custom hook for managing key-value state (object/dictionary)
 * @param {Object} initialValue - Initial object value (default: {})
 * @returns {Object} - { state, set, update, remove, clear }
 */
const useKeyValueState = (initialValue = {}) => {
  const [state, setState] = useState(initialValue);

  const set = useCallback((key, value) => {
    setState(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const update = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const remove = useCallback((key) => {
    setState(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const clear = useCallback(() => {
    setState({});
  }, []);

  return {
    state,
    set,
    update,
    remove,
    clear,
  };
};

export default useKeyValueState;
