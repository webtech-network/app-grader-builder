/**
 * @fileoverview Scrollable list of available tests grouped by type.
 * @module components/criteria/components/TestLibraryList
 */

import React, { DragEvent } from 'react';
import { TestTemplate } from '../utils';
import TestDragCard from './TestDragCard';

/**
 * Props for the TestLibraryList component.
 * @interface TestLibraryListProps
 */
interface TestLibraryListProps {
    /** Tests grouped by type/category */
    groupedTests: Record<string, TestTemplate[]>;
    /** Callback when drag starts on a test card */
    onDragStart: (e: DragEvent<HTMLDivElement>, test: TestTemplate) => void;
}

/**
 * TestLibraryList - Displays categorized list of draggable tests.
 * 
 * @description Renders the left panel of the test library modal with
 * tests organized by type (HTML, CSS, JavaScript, etc.). Each test
 * is a draggable card that can be dropped into the configuration area.
 * 
 * @example
 * ```tsx
 * <TestLibraryList
 *   groupedTests={{ HTML: [...], CSS: [...] }}
 *   onDragStart={(e, test) => handleDrag(e, test)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered TestLibraryList component
 */
const TestLibraryList: React.FC<TestLibraryListProps> = ({ groupedTests, onDragStart }) => {
    return (
        <div className="w-1/2 p-3 overflow-y-auto border-r border-gray-700 space-y-4">
            {Object.entries(groupedTests).map(([type, tests]) => (
                <div key={type}>
                    <h4 className="text-sm font-semibold text-gray-300 uppercase mb-2 border-b border-gray-700 pb-1">
                        {type}
                    </h4>
                    <div className="space-y-2">
                        {tests.map((test: TestTemplate) => (
                            <TestDragCard
                                key={test.name}
                                test={test}
                                onDragStart={onDragStart}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TestLibraryList;
