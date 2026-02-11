/**
 * @fileoverview Reusable textarea component with label and tooltip support.
 * @module components/feedback/components/LabeledTextArea
 */

import React, { ChangeEvent } from 'react';
import { Tooltip } from '../../../shared';

/**
 * Props for the LabeledTextArea component.
 * @interface LabeledTextAreaProps
 */
interface LabeledTextAreaProps {
  /** Current textarea value */
  value: string;
  /** Callback fired when the value changes */
  onChange: (value: string) => void;
  /** Label text displayed above the textarea */
  label: string;
  /** Optional tooltip text for additional context */
  tooltipText?: string;
  /** Placeholder text shown when empty */
  placeholder?: string;
  /** Minimum height of the textarea. Defaults to '150px' */
  minHeight?: string;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * LabeledTextArea - A multi-line text input with label and tooltip support.
 * 
 * @description Provides a styled textarea with consistent formatting, including
 * a label, optional tooltip icon, placeholder support, and configurable minimum
 * height. The textarea is resizable vertically.
 * 
 * @example
 * ```tsx
 * <LabeledTextArea
 *   value={context}
 *   onChange={setContext}
 *   label="Activity Context"
 *   tooltipText="Describe the assignment context"
 *   placeholder="Enter context here..."
 *   minHeight="200px"
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered LabeledTextArea component
 */
const LabeledTextArea: React.FC<LabeledTextAreaProps> = ({
  value,
  onChange,
  label,
  tooltipText,
  placeholder,
  minHeight = '150px',
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-2">
        <p className="text-gray-400 font-medium text-sm">{label}</p>
        {tooltipText && <Tooltip content={tooltipText} />}
      </div>
      <textarea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded-xl p-4 text-gray-300 text-xs leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
        style={{ minHeight }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default LabeledTextArea;
