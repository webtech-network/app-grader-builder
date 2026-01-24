import { useState, useCallback } from 'react';

/**
 * Custom hook for managing save button state and animations
 * @returns {Object} - { isSaved, showSuccess, showAnimation, triggerSave, cancelSave }
 */
const useSaveState = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

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
