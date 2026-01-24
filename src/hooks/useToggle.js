import { useState, useCallback } from 'react';

/**
 * Custom hook for managing boolean state (toggle)
 * @param {boolean} initialValue - Initial boolean value (default: false)
 * @returns {Object} - { value, toggle, setTrue, setFalse, set }
 */
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const set = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    set,
  };
};

export default useToggle;
