import React from 'react';
import { Code, ListTree } from 'lucide-react';

const NodeTypeSelector = ({ nodeTypeToCreate, onSelectType, onOpenLibrary }) => {
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
