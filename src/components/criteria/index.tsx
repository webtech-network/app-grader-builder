/**
 * @fileoverview Main criteria builder component for defining assignment structure.
 * 
 * @description Provides a tree-based interface for creating and managing assignment
 * criteria with hierarchical categories (Base, Bonus, Penalty), subjects/themes, and
 * tests. Includes weight distribution, validation, and test library integration.
 * 
 * @module components/criteria
 */

import React, { useState, useMemo, FormEvent } from 'react';
import { toast } from 'react-toastify';
import TreeStyles from './TreeStyles';
import TestLibraryModal from './components/TestLibraryModal';
import TreeNode from './components/TreeNode';
import { LoadingState, ErrorState, EmptyState, SaveButton } from '../../shared';
import NodeCreationModal from './components/NodeCreationModal';
import { useFetchTemplate, useSaveState, useModal } from '../../hooks';
import {
    TreeNode as TreeNodeType,
    TestLibrary,
    BackendCriteriaFormat,
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

/**
 * Defines the type of node that can be created.
 * - 'Subject': A theme/topic node that can contain other nodes
 * - 'Test': A leaf node containing test evaluation logic
 */
type NodeType = 'Subject' | 'Test';

/**
 * Test configuration data structure.
 * @interface TestData
 */
interface TestData {
    /** Internal function name from the test library */
    functionName: string;
    /** Array of test parameter call arrays */
    calls: unknown[][];
    /** Custom display name for the test */
    name: string;
    /** Optional description of what the test validates */
    description?: string;
    /** Required file type (HTML, CSS, JavaScript) */
    required_file?: string;
    /** Display name from the test template */
    displayName?: string;
    /** Weight percentage for this test */
    weight?: number;
}

/**
 * Props for the CriteriaForm component.
 * @interface CriteriaFormProps
 */
interface CriteriaFormProps {
    /** Name of the template/test library to load */
    templateName: string;
    /** Callback fired when criteria is saved or cancelled */
    onSave?: (criteria: BackendCriteriaFormat | null) => void;
}

/**
 * CriteriaForm - Main component for building assignment evaluation criteria.
 * 
 * @description A comprehensive tree-based editor for creating hierarchical assignment
 * criteria. Features include:
 * - Three-tier structure: Categories > Subjects/Themes > Tests
 * - Weight distribution with validation (must sum to 100%)
 * - Test library integration with parameter configuration
 * - Drag-and-drop test selection
 * - Real-time weight calculation and visualization
 * - Validation for structure, weights, and test parameters
 * 
 * @example
 * ```tsx
 * <CriteriaForm
 *   templateName="web-dev"
 *   onSave={(criteria) => console.log('Saved:', criteria)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered CriteriaForm component
 */
const CriteriaForm: React.FC<CriteriaFormProps> = ({ templateName, onSave }) => {
    const initialTreeData: TreeNodeType[] = [
        { id: 'base', name: 'Base', children: [], weight: 100 }, 
        { id: 'bonus', name: 'Bonus', children: [], weight: 0 },
        { id: 'penalty', name: 'Penalty', children: [], weight: 0 },
    ];
    
    const [treeData, setTreeData] = useState<TreeNodeType[]>(initialTreeData);
    const [nodeCount, setNodeCount] = useState<number>(1);
    const [newNodeName, setNewNodeName] = useState<string>('');
    const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
    const [nodeTypeToCreate, setNodeTypeToCreate] = useState<NodeType>('Subject'); 

    // --- Novos estados para o fluxo de Testes ---
    const libraryModal = useModal(false);
    const [editingNode, setEditingNode] = useState<TreeNodeType | null>(null); // Armazena o nó que está sendo editado (ID)
    const [initialName, setInitialName] = useState<string>(''); // Nome inicial do nó
    
    // --- Template fetching com custom hook ---
    const { data: testLibrary, loading: loadingTemplate, error: templateError } = useFetchTemplate(templateName);
    
    // --- Save state com custom hook ---
    const { isSaved, showSuccess: showSaveSuccess, showAnimation: saveButtonAnimation, triggerSave, cancelSave } = useSaveState();

    // Calcula a soma dos pesos de cada categoria L0 (memoization)
    const categoryWeights = useMemo<Record<string, number>>(() => {
        const sums: Record<string, number> = {};
        treeData.forEach(category => {
            sums[category.id] = calculateChildWeights(category);
        });
        return sums;
    }, [treeData]);

    // --- LÓGICA DE NÓS (CRUD) ---
    const handleWeightChange = (targetId: string, newWeight: string | number): void => {
        setTreeData(prevTree => updateNodeWeight(prevTree, targetId, newWeight));
    };

    const handleAddChild = (parentId: string): void => {
        setSelectedParentId(parentId);
        setNewNodeName('');
        setNodeTypeToCreate('Subject'); 
        setEditingNode(null); // Limpa o estado de edição
        setInitialName(''); // Limpa o nome inicial
    };

    const handleEditTest = (nodeId: string, nodeName: string): void => {
        const nodeToEdit = findNodeById(treeData, nodeId);
        if (nodeToEdit && nodeToEdit.children === null) { // Confirma que é um Teste (folha)
            setEditingNode(nodeToEdit);
            // Remove o sufixo (Teste) do nome para o input do modal
            setInitialName(nodeName.replace(/\s\(Teste\)\s\(.*\)/, '').trim()); 
            libraryModal.open(); // Abre o modal de configuração
        }
    };

    const closeAllModals = (): void => {
        setSelectedParentId(null);
        libraryModal.close();
        setEditingNode(null);
        setNewNodeName('');
        setInitialName('');
    };

    // --- HANDLER DE CRIAÇÃO/EDIÇÃO DE TESTE ---
    const handleSaveTest = (testData: TestData): void => {
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
            setTreeData(prevTree => updateExistingNode(prevTree, editingNode.id, updatedNodeData, testLibrary as TestLibrary | null));
        } else {
            // Modo Criação: Cria um novo nó
            const newId = `node-${selectedParentId}-${nodeCount}`; 
            const testTemplate = (testLibrary as TestLibrary | null)?.tests?.find(t => t.name === testData.functionName);

            const newNode: TreeNodeType = {
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
            setTreeData((prevTree) => addChildNode(prevTree, selectedParentId!, newNode));
            setNodeCount((prev) => prev + 1);
        }
        
        closeAllModals();
    };

    const handleSubmitNewNode = (e: FormEvent<HTMLFormElement>): void => {
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
        const newNode: TreeNodeType = {
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

    const handleSaveCriteria = (): void => {
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
        const parameterErrors = validateTestParameters(treeData, testLibrary as TestLibrary | null);
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
    
    const handleCancelSave = (): void => {
        // Lógica para reverter ou limpar o estado de "salvo"
        cancelSave();
        
        // Call onSave with null to indicate unsaved state
        if (onSave) {
            onSave(null);
        }
    };
    
    const handleRemoveNode = (targetId: string): void => {
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
                        // Se editingNode existe, passamos o nó para o modo Edição
                        editingNode={editingNode} 
                        onSaveTest={handleSaveTest}
                        onUpdateTest={(nodeId: string, testData: TestData) => {
                            setTreeData(prevTree => updateExistingNode(prevTree, nodeId, testData, testLibrary as TestLibrary));
                            closeAllModals();
                        }}
                        testLibrary={testLibrary as TestLibrary}
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
                                testLibrary={testLibrary as TestLibrary}
                            />
                        ))}
                    </ul>
                </div>
                
            </div>
        </div>
    );
};

export default CriteriaForm;
