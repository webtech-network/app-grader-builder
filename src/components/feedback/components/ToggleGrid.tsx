/**
 * @fileoverview Grid layout component for multiple toggle switches.
 * @module components/feedback/components/ToggleGrid
 */

import React from 'react';
import ToggleSwitch from './ToggleSwitch';

/**
 * Configuration for a single toggle in the grid.
 * @interface ToggleConfig
 */
interface ToggleConfig {
  /** Unique identifier for the toggle */
  id: string;
  /** Display label for the toggle */
  label: string;
  /** Optional tooltip text for additional context */
  tooltipText?: string;
  /** Current checked state */
  isChecked: boolean;
}

/**
 * Props for the ToggleGrid component.
 * @interface ToggleGridProps
 */
interface ToggleGridProps {
  /** Array of toggle configurations to display */
  toggles: ToggleConfig[];
  /** Callback fired when any toggle changes (receives toggle id) */
  onToggle: (id: string) => void;
  /** Number of columns in the grid (responsive). Defaults to 3. */
  columns?: 1 | 2 | 3 | 4;
}

/**
 * ToggleGrid - Displays multiple toggle switches in a responsive grid layout.
 * 
 * @description Renders an array of ToggleSwitch components in a CSS grid with
 * configurable columns. Automatically handles responsive breakpoints for
 * mobile and desktop layouts.
 * 
 * @example
 * ```tsx
 * <ToggleGrid
 *   toggles={[
 *     { id: 'show_score', label: 'Show Score', isChecked: true },
 *     { id: 'show_tests', label: 'Show Tests', isChecked: false }
 *   ]}
 *   onToggle={(id) => handleToggle(id)}
 *   columns={2}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered ToggleGrid component
 */
const ToggleGrid: React.FC<ToggleGridProps> = ({ 
  toggles, 
  onToggle,
  columns = 3 
}) => {
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns];

  return (
    <div className={`grid ${gridColsClass} gap-4 pt-2`}>
      {toggles.map((toggle) => (
        <ToggleSwitch
          key={toggle.id}
          id={toggle.id}
          isChecked={toggle.isChecked}
          onChange={() => onToggle(toggle.id)}
          label={toggle.label}
          tooltipText={toggle.tooltipText}
        />
      ))}
    </div>
  );
};

export default ToggleGrid;
