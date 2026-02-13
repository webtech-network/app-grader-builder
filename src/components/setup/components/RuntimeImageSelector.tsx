/**
 * @fileoverview Runtime image selection with presets and custom input.
 * @module components/setup/components/RuntimeImageSelector
 */

import React from 'react';
import RuntimePresetCard, { RuntimePreset } from './RuntimePresetCard';
import CustomImageInput from './CustomImageInput';

/**
 * Props for the RuntimeImageSelector component.
 * @interface RuntimeImageSelectorProps
 */
interface RuntimeImageSelectorProps {
    /** Current selected runtime image */
    selectedImage: string;
    /** Available runtime presets */
    presets: Record<string, RuntimePreset>;
    /** Whether this field is required */
    isRequired: boolean;
    /** Callback when runtime image changes */
    onImageChange: (imageKey: string) => void;
}

/**
 * RuntimeImageSelector - Complete runtime image selection interface.
 * 
 * @description Displays all available runtime presets as selectable cards
 * plus a custom image input option. Handles preset and custom image selection.
 * 
 * @example
 * ```tsx
 * <RuntimeImageSelector
 *   selectedImage="python:3.11-slim"
 *   presets={runtimePresets}
 *   isRequired={true}
 *   onImageChange={(img) => setImage(img)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered RuntimeImageSelector component
 */
const RuntimeImageSelector: React.FC<RuntimeImageSelectorProps> = ({
    selectedImage,
    presets,
    isRequired,
    onImageChange
}) => {
    const isCustomImage = !Object.keys(presets).includes(selectedImage);

    const handleCustomSelect = (): void => {
        if (!Object.keys(presets).includes(selectedImage)) {
            // Already custom, do nothing
        } else {
            onImageChange('');
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagem de Runtime {isRequired && <span className="text-red-400">*</span>}
            </label>
            <p className="text-xs text-gray-500 mb-3">
                Selecione um runtime pré-configurado ou insira uma imagem Docker personalizada
            </p>
            
            {/* Preset Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {Object.entries(presets).map(([key, preset]) => (
                    <RuntimePresetCard
                        key={key}
                        imageKey={key}
                        preset={preset}
                        isSelected={selectedImage === key}
                        onSelect={onImageChange}
                    />
                ))}
            </div>

            {/* Custom Image Input */}
            <CustomImageInput
                value={selectedImage}
                isSelected={isCustomImage}
                onSelect={handleCustomSelect}
                onChange={onImageChange}
            />
        </div>
    );
};

export default RuntimeImageSelector;
