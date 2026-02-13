/**
 * @fileoverview List of setup commands with add input.
 * @module components/setup/components/CommandsList
 */

import React, { ChangeEvent } from 'react';
import CommandItem from './CommandItem';
import CommandInput from './CommandInput';
import { RuntimePreset } from './RuntimePresetCard';

/**
 * Props for the CommandsList component.
 * @interface CommandsListProps
 */
interface CommandsListProps {
    /** Command key-value map */
    commands: Record<string, string>;
    /** Current selected runtime image */
    selectedImage: string;
    /** Available runtime presets */
    presets: Record<string, RuntimePreset>;
    /** Input value for new command key */
    keyInputValue: string;
    /** Input value for new command value */
    valueInputValue: string;
    /** Callback when key input changes */
    onKeyInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    /** Callback when value input changes */
    onValueInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    /** Callback to add new command */
    onAdd: () => void;
    /** Callback to remove command by key */
    onRemove: (key: string) => void;
}

/**
 * CommandsList - Complete command management section.
 * 
 * @description Displays list of existing commands with preset indicators
 * and provides input form for adding new commands.
 * 
 * @example
 * ```tsx
 * <CommandsList
 *   commands={{ install_dependencies: 'pip install -r requirements.txt' }}
 *   selectedImage="python:3.11-slim"
 *   presets={runtimePresets}
 *   keyInputValue=""
 *   valueInputValue=""
 *   onKeyInputChange={setKey}
 *   onValueInputChange={setValue}
 *   onAdd={addCommand}
 *   onRemove={removeCommand}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered CommandsList component
 */
const CommandsList: React.FC<CommandsListProps> = ({
    commands,
    selectedImage,
    presets,
    keyInputValue,
    valueInputValue,
    onKeyInputChange,
    onValueInputChange,
    onAdd,
    onRemove
}) => {
    // Determine which commands came from presets
    const currentPreset = presets[selectedImage];
    
    const isPresetCommand = (key: string, value: string): boolean => {
        return currentPreset?.defaultCommands?.[key] === value;
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Comandos de Configuração (Opcional)
            </label>
            <p className="text-gray-500 text-xs mb-3">
                Comandos a executar antes de iniciar a aplicação (ex: instalar dependências)
            </p>

            {/* Command List */}
            {Object.entries(commands || {}).length > 0 && (
                <div className="mb-3 space-y-2">
                    {Object.entries(commands).map(([key, value]) => (
                        <CommandItem
                            key={key}
                            commandKey={key}
                            commandValue={value}
                            isPresetCommand={isPresetCommand(key, value)}
                            onDelete={() => onRemove(key)}
                        />
                    ))}
                </div>
            )}

            {/* Add Command Input */}
            <CommandInput
                keyValue={keyInputValue}
                commandValue={valueInputValue}
                onKeyChange={onKeyInputChange}
                onValueChange={onValueInputChange}
                onAdd={onAdd}
            />
        </div>
    );
};

export default CommandsList;
