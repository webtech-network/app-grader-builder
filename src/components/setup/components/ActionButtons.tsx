/**
 * @fileoverview Action buttons for save and cancel operations.
 * @module components/setup/components/ActionButtons
 */

import React from 'react';
import { Save, X } from 'lucide-react';

/**
 * Props for the ActionButtons component.
 * @interface ActionButtonsProps
 */
interface ActionButtonsProps {
    /** Callback when save button is clicked */
    onSave: () => void;
    /** Callback when cancel button is clicked */
    onCancel: () => void;
}

/**
 * ActionButtons - Save and Cancel buttons for the setup form.
 * 
 * @description Displays save and cancel buttons with icons in a
 * horizontal layout with border separator.
 * 
 * @example
 * ```tsx
 * <ActionButtons onSave={handleSave} onCancel={handleCancel} />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered ActionButtons component
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onCancel }) => {
    return (
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
            <button
                onClick={onSave}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <Save className="w-5 h-5" />
                Salvar Configuração
            </button>
            <button
                onClick={onCancel}
                className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
                <X className="w-5 h-5" />
                Cancelar
            </button>
        </div>
    );
};

export default ActionButtons;
