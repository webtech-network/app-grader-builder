import React, { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { Plus, X, Code, ListTree, LucideIcon } from 'lucide-react';
import { calculateChildWeights, TreeNode as TreeNodeType, TestLibrary } from '../utils';
import { useToggle } from '../../../hooks';

interface TreeNodeProps {
    node: TreeNodeType;
    level: number;
    onAddChild: (parentId: string) => void;
    onRemoveNode: (nodeId: string) => void;
    onWeightChange: (nodeId: string, weight: string | number) => void;
    totalChildWeight: number;
    onEditTest: (nodeId: string, nodeName: string) => void;
    testLibrary: TestLibrary | null;
}

interface NodeStyling {
    className: string;
    textColor: string;
    icon: LucideIcon;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onAddChild, onRemoveNode, onWeightChange, totalChildWeight, onEditTest, testLibrary }) => {
    const isLeaf = node.children === null || node.children.length === 0;
    const canAddChild = node.children !== null; 
    
    // State for showing weight input
    const weightInputToggle = useToggle(false);
    
    const isCategoryNode = level === 0;
    const isSubjectNode = node.children !== null && level > 0;
    const isTestNode = node.children === null; // Nó Teste
    const canBeDeleted = level > 0; 
    
    // Determina a cor e estilo do nó
    const getStyling = (id: string, isCategory: boolean, isSubject: boolean, isTest: boolean): NodeStyling => {
        let baseClasses = "flex items-center p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01]";
        let textColor = 'text-gray-200';
        let bgClass = 'bg-gray-700'; 
        let borderColor = 'border-gray-600';
        let cursorClass = isTest ? 'cursor-pointer' : 'cursor-default';

        if (isCategory) {
            bgClass = 'bg-gray-700';
            switch (id) {
                case 'base': textColor = 'text-green-400'; break;
                case 'bonus': textColor = 'text-indigo-400'; break;
                case 'penalty': textColor = 'text-red-400'; break;
                default: break;
            }
        } else if (isTest) {
            bgClass = 'bg-gray-900';
            borderColor = 'border-indigo-700 border-2';
            textColor = 'text-gray-300';
        } else if (isSubject) {
            bgClass = 'bg-gray-800';
            borderColor = 'border-gray-700 border';
            textColor = 'text-gray-200';
        }

        return { 
            className: `${baseClasses} ${bgClass} border ${borderColor} ${isCategory ? 'mt-4' : ''} ${cursorClass}`, 
            textColor,
            icon: isTest ? Code : ListTree 
        };
    };

    const { className: nodeClass, textColor, icon: NodeIcon } = getStyling(node.id, isCategoryNode, isSubjectNode, isTestNode);

    // Lógica da Barra de Progresso:
    const hasNestedSubjects = canAddChild && node.children && node.children.some(child => child.children !== null);
    const showProgressBar = isCategoryNode || (isSubjectNode && hasNestedSubjects); 
    
    const isOver100 = totalChildWeight > 100.1; 
    const isExactly100 = totalChildWeight >= 99.9 && totalChildWeight <= 100.1;
    const barColor = isOver100 ? 'bg-red-500' : (isExactly100 ? 'bg-green-500' : 'bg-indigo-500');
    const barWidth = Math.min(totalChildWeight, 100); 

    const handleWeightChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value;
        onWeightChange(node.id, value);
    };

    const addChildTitle = (): string => {
        return isCategoryNode ? "Adicionar Tema (1º nível)" : "Adicionar Sub-Tema ou Teste";
    };
    
    // --- Lógica de Classificação dos Filhos ---
    const sortedChildren = node.children ? [...node.children].sort((a, b) => {
        if (a.children !== null && b.children === null) return -1; 
        if (a.children === null && b.children !== null) return 1;
        return 0;
    }) : [];
    
    // --- Renderização do Nome e Título do Teste ---
    const getDisplayName = (): string => {
        if (isTestNode && node.metadata) {
            const testTemplate = testLibrary?.tests?.find(t => t.name === node.metadata?.functionName);
            const testDisplayName = testTemplate?.displayName || node.metadata.functionName;
            // Nome customizado + (Título do Teste)
            return `${node.name.replace(/\s\(Teste\)/, '')} (${testDisplayName})`;
        }
        return node.name;
    };
    
    const handleNodeClick = (): void => {
        if (isTestNode) {
            onEditTest(node.id, node.name);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            weightInputToggle.setFalse();
        }
    };

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    };


    return (
        <li className="list-none pt-2 relative">
            <div 
                className="node-container flex items-start group transition duration-300 ease-in-out"
                style={{ paddingLeft: level > 0 ? '15px' : '0' }}
            >
                <div 
                    className={nodeClass}
                    onClick={handleNodeClick}
                >
                    
                    {/* Ícone ou Indicador do Nó */}
                    <NodeIcon className={`w-4 h-4 mr-2 ${textColor}`} />

                    {/* Nome do Nó com peso para categorias */}
                    <div 
                        className={`font-semibold text-sm ${textColor} whitespace-nowrap flex items-center gap-2 ${isCategoryNode && node.id !== 'base' ? 'cursor-pointer' : ''}`}
                        onClick={() => {
                            if (isCategoryNode && node.id !== 'base') {
                                weightInputToggle.toggle();
                            }
                        }}
                    >
                        <span>{getDisplayName()}</span>
                        
                        {/* Peso para categorias Base/Bonus/Penalty */}
                        {isCategoryNode && (
                            node.id === 'base' ? (
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-green-400">100</span>
                            ) : (
                                weightInputToggle.value ? (
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        dir="ltr"
                                        value={node.weight === 0 ? '' : node.weight}
                                        onChange={handleWeightChange}
                                        onKeyDown={handleKeyDown}
                                        className="w-12 p-1 text-xs bg-gray-600 border border-gray-500 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-150 text-right"
                                        title={`Pontuação Máxima (${node.id.toUpperCase()})`}
                                        onClick={(e: MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                                        onBlur={() => weightInputToggle.setFalse()}
                                        autoFocus
                                    />
                                ) : (
                                    <span className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                                        node.id === 'bonus' ? 'text-indigo-400' : 'text-red-400'
                                    }`}>
                                        {node.weight || 0}
                                    </span>
                                )
                            )
                        )}
                    </div>
                    
                    {/* INPUT DE PESO (Apenas para Temas/Sujeitos que não são categoria e não são testes) */}
                    {(canBeDeleted && !isTestNode && !isCategoryNode) && (
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            dir="ltr"
                            value={node.weight === 0 ? '' : node.weight}
                            onChange={handleWeightChange}
                            onKeyDown={handleInputKeyDown}
                            className="ml-4 w-16 p-1 text-xs bg-gray-600 border border-gray-500 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-150 text-right"
                            title="Peso do Tema (0-100)"
                        />
                    )}

                    {/* PROGRESS BAR (Condicional: Categorias E Sujeitos com aninhamento) */}
                    {showProgressBar && (
                        // BARRA MENOR: w-24 sm:w-32
                        <div className="flex items-center ml-4 space-x-2 w-24 sm:w-32">
                            <div className="w-full bg-gray-600 rounded-full h-2.5">
                                <div 
                                    className={`h-2.5 rounded-full transition-all duration-500 ease-out ${barColor}`} 
                                    style={{ width: `${barWidth}%` }}
                                    title={`Soma dos pesos: ${totalChildWeight.toFixed(1)}%`}
                                ></div>
                            </div>
                            <span className={`text-xs font-bold w-10 text-right whitespace-nowrap ${isOver100 ? 'text-red-500' : 'text-gray-300'}`}>
                                {totalChildWeight.toFixed(1)}%
                            </span>
                        </div>
                    )}
                    
                    {/* Ações (Botões) */}
                    <div className="flex space-x-2 ml-4 opacity-75 group-hover:opacity-100 transition duration-300">
                        {/* Adicionar Novo Sub-Tema (Filho) */}
                        {canAddChild && (
                            <button
                                className="text-indigo-400 hover:text-indigo-300 transition duration-150"
                                onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onAddChild(node.id); }}
                                title={addChildTitle()}
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        )}

                        {/* Remover Nó (Apenas para nós criados pelo usuário - nível > 0) */}
                        {canBeDeleted && (
                            <button
                                className="text-red-500 hover:text-red-400 transition duration-150"
                                onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onRemoveNode(node.id); }}
                                title="Remover Tema/Teste"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Renderizar Filhos Recursivamente */}
            {!isLeaf && node.children && (
                <ul className="tree-branch mt-2">
                    {sortedChildren.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            onAddChild={onAddChild}
                            onRemoveNode={onRemoveNode}
                            onWeightChange={onWeightChange}
                            onEditTest={onEditTest}
                            // Calcula o peso dos filhos do nó atual
                            totalChildWeight={calculateChildWeights(child)}
                            testLibrary={testLibrary}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default TreeNode;
