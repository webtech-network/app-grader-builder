import React from 'react';
import NodeTypeSelector from './NodeTypeSelector';

const NodeCreationModal = ({
    modalTitle,
    showTypeSelector,
    nodeTypeToCreate,
    newNodeName,
    onNodeTypeChange,
    onNodeNameChange,
    onSubmit,
    onCancel,
    onOpenLibrary
}) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
            <form onSubmit={onSubmit} className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-sm border border-indigo-600 animate-in fade-in zoom-in duration-300">
                <h3 className="xl font-bold mb-4 text-indigo-400">{modalTitle}</h3>
                
                {showTypeSelector && (
                    <NodeTypeSelector 
                        nodeTypeToCreate={nodeTypeToCreate}
                        onSelectType={onNodeTypeChange}
                        onOpenLibrary={onOpenLibrary}
                    />
                )}

                <input
                    type="text"
                    value={newNodeName}
                    onChange={(e) => onNodeNameChange(e.target.value)}
                    placeholder={`Nome do ${modalTitle === "Novo Tema" ? 'Tema' : nodeTypeToCreate === 'Subject' ? 'Sujeito' : 'Teste'}`}
                    className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition duration-150"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150"
                    >
                        {nodeTypeToCreate === 'Test' ? 'Abrir Biblioteca' : 'Criar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NodeCreationModal;
