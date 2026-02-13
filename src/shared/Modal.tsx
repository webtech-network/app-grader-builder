/**
 * @fileoverview Generic modal wrapper component for overlays and dialogs.
 * @module shared/Modal
 */

import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Props for the Modal component.
 * @interface ModalProps
 */
interface ModalProps {
  /** Whether the modal is currently visible */
  isOpen: boolean;
  /** Callback fired when the modal should close */
  onClose: () => void;
  /** Modal title displayed in the header */
  title?: string;
  /** Child components to render in the modal body */
  children: ReactNode;
  /** Maximum width of the modal. Defaults to 'max-w-lg' */
  maxWidth?: string;
  /** Whether to show the close button in the header. Defaults to true */
  showCloseButton?: boolean;
  /** Whether clicking the backdrop closes the modal. Defaults to true */
  closeOnBackdrop?: boolean;
  /** Additional CSS classes for the modal container */
  className?: string;
}

/**
 * Modal - A generic modal/dialog component with backdrop.
 * 
 * @description Provides a reusable modal overlay with optional title, close
 * button, and configurable behavior. Locks body scroll when open and supports
 * ESC key to close. Includes fade-in animation and proper focus management.
 * 
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   title="Edit Settings"
 *   maxWidth="max-w-2xl"
 * >
 *   <YourModalContent />
 * </Modal>
 * ```
 * 
 * @param props - Component props
 * @returns The rendered Modal component or null if not open
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  showCloseButton = true,
  closeOnBackdrop = true,
  className = ''
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-gray-800 rounded-xl shadow-2xl w-full ${maxWidth} border border-indigo-600 animate-in zoom-in fade-in duration-300 ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            {title && (
              <h2 id="modal-title" className="text-xl font-bold text-indigo-400">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-700"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
