import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Code, ListTree } from 'lucide-react';
import { toast } from 'react-toastify';
import TreeStyles from './TreeStyles';
import TestLibraryModal from './TestLibraryModal';
import TreeNode from './TreeNode';
import {
    findNodeById,
    findParentOfNode,
    calculateChildWeights,
    addChildNode,
    updateExistingNode,
    removeNode,
    updateNodeWeight,
    transformTreeToBackendFormat
} from './utils';
import {
    validateCriteriaTree,
    validateWeightSum,
    validateTestParameters,
    validateBonusPenaltyContent
} from './validations';

const CriteriaForm = ({ templateName, onSave }) => {
    const initialTreeData = [
        { id: 'base', name: 'Base', children: [], weight: 100 }, 
        { id: 'bonus', name: 'Bonus', children: [], weight: 0 },
        { id: 'penalty', name: 'Penalty', children: [], weight: 0 },
    ];
    
    const [treeData, setTreeData] = useState(initialTreeData);
    const [nodeCount, setNodeCount] = useState(1);
    const [newNodeName, setNewNodeName] = useState('');
    const [selectedParentId, setSelectedParentId] = useState(null);
    const [nodeTypeToCreate, setNodeTypeToCreate] = useState('Subject'); 

    // --- Novos estados para o fluxo de Testes ---
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [editingNode, setEditingNode] = useState(null); // Armazena o nó que está sendo editado (ID)
    const [initialName, setInitialName] = useState(''); // Nome inicial do nó
    
    // --- Estados para carregamento do template ---
    const [testLibrary, setTestLibrary] = useState(null);
    const [loadingTemplate, setLoadingTemplate] = useState(true);
    const [templateError, setTemplateError] = useState(null);
    
    // --- Estados de salvamento ---
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [saveButtonAnimation, setSaveButtonAnimation] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Fetch template data from API
    useEffect(() => {
        const fetchTemplateData = async () => {
            if (!templateName) {
                setTemplateError('No template name provided');
                setLoadingTemplate(false);
                return;
            }

            setLoadingTemplate(true);
            setTemplateError(null);

            try {
                const response = await fetch(`http://localhost:8000/templates/${templateName}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch template: ${response.statusText}`);
                }
                const data = await response.json();
                setTestLibrary(data);
            } catch (error) {
                console.error('Error fetching template:', error);
                setTemplateError(error.message);
            } finally {
                setLoadingTemplate(false);
            }
        };

        fetchTemplateData();
    }, [templateName]);

    // Calcula a soma dos pesos de cada categoria L0 (memoization)
    const categoryWeights = useMemo(() => {
        const sums = {};
        treeData.forEach(category => {
            sums[category.id] = calculateChildWeights(category);
        });
        return sums;
    }, [treeData]);

    // --- LÓGICA DE NÓS (CRUD) ---
    const handleWeightChange = (targetId, newWeight) => {
        setTreeData(prevTree => updateNodeWeight(prevTree, targetId, newWeight));
    };

    const handleAddChild = (parentId) => {
        setSelectedParentId(parentId);
        setNewNodeName('');
        setNodeTypeToCreate('Subject'); 
        setEditingNode(null); // Limpa o estado de edição
        setInitialName(''); // Limpa o nome inicial
    };

    const handleEditTest = (nodeId, nodeName) => {
        const nodeToEdit = findNodeById(treeData, nodeId);
        if (nodeToEdit && nodeToEdit.children === null) { // Confirma que é um Teste (folha)
            setEditingNode(nodeToEdit);
            // Remove o sufixo (Teste) do nome para o input do modal
            setInitialName(nodeName.replace(/\s\(Teste\)\s\(.*\)/, '').trim()); 
            setIsLibraryOpen(true); // Abre o modal de configuração
        }
    };

    const closeAllModals = () => {
        setSelectedParentId(null);
        setIsLibraryOpen(false);
        setEditingNode(null);
        setNewNodeName('');
        setInitialName('');
    };

    // --- HANDLER DE CRIAÇÃO/EDIÇÃO DE TESTE ---
    const handleSaveTest = (testData) => {
        if (editingNode) {
            // Modo Edição: Atualiza o nó existente
            const updatedNodeData = {
                functionName: testData.functionName,
                calls: testData.calls,
                name: testData.name, // Nome customizado
                description: testData.description,
                required_file: testData.required_file,
                weight: editingNode.weight // Mantém o peso
            };
            setTreeData(prevTree => updateExistingNode(prevTree, editingNode.id, updatedNodeData, testLibrary));
        } else {
            // Modo Criação: Cria um novo nó
            const newId = `node-${selectedParentId}-${nodeCount}`; 
            const testTemplate = testLibrary?.tests?.find(t => t.name === testData.functionName);

            const newNode = {
                id: newId,
                name: `${testData.name.trim() || testTemplate?.displayName || testData.functionName} (Teste)`,
                children: null, 
                weight: 0, 
                metadata: { 
                    functionName: testData.functionName,
                    calls: testData.calls,
                    description: testData.description,
                    required_file: testData.required_file
                } 
            };
            setTreeData((prevTree) => addChildNode(prevTree, selectedParentId, newNode));
            setNodeCount((prev) => prev + 1);
        }
        
        closeAllModals();
    }

    const handleSubmitNewNode = (e) => {
        e.preventDefault();
        if (!newNodeName.trim() || !selectedParentId) return;

        // ... Lógica de Validação de Homogeneidade ...
        const parentNode = findNodeById(treeData, selectedParentId);
        if (parentNode && parentNode.children) {
            const isCreatingTest = nodeTypeToCreate === 'Test';
            const isCreatingSubject = nodeTypeToCreate === 'Subject';
            const hasExistingTests = parentNode.children.some(child => child.children === null);
            const hasExistingSubSubjects = parentNode.children.some(child => child.children !== null);
            
            // Check if parent is a category node
            const isCategoryNode = parentNode.id === 'base' || parentNode.id === 'bonus' || parentNode.id === 'penalty';
            
            // If trying to create a subject, check if parent's parent is a category
            // If parent is not a category, find its parent
            if (isCreatingSubject && !isCategoryNode) {
                // Parent is not a category, so it's a Tema or Sub-Tema
                // Find the parent's parent (grandparent)
                const grandParent = findParentOfNode(treeData, selectedParentId);
                const isGrandParentCategory = grandParent && (grandParent.id === 'base' || grandParent.id === 'bonus' || grandParent.id === 'penalty');
                
                // If grandparent is a category, parent is a Tema (level 1), so we can create Sub-Tema (level 2) ✅
                // If grandparent is NOT a category, parent is already a Sub-Tema (level 2), so we CANNOT create Sub-Sub-Tema (level 3) ❌
                if (!isGrandParentCategory) {
                    toast.error("Erro: Não é possível criar Sub-Temas dentro de Sub-Temas. Um Sub-Tema só pode conter Testes.");
                    return;
                }
            }
            
            if (isCreatingTest && hasExistingSubSubjects) {
                toast.error("Erro: Este Tema já contém Sub-Temas aninhados. Os Testes devem ser adicionados dentro do último Sujeito aninhado.");
                return;
            }
            if (isCreatingSubject && hasExistingTests) {
                toast.error("Erro: Este Tema já contém Testes. Um Tema só pode conter ou Testes ou Sub-Temas, mas não ambos.");
                return;
            }
        }

        // --- Lógica de Fluxo ---
        if (nodeTypeToCreate === 'Test') {
            setInitialName(newNodeName); // Captura o nome customizado para o modal
            setIsLibraryOpen(true);
            return; 
        }

        // --- Criação de Sujeito ---
        const isCategoryParent = selectedParentId === 'base' || selectedParentId === 'bonus' || selectedParentId === 'penalty';
        const newId = `node-${selectedParentId}-${nodeCount}`; 
        const newNode = {
            id: newId,
            name: newNodeName.trim(),
            children: [], // Sujeito sempre tem array para poder adicionar filhos
            weight: 0, 
        };

        setTreeData((prevTree) => addChildNode(prevTree, selectedParentId, newNode));
        setNodeCount((prev) => prev + 1);
        closeAllModals();
    };

    // Determinar se o modal deve mostrar o seletor (apenas se o pai NÃO for L0)
    const isCategoryParent = selectedParentId === 'base' || selectedParentId === 'bonus' || selectedParentId === 'penalty';
    const showTypeSelector = selectedParentId !== null && !isCategoryParent;

    // Determinar o título do modal
    const modalTitle = isCategoryParent ? "Novo Tema" : "Novo Item";

    const handleSaveCriteria = () => {
        // Validate the tree structure
        const structureErrors = validateCriteriaTree(treeData);
        if (structureErrors.length > 0) {
            structureErrors.forEach(error => toast.error(error));
            return;
        }
        
        // Validate weight sums
        const weightErrors = validateWeightSum(treeData);
        if (weightErrors.length > 0) {
            weightErrors.forEach(error => toast.error(error));
            return;
        }
        
        // Validate bonus/penalty content
        const bonusPenaltyErrors = validateBonusPenaltyContent(treeData);
        if (bonusPenaltyErrors.length > 0) {
            bonusPenaltyErrors.forEach(error => toast.error(error));
            return;
        }
        
        // Validate test parameters
        const parameterErrors = validateTestParameters(treeData, testLibrary);
        if (parameterErrors.length > 0) {
            parameterErrors.forEach(error => toast.error(error));
            return;
        }
        
        // Transform tree data to backend format
        const criteriaJson = transformTreeToBackendFormat(treeData);
        
        // Trigger celebration animation
        setSaveButtonAnimation(true);
        setShowSaveSuccess(true);
        setIsSaved(true);
        
        // Call the onSave callback with the transformed data
        if (onSave) {
            console.log('Final Criteria Configuration:', JSON.stringify(criteriaJson, null, 2));
            onSave(criteriaJson);
        }
        
        // Reset animation after it completes
        setTimeout(() => {
            setSaveButtonAnimation(false);
        }, 600);
        
        // Hide success message after 2 seconds
        setTimeout(() => {
            setShowSaveSuccess(false);
        }, 2000);
    };
    
    const handleCancelSave = () => {
        // Lógica para reverter ou limpar o estado de "salvo"
        setIsSaved(false);
        
        // Call onSave with null to indicate unsaved state
        if (onSave) {
            onSave(null);
        }
    };
    
    const handleRemoveNode = (targetId) => {
        setTreeData((prevTree) => removeNode(prevTree, targetId));
    };

    // Show loading state while fetching template
    if (loadingTemplate) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-50 font-sans p-6 md:p-10 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
                    <p className="text-xl text-gray-300">Loading template...</p>
                    <p className="text-sm text-gray-500 mt-2">Fetching {templateName} configuration</p>
                </div>
            </div>
        );
    }

    // Show error state if template fetch failed
    if (templateError) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-50 font-sans p-6 md:p-10 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Template</h2>
                    <p className="text-gray-400 mb-4">{templateError}</p>
                    <p className="text-sm text-gray-500">
                        Please ensure the API is running at <code className="bg-gray-800 px-2 py-1 rounded">localhost:8000</code>
                    </p>
                </div>
            </div>
        );
    }

    // Show message if no template library loaded
    if (!testLibrary) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-50 font-sans p-6 md:p-10 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-400">No template data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-50 font-sans p-6 md:p-10 overflow-x-auto">
            <TreeStyles /> 
            <div className="max-w-5xl mx-auto">

                {/* Header - Raiz da Árvore */}
                <header className="text-center mb-12 border-b border-indigo-700/50 pb-4">
                    <h1 className="text-4xl font-extrabold text-white">
                        <span className="text-indigo-400">Assignment</span> Structure
                    </h1>
                    <p className="text-gray-400 mt-2">Defina os temas e o peso de cada seção.</p>
                </header>

                {/* --- MODAL 1: SELETOR DE TIPO (TEMA/TESTE) --- */}
                {selectedParentId && !isLibraryOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
                        <form onSubmit={handleSubmitNewNode} className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-sm border border-indigo-600 animate-in fade-in zoom-in duration-300">
                            <h3 className="xl font-bold mb-4 text-indigo-400">{modalTitle}</h3>
                            
                            {showTypeSelector && (
                                <div className="mb-6 flex space-x-4">
                                    {/* Botão SUJEITO */}
                                    <button
                                        type="button"
                                        onClick={() => setNodeTypeToCreate('Subject')}
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
                                        onClick={() => setNodeTypeToCreate('Test')}
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
                            )}

                            <input
                                type="text"
                                value={newNodeName}
                                onChange={(e) => setNewNodeName(e.target.value)}
                                placeholder={`Nome do ${isCategoryParent ? 'Tema' : nodeTypeToCreate === 'Subject' ? 'Sujeito' : 'Teste'}`}
                                className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeAllModals}
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
                )}
                
                {/* --- MODAL 2: BIBLIOTECA DE TESTES E CONFIGURAÇÃO --- */}
                {isLibraryOpen && testLibrary && (
                    <TestLibraryModal 
                        onClose={closeAllModals} 
                        initialName={initialName}
                        parentNodeId={selectedParentId}
                        // Se editingNode existe, passamos o nó para o modo Edição
                        editingNode={editingNode} 
                        onSaveTest={handleSaveTest}
                        onUpdateTest={(nodeId, testData) => {
                            setTreeData(prevTree => updateExistingNode(prevTree, nodeId, testData, testLibrary));
                            closeAllModals();
                        }}
                        testLibrary={testLibrary}
                    />
                )}

                {/* Save Button */}
                <div className="flex justify-start items-center gap-3 relative">
                    <button
                        onClick={handleSaveCriteria}
                        disabled={isSaved}
                        className={`px-4 py-2 font-medium rounded-lg transition duration-150 flex items-center gap-2 text-sm relative overflow-hidden ${
                            isSaved 
                                ? 'bg-green-600 text-white cursor-not-allowed' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        } ${saveButtonAnimation ? 'save-celebrate' : ''}`}
                    >
                        {isSaved ? (
                            <>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Saved
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                                </svg>
                                Salvar Critérios
                            </>
                        )}
                        {saveButtonAnimation && (
                            <>
                                {[...Array(8)].map((_, i) => (
                                    <span
                                        key={i}
                                        className="confetti-particle"
                                        style={{
                                            left: '50%',
                                            top: '50%',
                                            backgroundColor: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i % 5],
                                            transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateX(${20 + i * 5}px)`,
                                            animationDelay: `${i * 0.05}s`
                                        }}
                                    />
                                ))}
                            </>
                        )}
                    </button>
                    
                    {isSaved && (
                        <button
                            onClick={handleCancelSave}
                            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-150 flex items-center gap-2 text-sm"
                            title="Cancel and unsave changes"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    )}
                </div>

                {/* Success Toast Notification */}
                {showSaveSuccess && (
                    <div className="fixed bottom-8 right-8 z-50 toast-enter">
                        <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border-2 border-green-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <p className="font-bold">Saved!</p>
                                <p className="text-sm text-green-100">Criteria saved successfully</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Visualização da Árvore */}
                <div className="tree relative">
                    <ul className="pl-0">
                        {treeData.map((node) => (
                            <TreeNode
                                key={node.id}
                                node={node}
                                level={0}
                                onAddChild={handleAddChild}
                                onRemoveNode={handleRemoveNode} 
                                onWeightChange={handleWeightChange}
                                onEditTest={handleEditTest}
                                totalChildWeight={categoryWeights[node.id] || 0}
                                testLibrary={testLibrary}
                            />
                        ))}
                    </ul>
                </div>
                
            </div>
        </div>
    );
};

export default CriteriaForm;
