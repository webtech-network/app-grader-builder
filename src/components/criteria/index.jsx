import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import TreeStyles from './TreeStyles';
import TestLibraryModal from './components/TestLibraryModal';
import TreeNode from './components/TreeNode';
import LoadingState from '../../shared/LoadingState';
import ErrorState from '../../shared/ErrorState';
import EmptyState from '../../shared/EmptyState';
import NodeCreationModal from './components/NodeCreationModal';
import SaveButton from '../../shared/SaveButton';
import { useFetchTemplate, useSaveState, useModal } from '../../hooks';
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
    const libraryModal = useModal(false);
    const [editingNode, setEditingNode] = useState(null); // Armazena o nó que está sendo editado (ID)
    const [initialName, setInitialName] = useState(''); // Nome inicial do nó
    
    // --- Template fetching com custom hook ---
    const { data: testLibrary, loading: loadingTemplate, error: templateError } = useFetchTemplate(templateName);
    
    // --- Save state com custom hook ---
    const { isSaved, showSuccess: showSaveSuccess, showAnimation: saveButtonAnimation, triggerSave, cancelSave } = useSaveState();

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
            libraryModal.open(); // Abre o modal de configuração
        }
    };

    const closeAllModals = () => {
        setSelectedParentId(null);
        libraryModal.close();
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
            libraryModal.open();
            return; 
        }

        // --- Criação de Sujeito ---
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
        triggerSave();
        
        // Call the onSave callback with the transformed data
        if (onSave) {
            onSave(criteriaJson);
        }
    };
    
    const handleCancelSave = () => {
        // Lógica para reverter ou limpar o estado de "salvo"
        cancelSave();
        
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
        return <LoadingState templateName={templateName} />;
    }

    // Show error state if template fetch failed
    if (templateError) {
        return <ErrorState error={templateError} />;
    }

    // Show message if no template library loaded
    if (!testLibrary) {
        return <EmptyState />;
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
                {selectedParentId && !libraryModal.isOpen && (
                    <NodeCreationModal 
                        modalTitle={modalTitle}
                        showTypeSelector={showTypeSelector}
                        nodeTypeToCreate={nodeTypeToCreate}
                        newNodeName={newNodeName}
                        onNodeTypeChange={setNodeTypeToCreate}
                        onNodeNameChange={setNewNodeName}
                        onSubmit={handleSubmitNewNode}
                        onCancel={closeAllModals}
                        onOpenLibrary={() => {
                            setInitialName('');
                            libraryModal.open();
                        }}
                    />
                )}
                
                {/* --- MODAL 2: BIBLIOTECA DE TESTES E CONFIGURAÇÃO --- */}
                {libraryModal.isOpen && testLibrary && (
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
                <SaveButton 
                    isSaved={isSaved}
                    showAnimation={saveButtonAnimation}
                    showSuccessToast={showSaveSuccess}
                    onSave={handleSaveCriteria}
                    onCancel={handleCancelSave}
                />

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
