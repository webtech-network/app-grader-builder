/**
 * @fileoverview Toggle switch component for boolean settings.
 * @module components/feedback/components/ToggleSwitch
 */

import React, { ChangeEvent } from 'react';
import { Tooltip } from '../../../shared';

/**
 * Props for the ToggleSwitch component.
 * @interface ToggleSwitchProps
 */
interface ToggleSwitchProps {
  /** Unique identifier for the toggle (used for label association) */
  id: string;
  /** Display label for the toggle */
  label: string;
  /** Optional tooltip text for additional context */
  tooltipText?: string;
  /** Current checked/on state */
  isChecked: boolean;
  /** Callback fired when the toggle state changes */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * ToggleSwitch - A styled checkbox presented as a toggle switch.
 * 
 * @description Renders a toggle switch (on/off) control with a label and
 * optional tooltip. Uses custom CSS for the sliding toggle appearance.
 * Wraps a native checkbox input for accessibility.
 * 
 * @example
 * ```tsx
 * <ToggleSwitch
 *   id="show_score"
 *   label="Show Score"
 *   tooltipText="Display the numeric score in feedback"
 *   isChecked={showScore}
 *   onChange={() => setShowScore(!showScore)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered ToggleSwitch component
 */
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, label, tooltipText, isChecked, onChange }) => {
  const containerId = `toggle-${id}`;
  return (
    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-xl border border-gray-700 shadow-md">
      <div className="fex items-center gap-2">
        <span className="font-medium text-gray-300 text-sm">{label}</span>
        {tooltipText && <Tooltip content={tooltipText} />}
      </div>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input 
          type="checkbox" 
          name={id}
          id={containerId} 
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in z-10" 
          checked={isChecked}
          onChange={onChange}
        />
        <label 
          htmlFor={containerId} 
          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer transition-colors duration-200 ease-in"
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;
