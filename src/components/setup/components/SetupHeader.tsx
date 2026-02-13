/**
 * @fileoverview Header component with required configuration alert.
 * @module components/setup/components/SetupHeader
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Props for the SetupHeader component.
 * @interface SetupHeaderProps
 */
interface SetupHeaderProps {
    /** Whether setup is required for this template */
    isRequired: boolean;
}

/**
 * SetupHeader - Alert banner for required setup configurations.
 * 
 * @description Displays a warning banner for API and IO templates that
 * require mandatory setup configuration. Hidden for optional templates.
 * 
 * @example
 * ```tsx
 * <SetupHeader isRequired={true} />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered SetupHeader component or null
 */
const SetupHeader: React.FC<SetupHeaderProps> = ({ isRequired }) => {
    if (!isRequired) return null;

    return (
        <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
                <h3 className="text-yellow-500 font-semibold mb-1">Configuração Obrigatória</h3>
                <p className="text-yellow-200 text-sm">
                    Este modelo requer configuração de setup. Por favor, configure o ambiente sandbox e as verificações de arquivos.
                </p>
            </div>
        </div>
    );
};

export default SetupHeader;
