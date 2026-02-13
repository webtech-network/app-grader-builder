/**
 * @fileoverview Collapsed state for optional sandbox configuration.
 * @module components/setup/components/SandboxCollapsedState
 */

import React from 'react';
import { Plus } from 'lucide-react';

/**
 * Props for the SandboxCollapsedState component.
 * @interface SandboxCollapsedStateProps
 */
interface SandboxCollapsedStateProps {
    /** Callback when configure button is clicked */
    onConfigure: () => void;
}

/**
 * SandboxCollapsedState - Collapsed view for optional sandbox configuration.
 * 
 * @description Shows an informational card with a configure button for
 * templates where sandbox is optional. Displayed when sandbox is not active.
 * 
 * @example
 * ```tsx
 * <SandboxCollapsedState onConfigure={() => setExpanded(true)} />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered SandboxCollapsedState component
 */
const SandboxCollapsedState: React.FC<SandboxCollapsedStateProps> = ({ onConfigure }) => {
    return (
        <div className="bg-gray-700 rounded-lg border border-gray-600 p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">ℹ️</span>
                    </div>
                    <div>
                        <p className="text-gray-200 text-sm font-medium mb-1">
                            Configuração de Sandbox Não Obrigatória
                        </p>
                        <p className="text-gray-400 text-xs">
                            Este modelo não precisa de um ambiente Docker, mas você pode configurar um se necessário
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onConfigure}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium flex-shrink-0 ml-4"
                >
                    <Plus className="w-4 h-4" />
                    Configurar
                </button>
            </div>
        </div>
    );
};

export default SandboxCollapsedState;
