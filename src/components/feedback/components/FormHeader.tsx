/**
 * @fileoverview Page header component for form pages.
 * @module components/feedback/components/FormHeader
 */

import React from 'react';

/**
 * Props for the FormHeader component.
 * @interface FormHeaderProps
 */
interface FormHeaderProps {
  /** Main title text displayed prominently */
  title: string;
  /** Optional subtitle displayed below the title */
  subtitle?: string;
}

/**
 * FormHeader - Displays a centered page header with title and optional subtitle.
 * 
 * @description A simple, reusable header component that provides consistent
 * styling for form page titles. Includes a bottom border for visual separation.
 * 
 * @example
 * ```tsx
 * <FormHeader
 *   title="Feedback Configuration"
 *   subtitle="Configure how feedback is displayed to students"
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered FormHeader component
 */
const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="text-center mb-10 p-4 border-b border-gray-700/50">
      <h1 className="text-4xl font-extrabold text-white">{title}</h1>
      {subtitle && (
        <p className="text-gray-400 mt-2">{subtitle}</p>
      )}
    </header>
  );
};

export default FormHeader;
