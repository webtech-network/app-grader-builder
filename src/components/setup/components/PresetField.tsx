/**
 * @fileoverview Input field with preset indicator badge.
 * @module components/setup/components/PresetField
 */

import React, { ChangeEvent } from 'react';

/**
 * Props for the PresetField component.
 * @interface PresetFieldProps
 */
interface PresetFieldProps {
    /** Input label text */
    label: string;
    /** Input value */
    value: string;
    /** Whether this field is from a preset (shows badge) */
    isFromPreset: boolean;
    /** Whether this field is required */
    isRequired: boolean;
    /** Input type (text or number) */
    type?: 'text' | 'number';
    /** Placeholder text */
    placeholder?: string;
    /** Callback when value changes */
    onChange: (value: string) => void;
}

/**
 * PresetField - Input field with preset configuration indicator.
 * 
 * @description Text or number input that shows a badge when the value
 * comes from a preset configuration. Used for port and start command.
 * 
 * @example
 * ```tsx
 * <PresetField
 *   label="Porta do Container"
 *   value="8000"
 *   isFromPreset={true}
 *   isRequired={true}
 *   type="number"
 *   onChange={(val) => setPort(val)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered PresetField component
 */
const PresetField: React.FC<PresetFieldProps> = ({
    label,
    value,
    isFromPreset,
    isRequired,
    type = 'text',
    placeholder,
    onChange
}) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        onChange(e.target.value);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label} {isRequired && <span className="text-red-400">*</span>}
            </label>
            {isFromPreset ? (
                <div className="relative">
                    <input
                        type={type}
                        value={value}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                        Configuração do preset
                    </span>
                </div>
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            )}
        </div>
    );
};

export default PresetField;
