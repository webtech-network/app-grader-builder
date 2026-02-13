/**
 * @fileoverview Complete sandbox configuration section.
 * @module components/setup/components/SandboxConfigSection
 */

import React, { ChangeEvent } from 'react';
import { X } from 'lucide-react';
import SectionTitle from './SectionTitle';
import SandboxCollapsedState from './SandboxCollapsedState';
import RuntimeImageSelector from './RuntimeImageSelector';
import PresetField from './PresetField';
import CommandsList from './CommandsList';
import { RuntimePreset } from './RuntimePresetCard';

/**
 * Sandbox configuration data structure.
 * @interface SandboxConfig
 */
export interface SandboxConfig {
    /** Docker runtime image */
    runtime_image: string;
    /** Container port */
    container_port: string;
    /** Start command */
    start_command: string;
    /** Setup commands map */
    commands: Record<string, string>;
}

/**
 * Props for the SandboxConfigSection component.
 * @interface SandboxConfigSectionProps
 */
interface SandboxConfigSectionProps {
    /** Current sandbox configuration */
    config: SandboxConfig;
    /** Whether this section is required */
    isRequired: boolean;
    /** Whether sandbox is expanded/visible */
    isExpanded: boolean;
    /** Available runtime presets */
    presets: Record<string, RuntimePreset>;
    /** Command key input value */
    commandKeyInput: string;
    /** Command value input value */
    commandValueInput: string;
    /** Callback to expand sandbox section */
    onExpand: () => void;
    /** Callback to collapse sandbox section */
    onCollapse: () => void;
    /** Callback when runtime image changes */
    onRuntimeChange: (image: string) => void;
    /** Callback when configuration changes */
    onConfigChange: (config: Partial<SandboxConfig>) => void;
    /** Callback when command key input changes */
    onCommandKeyChange: (e: ChangeEvent<HTMLInputElement>) => void;
    /** Callback when command value input changes */
    onCommandValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
    /** Callback to add command */
    onAddCommand: () => void;
    /** Callback to remove command */
    onRemoveCommand: (key: string) => void;
}

/**
 * SandboxConfigSection - Complete sandbox configuration section.
 * 
 * @description Displays the full sandbox configuration interface including
 * runtime selection, port, start command, and setup commands. Shows
 * collapsed state for optional templates.
 * 
 * @example
 * ```tsx
 * <SandboxConfigSection
 *   config={sandboxConfig}
 *   isRequired={true}
 *   isExpanded={true}
 *   presets={runtimePresets}
 *   commandKeyInput=""
 *   commandValueInput=""
 *   onExpand={() => setExpanded(true)}
 *   onCollapse={() => setExpanded(false)}
 *   onRuntimeChange={handleRuntimeChange}
 *   onConfigChange={(cfg) => setConfig(cfg)}
 *   onCommandKeyChange={setKeyInput}
 *   onCommandValueChange={setValueInput}
 *   onAddCommand={addCommand}
 *   onRemoveCommand={removeCommand}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered SandboxConfigSection component
 */
const SandboxConfigSection: React.FC<SandboxConfigSectionProps> = ({
    config,
    isRequired,
    isExpanded,
    presets,
    commandKeyInput,
    commandValueInput,
    onExpand,
    onCollapse,
    onRuntimeChange,
    onConfigChange,
    onCommandKeyChange,
    onCommandValueChange,
    onAddCommand,
    onRemoveCommand
}) => {
    const isPresetImage = Object.keys(presets).includes(config.runtime_image);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <SectionTitle 
                    icon="🐳" 
                    title="Configuração de Sandbox" 
                    optional={!isRequired}
                />
            </div>

            {/* Collapsed State */}
            {!isRequired && !isExpanded && (
                <SandboxCollapsedState onConfigure={onExpand} />
            )}

            {/* Expanded Configuration */}
            {(isRequired || isExpanded) && (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-400 text-sm">
                            Configure o ambiente Docker para executar e testar o código do aluno
                        </p>
                        {!isRequired && (
                            <button
                                type="button"
                                onClick={onCollapse}
                                className="text-gray-400 hover:text-gray-200 text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                            >
                                <X className="w-3 h-3" />
                                Ocultar
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Runtime Image */}
                        <RuntimeImageSelector
                            selectedImage={config.runtime_image}
                            presets={presets}
                            isRequired={isRequired}
                            onImageChange={onRuntimeChange}
                        />

                        {/* Container Port */}
                        <PresetField
                            label="Porta do Container"
                            value={config.container_port}
                            isFromPreset={isPresetImage}
                            isRequired={isRequired}
                            type="number"
                            placeholder="ex: 8000, 5000, 3000"
                            onChange={(value) => onConfigChange({ container_port: value })}
                        />

                        {/* Start Command */}
                        <PresetField
                            label="Comando de Inicialização"
                            value={config.start_command}
                            isFromPreset={isPresetImage}
                            isRequired={isRequired}
                            placeholder="ex: python app.py, npm start"
                            onChange={(value) => onConfigChange({ start_command: value })}
                        />

                        {/* Setup Commands */}
                        <CommandsList
                            commands={config.commands || {}}
                            selectedImage={config.runtime_image}
                            presets={presets}
                            keyInputValue={commandKeyInput}
                            valueInputValue={commandValueInput}
                            onKeyInputChange={onCommandKeyChange}
                            onValueInputChange={onCommandValueChange}
                            onAdd={onAddCommand}
                            onRemove={onRemoveCommand}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default SandboxConfigSection;
