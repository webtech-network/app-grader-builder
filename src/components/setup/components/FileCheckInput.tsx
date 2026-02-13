/**
 * @fileoverview Input field for adding file checks.
 * @module components/setup/components/FileCheckInput
 */

import React, { KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';

/**
 * Props for the FileCheckInput component.
 * @interface FileCheckInputProps
 */
interface FileCheckInputProps {
    /** Current input value */
    value: string;
    /** Callback when value changes */
    onChange: (value: string) => void;
    /** Callback when add button is clicked */
    onAdd: () => void;
}

/**
 * FileCheckInput - Input field with add button for file requirements.
 * 
 * @description Text input with Enter key support and add button for
 * adding new file requirements to the list.
 * 
 * @example
 * ```tsx
 * <FileCheckInput
 *   value={inputValue}
 *   onChange={(val) => setValue(val)}
 *   onAdd={handleAddFile}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered FileCheckInput component
 */
const FileCheckInput: React.FC<FileCheckInputProps> = ({ value, onChange, onAdd }) => {
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            onAdd();
        }
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ex: main.py, requirements.txt"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
                onClick={onAdd}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Adicionar
            </button>
        </div>
    );
};

export default FileCheckInput;
