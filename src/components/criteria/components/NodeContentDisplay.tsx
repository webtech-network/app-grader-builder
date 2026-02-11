/**
 * @fileoverview Main content display for tree nodes with names and labels.
 * @module components/criteria/components/NodeContentDisplay
 */

import React from 'react';
import { TestLibrary } from '../utils';

/**
 * Props for the NodeContentDisplay component.
 * @interface NodeContentDisplayProps
 */
interface NodeContentDisplayProps {
    /** Display name or formatted name */
    displayName: string;
    /** Text color class */
    textColor: string;
    /** Whether this is a category node */
    isCategory: boolean;
    /** Category ID if applicable (for styling) */
    categoryId?: string;
    /** Whether clicking toggles weight edit */
    isClickable: boolean;
    /** Callback when clicked */
    onClick?: () => void;
}

/**
 * NodeContentDisplay - Shows the main node name with appropriate styling.
 * 
 * @description Displays the node name with color coding and optional click interaction.
 * Handles special formatting for test nodes with custom + template names.
 * 
 * @example
 * ```tsx
 * <NodeContentDisplay
 *   displayName="My Subject (72.5%)"
 *   textColor="text-gray-200"
 *   isCategory={false}
 *   isClickable={true}
 *   onClick={() => console.log('clicked')}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered NodeContentDisplay component
 */
const NodeContentDisplay: React.FC<NodeContentDisplayProps> = ({
    displayName,
    textColor,
    isCategory,
    categoryId,
    isClickable,
    onClick
}) => {
    return (
        <div 
            className={`font-semibold text-sm ${textColor} whitespace-nowrap flex items-center gap-2 ${
                isClickable ? 'cursor-pointer' : ''
            }`}
            onClick={onClick}
        >
            <span>{displayName}</span>
        </div>
    );
};

export default NodeContentDisplay;
