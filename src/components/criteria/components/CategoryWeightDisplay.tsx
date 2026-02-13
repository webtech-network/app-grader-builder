/**
 * @fileoverview Weight display/editor for category nodes (Base, Bonus, Penalty).
 * @module components/criteria/components/CategoryWeightDisplay
 */

import React, { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';

/**
 * Props for the CategoryWeightDisplay component.
 * @interface CategoryWeightDisplayProps
 */
interface CategoryWeightDisplayProps {
    /** Category ID (base, bonus, or penalty) */
    categoryId: string;
    /** Current weight value */
    weight: number;
    /** Whether the input is visible */
    isEditing: boolean;
    /** Callback for toggling edit mode */
    onToggle: () => void;
    /** Callback for weight changes */
    onWeightChange: (value: string) => void;
    /** Callback when editing ends */
    onBlur: () => void;
}

/**
 * CategoryWeightDisplay - Shows/edits weight for category nodes with special styling.
 * 
 * @description Displays weight with appropriate color for each category type:
 * - Base: Always 100, shown on hover in green
 * - Bonus: Editable, shown on hover in indigo
 * - Penalty: Editable, shown on hover in red
 * 
 * @example
 * ```tsx
 * <CategoryWeightDisplay
 *   categoryId="bonus"
 *   weight={20}
 *   isEditing={false}
 *   onToggle={() => setEditing(true)}
 *   onWeightChange={(v) => updateWeight(v)}
 *   onBlur={() => setEditing(false)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered CategoryWeightDisplay component
 */
const CategoryWeightDisplay: React.FC<CategoryWeightDisplayProps> = ({
    categoryId,
    weight,
    isEditing,
    onToggle,
    onWeightChange,
    onBlur
}) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        onWeightChange(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            onBlur();
        }
    };

    const handleClick = (e: MouseEvent<HTMLInputElement>): void => {
        e.stopPropagation();
    };

    // Base is always 100 and not editable
    if (categoryId === 'base') {
        return (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-green-400">
                100
            </span>
        );
    }

    // Bonus and Penalty are editable
    const colorClass = categoryId === 'bonus' ? 'text-indigo-400' : 'text-red-400';

    if (isEditing) {
        return (
            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                dir="ltr"
                value={weight === 0 ? '' : weight}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={onBlur}
                onClick={handleClick}
                className="w-12 p-1 text-xs bg-gray-600 border border-gray-500 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-150 text-right"
                title={`Pontuação Máxima (${categoryId.toUpperCase()})`}
                autoFocus
            />
        );
    }

    return (
        <span className={`opacity-0 group-hover:opacity-100 transition-opacity ${colorClass}`}>
            {weight || 0}
        </span>
    );
};

export default CategoryWeightDisplay;
