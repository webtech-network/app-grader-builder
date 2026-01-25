import { useState, useCallback } from 'react';

export interface UseSaveStateReturn {
  isSaved: boolean;
  showSuccess: boolean;
  showAnimation: boolean;
  triggerSave: () => void;
  cancelSave: () => void;
}

/**
 * Custom hook for managing save button state and animations
 */
const useSaveState = (): UseSaveStateReturn => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);

  const triggerSave = useCallback(() => {
    setShowAnimation(true);
    setShowSuccess(true);
    setIsSaved(true);

    // Reset animation after it completes
    setTimeout(() => {
      setShowAnimation(false);
    }, 600);

    // Hide success message after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  }, []);

  const cancelSave = useCallback(() => {
    setIsSaved(false);
    setShowSuccess(false);
    setShowAnimation(false);
  }, []);

  return {
    isSaved,
    showSuccess,
    showAnimation,
    triggerSave,
    cancelSave,
  };
};

export default useSaveState;
