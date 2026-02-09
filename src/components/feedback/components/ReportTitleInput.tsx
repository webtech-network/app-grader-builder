/**
 * @fileoverview Single-line text input component with label and tooltip.
 * @module components/feedback/components/ReportTitleInput
 */

import React, { ChangeEvent } from 'react';
import { Tooltip } from '../../../shared';

/**
 * Props for the ReportTitleInput component.
 * @interface ReportTitleInputProps
 */
interface ReportTitleInputProps {
  /** Current input value */
  title: string;
  /** Callback fired when the value changes */
  onChange: (value: string) => void;
  /** Label text displayed above the input. Defaults to 'Título do Relatório' */
  label?: string;
  /** Optional tooltip text for additional context */
  tooltipText?: string;
  /** Placeholder text shown when empty */
  placeholder?: string;
}

/**
 * ReportTitleInput - A single-line text input with label and tooltip support.
 * 
 * @description Provides a styled text input field with consistent formatting,
 * including a label, optional tooltip icon, and placeholder support. Despite
 * the name, this component is generic and can be used for any single-line
 * text input (titles, names, short descriptions, etc.).
 * 
 * @example
 * ```tsx
 * <ReportTitleInput
 *   title={reportTitle}
 *   onChange={setReportTitle}
 *   label="Report Title"
 *   tooltipText="The title shown at the top of the report"
 *   placeholder="Enter title..."
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered ReportTitleInput component
 */
const ReportTitleInput: React.FC<ReportTitleInputProps> = ({ 
  title, 
  onChange, 
  label = "Título do Relatório",
  tooltipText,
  placeholder = "Digite o título do relatório"
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="text-gray-400 font-medium mb-1 text-sm block">
          {label}
        </label>
        {tooltipText && <Tooltip content={tooltipText} />}
      </div>
      
      <input
        type="text"
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-50 text-base font-semibold placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        placeholder={placeholder}
      />
    </div>
  );
};

export default ReportTitleInput;
