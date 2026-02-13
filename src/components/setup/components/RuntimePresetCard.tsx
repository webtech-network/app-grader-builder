/**
 * @fileoverview Individual runtime preset selection card.
 * @module components/setup/components/RuntimePresetCard
 */

import React from 'react';

/**
 * Runtime preset configuration.
 * @interface RuntimePreset
 */
export interface RuntimePreset {
    /** Display name of the runtime */
    name: string;
    /** Description of what this runtime is for */
    description: string;
    /** Emoji icon for visual identification */
    icon: string;
    /** Default port number */
    defaultPort: string;
    /** Default command to start the application */
    defaultStartCommand: string;
    /** Default setup commands (e.g., install dependencies) */
    defaultCommands: Record<string, string>;
}

/**
 * Props for the RuntimePresetCard component.
 * @interface RuntimePresetCardProps
 */
interface RuntimePresetCardProps {
    /** Docker image key (e.g., 'python:3.11-slim') */
    imageKey: string;
    /** Preset configuration data */
    preset: RuntimePreset;
    /** Whether this preset is currently selected */
    isSelected: boolean;
    /** Callback when card is clicked */
    onSelect: (imageKey: string) => void;
}

/**
 * RuntimePresetCard - Selectable card for a runtime preset option.
 * 
 * @description Displays a runtime preset with icon, name, description, and
 * Docker image tag. Shows checkmark when selected.
 * 
 * @example
 * ```tsx
 * <RuntimePresetCard
 *   imageKey="python:3.11-slim"
 *   preset={pythonPreset}
 *   isSelected={true}
 *   onSelect={(key) => setImage(key)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered RuntimePresetCard component
 */
const RuntimePresetCard: React.FC<RuntimePresetCardProps> = ({
    imageKey,
    preset,
    isSelected,
    onSelect
}) => {
    return (
        <button
            type="button"
            onClick={() => onSelect(imageKey)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
                isSelected
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
            }`}
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl">{preset.icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-100 text-sm">{preset.name}</span>
                        {isSelected && (
                            <span className="text-indigo-400 text-xs">✓</span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400">{preset.description}</p>
                    <p className="text-xs text-gray-500 font-mono mt-1">{imageKey}</p>
                </div>
            </div>
        </button>
    );
};

export default RuntimePresetCard;
