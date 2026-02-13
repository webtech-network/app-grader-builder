/**
 * @fileoverview Progress bar component for visualizing weight distributions.
 * @module components/criteria/components/ProgressBar
 */

import React from 'react';

/**
 * Props for the ProgressBar component.
 * @interface ProgressBarProps
 */
interface ProgressBarProps {
  /** Current total weight value (0-100+) */
  currentWeight: number;
  /** Target weight value. Defaults to 100 */
  targetWeight?: number;
  /** Whether to show the weight label. Defaults to true */
  showLabel?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * ProgressBar - Visual indicator of weight distribution completion.
 * 
 * @description Displays a colored progress bar based on weight value.
 * Changes color based on completion state:
 * - Green: Exactly at target (within 0.1)
 * - Red: Over target
 * - Indigo: Under target
 * 
 * @example
 * ```tsx
 * <ProgressBar
 *   currentWeight={85.5}
 *   targetWeight={100}
 *   showLabel={true}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered ProgressBar component
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  currentWeight,
  targetWeight = 100,
  showLabel = true,
  className = ''
}) => {
  const isOver = currentWeight > targetWeight + 0.1;
  const isExact = currentWeight >= targetWeight - 0.1 && currentWeight <= targetWeight + 0.1;
  
  const barColor = isOver ? 'bg-red-500' : (isExact ? 'bg-green-500' : 'bg-indigo-500');
  const barWidth = Math.min((currentWeight / targetWeight) * 100, 100);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300 ease-out`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      {showLabel && (
        <span
          className={`text-xs font-semibold min-w-[4rem] text-right ${
            isOver ? 'text-red-400' : isExact ? 'text-green-400' : 'text-indigo-400'
          }`}
        >
          {currentWeight.toFixed(1)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
