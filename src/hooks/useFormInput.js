import { useState, useCallback } from 'react';

/**
 * Custom hook for managing form input state
 * @param {string} initialValue - Initial input value (default: '')
 * @returns {Object} - { value, onChange, clear, set }
 */
const useFormInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const clear = useCallback(() => {
    setValue('');
  }, []);

  const set = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  return {
    value,
    onChange,
    clear,
    set,
  };
};

export default useFormInput;
