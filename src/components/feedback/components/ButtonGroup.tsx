/**
 * @fileoverview Generic button group selector component with type safety.
 * @module components/feedback/components/ButtonGroup
 */

import React from 'react';
import { Tooltip } from '../../../shared';

/**
 * Represents a single option in the button group.
 * @interface ButtonOption
 * @template T - The type of the option value (must extend string)
 */
interface ButtonOption<T extends string> {
  /** The value associated with this option */
  value: T;
  /** Display label for the button */
  label: string;
}

/**
 * Props for the ButtonGroup component.
 * @interface ButtonGroupProps
 * @template T - The type of option values (must extend string)
 */
interface ButtonGroupProps<T extends string> {
  /** Label text displayed above the button group */
  label: string;
  /** Optional tooltip text for additional context */
  tooltipText?: string;
  /** Array of options to display as buttons */
  options: ButtonOption<T>[];
  /** Currently selected value */
  selectedValue: T;
  /** Callback fired when an option is selected */
  onSelect: (value: T) => void;
  /** CSS classes for the active/selected button state */
  activeClassName?: string;
  /** CSS classes for inactive/unselected button states */
  inactiveClassName?: string;
}

/**
 * ButtonGroup - A type-safe button selector for choosing between options.
 * 
 * @description Renders a row of pill-shaped buttons for single-select options.
 * Supports generic typing for type-safe value handling. Useful for selecting
 * from a small set of predefined options (e.g., 'yes', 'no', 'hint').
 * 
 * @example
 * ```tsx
 * type Mode = 'light' | 'dark' | 'auto';
 * 
 * <ButtonGroup<Mode>
 *   label="Theme Mode"
 *   options={[
 *     { value: 'light', label: 'Light' },
 *     { value: 'dark', label: 'Dark' },
 *     { value: 'auto', label: 'Auto' }
 *   ]}
 *   selectedValue={mode}
 *   onSelect={setMode}
 * />
 * ```
 * 
 * @template T - The type of option values
 * @param props - Component props
 * @returns The rendered ButtonGroup component
 */
function ButtonGroup<T extends string>({
  label,
  tooltipText,
  options,
  selectedValue,
  onSelect,
  activeClassName = 'bg-indigo-600 text-white',
  inactiveClassName = 'bg-gray-700 text-gray-300 hover:bg-gray-600'
}: ButtonGroupProps<T>): React.ReactElement {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-gray-400 font-medium">{label}</p>
        {tooltipText && <Tooltip content={tooltipText} />}
      </div>
      <div className="flex gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md transition-colors ${
              selectedValue === option.value ? activeClassName : inactiveClassName
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ButtonGroup;
