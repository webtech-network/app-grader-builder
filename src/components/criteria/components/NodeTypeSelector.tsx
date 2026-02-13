/**
 * @fileoverview Button group for selecting node type (Subject vs Test).
 * @module components/criteria/components/NodeTypeSelector
 */

import React from 'react';
import { Code, ListTree } from 'lucide-react';

/**
 * Defines the type of node to create.
 */
type NodeType = 'Subject' | 'Test';

/**
 * Props for the NodeTypeSelector component.
 * @interface NodeTypeSelectorProps
 */
interface NodeTypeSelectorProps {
    /** Currently selected node type */
    nodeTypeToCreate: NodeType;
    /** Callback fired when a type is selected */
    onSelectType: (type: NodeType) => void;
    /** Callback to open the test library (for Test type) */
    onOpenLibrary: () => void;
}

/**
 * NodeTypeSelector - Toggle button group for choosing node type.
 * 
 * @description Displays two buttons (Subject and Test) for selecting the type
 * of node to create. When Test is selected, automatically opens the library.
 * 
 * @example
 * ```tsx
 * <NodeTypeSelector
 *   nodeTypeToCreate="Subject"
 *   onSelectType={(type) => setNodeType(type)}
 *   onOpenLibrary={() => setLibraryOpen(true)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered NodeTypeSelector component
 */
const NodeTypeSelector: React.FC<NodeTypeSelectorProps> = ({ nodeTypeToCreate, onSelectType, onOpenLibrary }) => {
    return (
        <div className="mb-6 flex space-x-4">
            {/* Botão SUJEITO */}
            <button
                type="button"
                onClick={() => onSelectType('Subject')}
                className={`flex-1 flex items-center justify-center p-3 rounded-lg border transition duration-150 ${
                    nodeTypeToCreate === 'Subject'
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                        : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                }`}
                title="Nó de Agrupamento que pode conter Testes ou outros Sujeitos."
            >
                <ListTree className="w-5 h-5 mr-2" />
                <span className="font-semibold text-sm">Tema</span>
            </button>

            {/* Botão TESTE */}
            <button
                type="button"
                onClick={() => {
                    onSelectType('Test');
                    onOpenLibrary();
                }}
                className={`flex-1 flex items-center justify-center p-3 rounded-lg border transition duration-150 ${
                    nodeTypeToCreate === 'Test'
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                        : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                }`}
                title="Nó Folha que contém a lógica de avaliação (não pode ter filhos)."
            >
                <Code className="w-5 h-5 mr-2" />
                <span className="font-semibold text-sm">Teste</span>
            </button>
        </div>
    );
};

export default NodeTypeSelector;
