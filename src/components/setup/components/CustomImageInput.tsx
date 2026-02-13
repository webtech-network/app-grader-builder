/**
 * @fileoverview Custom Docker image input field.
 * @module components/setup/components/CustomImageInput
 */

import React from 'react';

/**
 * Props for the CustomImageInput component.
 * @interface CustomImageInputProps
 */
interface CustomImageInputProps {
    /** Current custom image value */
    value: string;
    /** Whether this option is selected */
    isSelected: boolean;
    /** Callback when custom option is selected */
    onSelect: () => void;
    /** Callback when value changes */
    onChange: (value: string) => void;
}

/**
 * CustomImageInput - Input for custom Docker image selection.
 * 
 * @description Provides a button to select custom image mode and an
 * input field that appears when custom mode is active.
 * 
 * @example
 * ```tsx
 * <CustomImageInput
 *   value="nginx:alpine"
 *   isSelected={true}
 *   onSelect={() => selectCustom()}
 *   onChange={(val) => setImage(val)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered CustomImageInput component
 */
const CustomImageInput: React.FC<CustomImageInputProps> = ({
    value,
    isSelected,
    onSelect,
    onChange
}) => {
    return (
        <div className="space-y-2">
            <button
                type="button"
                onClick={onSelect}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected && value !== ''
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🔧</span>
                    <div>
                        <span className="font-medium text-gray-100 text-sm">Custom Image</span>
                        <p className="text-xs text-gray-400">Enter your own Docker image</p>
                    </div>
                </div>
            </button>
            
            {isSelected && (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="e.g., nginx:alpine, php:8.2-fpm"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                />
            )}
        </div>
    );
};

export default CustomImageInput;
