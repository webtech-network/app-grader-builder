/**
 * @fileoverview Individual command item display with delete button.
 * @module components/setup/components/CommandItem
 */

import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Props for the CommandItem component.
 * @interface CommandItemProps
 */
interface CommandItemProps {
    /** Command key/name */
    commandKey: string;
    /** Command value/script */
    commandValue: string;
    /** Whether this command came from a preset */
    isPresetCommand: boolean;
    /** Callback when delete button is clicked */
    onDelete: () => void;
}

/**
 * CommandItem - Display a single command with key, value, and delete button.
 * 
 * @description Shows a command key-value pair in a card with optional
 * "Auto-adicionado" badge for preset commands and a delete button.
 * 
 * @example
 * ```tsx
 * <CommandItem
 *   commandKey="install_dependencies"
 *   commandValue="pip install -r requirements.txt"
 *   isPresetCommand={true}
 *   onDelete={() => removeCommand('install_dependencies')}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered CommandItem component
 */
const CommandItem: React.FC<CommandItemProps> = ({
    commandKey,
    commandValue,
    isPresetCommand,
    onDelete
}) => {
    return (
        <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <label className="text-indigo-400 font-medium text-sm">{commandKey}</label>
                    {isPresetCommand && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                            Auto-adicionado
                        </span>
                    )}
                </div>
                <button
                    onClick={onDelete}
                    className="text-red-400 hover:text-red-300 p-1 hover:bg-red-900/20 rounded transition-colors"
                    title="Remover comando"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <div className="text-gray-100 font-mono text-sm bg-gray-800 p-2 rounded border border-gray-600">
                {commandValue}
            </div>
        </div>
    );
};

export default CommandItem;
