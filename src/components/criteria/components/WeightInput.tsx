/**
 * @fileoverview Weight input component with inline editing.
 * @module components/criteria/components/WeightInput
 */

import React, { ChangeEvent, KeyboardEvent } from 'react';

/**
 * Props for the WeightInput component.
 * @interface WeightInputProps
 */
interface WeightInputProps {
  /** Current weight value */
  value: number;
  /** Callback fired when the weight changes */
  onChange: (value: string) => void;
  /** Whether the input is currently visible/active */
  isVisible: boolean;
  /** Callback to toggle visibility */
  onToggleVisibility: () => void;
  /** Maximum allowed weight value. Defaults to no limit */
  max?: number;
  /** Minimum allowed weight value. Defaults to 0 */
  min?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * WeightInput - An inline-editable weight input field.
 * 
 * @description Displays weight as text that becomes an input when clicked.
 * Supports Enter key to commit changes and Escape key to cancel.
 * 
 * @example
 * ```tsx
 * <WeightInput
 *   value={weight}
 *   onChange={(val) => setWeight(Number(val))}
 *   isVisible={showInput}
 *   onToggleVisibility={() => setShowInput(!showInput)}
 *   max={100}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered WeightInput component
 */
const WeightInput: React.FC<WeightInputProps> = ({
  value,
  onChange,
  isVisible,
  onToggleVisibility,
  max,
  min = 0,
  className = ''
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onToggleVisibility();
    } else if (e.key === 'Escape') {
      onToggleVisibility();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    onChange(val);
  };

  if (isVisible) {
    return (
      <input
        type="number"
        value={value}
        onChange={handleChange}
        onBlur={onToggleVisibility}
        onKeyDown={handleKeyDown}
        min={min}
        max={max}
        step="0.1"
        autoFocus
        className={`w-16 px-2 py-1 bg-gray-900 border border-indigo-500 rounded text-center focus:outline-none focus:ring-1 focus:ring-indigo-400 ${className}`}
      />
    );
  }

  return (
    <span
      onClick={onToggleVisibility}
      className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-700 transition-colors ${className}`}
      title="Click to edit weight"
    >
      <span className="font-semibold">{value.toFixed(1)}</span>
      <span className="text-xs ml-0.5">%</span>
    </span>
  );
};

export default WeightInput;
