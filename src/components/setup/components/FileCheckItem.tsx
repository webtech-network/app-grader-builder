/**
 * @fileoverview Individual file check item display.
 * @module components/setup/components/FileCheckItem
 */

import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Props for the FileCheckItem component.
 * @interface FileCheckItemProps
 */
interface FileCheckItemProps {
    /** File name to display */
    fileName: string;
    /** Callback when delete button is clicked */
    onDelete: () => void;
}

/**
 * FileCheckItem - Display a single file requirement with delete button.
 * 
 * @description Shows a file name in monospace font with a delete button.
 * Used in the list of required files.
 * 
 * @example
 * ```tsx
 * <FileCheckItem fileName="main.py" onDelete={() => removeFile(0)} />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered FileCheckItem component
 */
const FileCheckItem: React.FC<FileCheckItemProps> = ({ fileName, onDelete }) => {
    return (
        <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg border border-gray-600">
            <span className="text-gray-100 font-mono">{fileName}</span>
            <button
                onClick={onDelete}
                className="text-red-400 hover:text-red-300 p-1 hover:bg-red-900/20 rounded transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};

export default FileCheckItem;
