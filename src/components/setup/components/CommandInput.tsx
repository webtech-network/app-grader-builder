/**
 * @fileoverview Input form for adding new commands.
 * @module components/setup/components/CommandInput
 */

import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';

/**
 * Props for the CommandInput component.
 * @interface CommandInputProps
 */
interface CommandInputProps {
    /** Command key input value */
    keyValue: string;
    /** Command value input value */
    commandValue: string;
    /** Callback when key changes */
    onKeyChange: (e: ChangeEvent<HTMLInputElement>) => void;
    /** Callback when command value changes */
    onValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
    /** Callback to add the command */
    onAdd: () => void;
}

/**
 * CommandInput - Input form for adding setup commands.
 * 
 * @description Two-field form for entering command name and command value
 * with Enter key support and disabled state when fields are empty.
 * 
 * @example
 * ```tsx
 * <CommandInput
 *   keyValue="install_dependencies"
 *   commandValue="npm install"
 *   onKeyChange={setKey}
 *   onValueChange={setValue}
 *   onAdd={handleAdd}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered CommandInput component
 */
const CommandInput: React.FC<CommandInputProps> = ({
    keyValue,
    commandValue,
    onKeyChange,
    onValueChange,
    onAdd
}) => {
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            onAdd();
        }
    };

    const isDisabled = !keyValue.trim() || !commandValue.trim();

    return (
        <div className="bg-gray-750 p-4 rounded-lg border-2 border-gray-600 hover:border-indigo-500/50 transition-colors">
            <div className="space-y-3">
                {/* Command Name */}
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Nome do Comando
                    </label>
                    <input
                        type="text"
                        value={keyValue}
                        onChange={onKeyChange}
                        placeholder="ex: install_dependencies"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                </div>
                
                {/* Command Value */}
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Comando
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={commandValue}
                            onChange={onValueChange}
                            onKeyPress={handleKeyPress}
                            placeholder="ex: pip install -r requirements.txt"
                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
                        />
                        <button
                            onClick={onAdd}
                            disabled={isDisabled}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandInput;
