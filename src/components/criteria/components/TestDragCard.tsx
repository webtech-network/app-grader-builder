/**
 * @fileoverview Draggable test card for the test library list.
 * @module components/criteria/components/TestDragCard
 */

import React, { DragEvent } from 'react';
import { TestTemplate } from '../utils';

/**
 * Props for the TestDragCard component.
 * @interface TestDragCardProps
 */
interface TestDragCardProps {
    /** Test template data to display */
    test: TestTemplate;
    /** Callback when drag starts */
    onDragStart: (e: DragEvent<HTMLDivElement>, test: TestTemplate) => void;
}

/**
 * TestDragCard - Draggable card displaying a test from the library.
 * 
 * @description Shows test name, description, and required file.
 * Can be dragged to the configuration area.
 * 
 * @example
 * ```tsx
 * <TestDragCard
 *   test={testTemplate}
 *   onDragStart={(e, test) => handleDrag(e, test)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered TestDragCard component
 */
const TestDragCard: React.FC<TestDragCardProps> = ({ test, onDragStart }) => {
    const displayName = test.displayName || test.name.replace(/_/g, ' ').toUpperCase();
    
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, test)}
            className="cursor-grab p-3 bg-gray-700 rounded-lg shadow-sm hover:bg-gray-600 transition duration-150 border border-gray-600"
        >
            <p className="font-semibold text-sm text-indigo-300">{displayName}</p>
            <p className="text-xs text-gray-400 mt-1">{test.description}</p>
            <p className="text-xs text-yellow-300 mt-1 font-mono">
                Arquivo: {test.required_file || 'Project Structure'}
            </p>
        </div>
    );
};

export default TestDragCard;
