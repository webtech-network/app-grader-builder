/**
 * @fileoverview Drop zone for dragging tests into configuration.
 * @module components/criteria/components/TestDropZone
 */

import React, { DragEvent } from 'react';
import { Settings } from 'lucide-react';

/**
 * Props for the TestDropZone component.
 * @interface TestDropZoneProps
 */
interface TestDropZoneProps {
    /** Whether a drag operation is currently over the zone */
    isDropping: boolean;
    /** Initial/target name for the test node */
    targetName: string;
    /** Callback when drag enters the zone */
    onDragEnter: () => void;
    /** Callback when drag leaves the zone */
    onDragLeave: () => void;
    /** Callback when an item is dropped */
    onDrop: (e: DragEvent<HTMLDivElement>) => void;
    /** Callback to prevent default drag over behavior */
    onDragOver: (e: DragEvent<HTMLDivElement>) => void;
}

/**
 * TestDropZone - Visual drop target for test selection.
 * 
 * @description Displays an empty state prompting the user to drag
 * a test from the library list. Provides visual feedback during drag operations.
 * 
 * @example
 * ```tsx
 * <TestDropZone
 *   isDropping={isDragging}
 *   targetName="My Test"
 *   onDragEnter={() => setDragging(true)}
 *   onDragLeave={() => setDragging(false)}
 *   onDrop={handleDrop}
 *   onDragOver={handleDragOver}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered TestDropZone component
 */
const TestDropZone: React.FC<TestDropZoneProps> = ({
    isDropping,
    targetName,
    onDragEnter,
    onDragLeave,
    onDrop,
    onDragOver
}) => {
    const displayName = targetName.trim() || '(Sem Nome)';
    
    return (
        <div 
            className={`w-1/2 p-6 flex flex-col items-center justify-center text-center transition duration-300 border-2 border-dashed rounded-lg ml-4 ${
                isDropping ? 'drag-over border-indigo-500 bg-indigo-900/20' : 'border-gray-600 bg-gray-700'
            }`}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <Settings className="w-10 h-10 text-gray-400 mb-4" />
            <p className="text-lg text-gray-300 font-semibold">Arraste um Teste para cá</p>
            <p className="text-sm text-gray-400 mt-2">
                Solte o item para configurar os parâmetros e adicionar o nó <strong>{displayName}</strong>.
            </p>
        </div>
    );
};

export default TestDropZone;
