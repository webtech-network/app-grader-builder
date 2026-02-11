/**
 * @fileoverview Header component for the criteria builder.
 * @module components/criteria/components/CriteriaHeader
 */

import React from 'react';

/**
 * Props for the CriteriaHeader component.
 * @interface CriteriaHeaderProps
 */
interface CriteriaHeaderProps {
  /** Main title text. Defaults to 'Assignment Structure' */
  title?: string;
  /** Highlighted portion of the title */
  highlightedTitle?: string;
  /** Subtitle/description text */
  subtitle?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CriteriaHeader - Header component for the criteria builder page.
 * 
 * @description Displays a centered header with optional highlighted text
 * and subtitle. Includes a bottom border for visual separation.
 * 
 * @example
 * ```tsx
 * <CriteriaHeader
 *   highlightedTitle="Assignment"
 *   title="Structure"
 *   subtitle="Define the themes and weight of each section."
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered CriteriaHeader component
 */
const CriteriaHeader: React.FC<CriteriaHeaderProps> = ({
  title = 'Structure',
  highlightedTitle = 'Assignment',
  subtitle = 'Defina os temas e o peso de cada seção.',
  className = ''
}) => {
  return (
    <header className={`text-center mb-12 border-b border-indigo-700/50 pb-4 ${className}`}>
      <h1 className="text-4xl font-extrabold text-white">
        {highlightedTitle && (
          <span className="text-indigo-400">{highlightedTitle} </span>
        )}
        {title}
      </h1>
      {subtitle && <p className="text-gray-400 mt-2">{subtitle}</p>}
    </header>
  );
};

export default CriteriaHeader;
