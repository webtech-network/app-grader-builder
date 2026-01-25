import { useState, useCallback, ChangeEvent } from 'react';

export interface UseFormInputReturn {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  clear: () => void;
  set: (value: string) => void;
}

/**
 * Custom hook for managing form input state
 * @param initialValue - Initial input value (default: '')
 */
const useFormInput = (initialValue: string = ''): UseFormInputReturn => {
  const [value, setValue] = useState<string>(initialValue);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  }, []);

  const clear = useCallback(() => {
    setValue('');
  }, []);

  const set = useCallback((newValue: string) => {
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
