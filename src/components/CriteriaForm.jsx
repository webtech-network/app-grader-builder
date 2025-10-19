import React, { useState, useMemo } from 'react';
import { Plus, X, ListTree, Code } from 'lucide-react'; // Ícones para as ações

// --- ESTILOS CUSTOMIZADOS PARA AS LINHAS DA ÁRVORE (INJETADOS NO JSX) ---
// Estes estilos são necessários para desenhar as linhas de conexão da árvore (não nativo do Tailwind).
const TreeStyles = () => (
  <style jsx="true">{`
    /* Tree line styles */
    .tree ul {
      padding-left: 25px;
      position: relative;
    }
    .tree ul:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 10px;
      width: 2px;
      background: #4B5563; /* gray-600 */
    }
    .tree li {
      position: relative;
    }
    .tree li:before {
      content: '';
      position: absolute;
      top: 15px;
      left: 10px;
      width: 15px;
      height: 2px;
      background: #4B5563; /* gray-600 */
    }
    .tree li:last-child:before {
      /* Remove a linha vertical abaixo do último nó */
      background: transparent;
    }
    /* Estilo para o último nó na lista principal */
    .tree > ul > li:last-child:before {
      background: #111827; /* Cor do fundo para esconder a linha vertical */
    }
    
    /* Save celebration animation */
    @keyframes celebrate {
      0% {
        transform: scale(1);
      }
      25% {
        transform: scale(1.1) rotate(3deg);
      }
      50% {
        transform: scale(1.15) rotate(-3deg);
      }
      75% {
        transform: scale(1.1) rotate(2deg);
      }
      100% {
        transform: scale(1) rotate(0deg);
      }
    }
    
    @keyframes confetti {
      0% {
        opacity: 1;
        transform: translateY(0) rotate(0deg);
      }
      100% {
        opacity: 0;
        transform: translateY(-100px) rotate(360deg);
      }
    }
    
    .save-celebrate {
      animation: celebrate 0.6s ease-in-out;
    }
    
    .confetti-particle {
      position: absolute;
      width: 8px;
      height: 8px;
      animation: confetti 0.8s ease-out forwards;
      pointer-events: none;
    }
    
    @keyframes slideInUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutDown {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(100%);
        opacity: 0;
      }
    }
    
    .toast-enter {
      animation: slideInUp 0.3s ease-out;
    }
    
    .toast-exit {
      animation: slideOutDown 0.3s ease-in;
    }
  `}</style>
);
// --- FIM DOS ESTILOS CUSTOMIZADOS ---

// Função auxiliar para encontrar o nó por ID (necessário para a validação)
const findNodeById = (nodes, id) => {
    for (const node of nodes) {
        if (node.id === id) {
            return node;
        }
        if (node.children) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return null;
};

// Componente Recursivo do Nó
const TreeNode = ({ node, level, onAddChild, onRemoveNode, onWeightChange, totalChildWeight }) => {
  // Se node.children for null, ele é uma folha e não pode ter filhos.
  const isLeaf = node.children === null || node.children.length === 0;

  // Permissão de Adicionar: Baseia-se no tipo do nó. Só pode adicionar se node.children NÃO for null.
  const canAddChild = node.children !== null; 
  
  // State for showing weight input
  const [showWeightInput, setShowWeightInput] = useState(false);

  // Identifica o tipo de nó para lógica e styling
  const isCategoryNode = level === 0; // Base, Bonus, Penalty
  const isSubjectNode = node.children !== null && level > 0; // Sujeito é qualquer nó que pode ter filhos (L1+)
  const isTestNode = node.children === null; // Teste é o nó folha
  const canBeDeleted = level > 0; // Pode deletar Temas e Testes
  
  // Determina a cor e estilo do nó
  const getStyling = (id, isCategory, isSubject, isTest) => {
    let baseClasses = "flex items-center p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01]";
    let textColor = 'text-gray-200';
    let bgClass = 'bg-gray-700'; 
    let borderColor = 'border-gray-600';

    if (isCategory) {
        // Categoria (L0)
        bgClass = 'bg-gray-700';
        switch (id) {
            case 'base': textColor = 'text-green-400'; break;
            case 'bonus': textColor = 'text-indigo-400'; break;
            case 'penalty': textColor = 'text-red-400'; break;
            default: break;
        }
    } else if (isTest) {
        // Teste (Nó Folha) - Design mais destacado, é o nó final
        bgClass = 'bg-gray-900';
        borderColor = 'border-indigo-700 border-2';
        textColor = 'text-gray-300';
    } else if (isSubject) {
        // Tema/Sujeito (L1+) - Agrupador de Testes
        bgClass = 'bg-gray-800';
        borderColor = 'border-gray-700 border';
        textColor = 'text-gray-200';
    }

    return { 
        className: `${baseClasses} ${bgClass} border ${borderColor} ${isCategory ? 'mt-4' : ''}`, 
        textColor,
        icon: isTest ? Code : ListTree 
    };
  };

  const { className: nodeClass, textColor, icon: NodeIcon } = getStyling(node.id, isCategoryNode, isSubjectNode, isTestNode);

  // Lógica da Barra de Progresso:
  // 1. Mostrar se for Categoria (level 0) OU
  // 2. Mostrar se for Sujeito (level > 0) E possuir filhos (indicando que é um nó agrupador)
  const hasNestedSubjects = canAddChild && node.children && node.children.some(child => child.children !== null);
  const showProgressBar = isCategoryNode || (isSubjectNode && hasNestedSubjects); 
  
  const isOver100 = totalChildWeight > 100.1; // Tolerância para ponto flutuante
  const isExactly100 = totalChildWeight >= 99.9 && totalChildWeight <= 100.1;
  const barColor = isOver100 ? 'bg-red-500' : (isExactly100 ? 'bg-green-500' : 'bg-indigo-500');
  const barWidth = Math.min(totalChildWeight, 100); // Limita a visualização em 100%

  const handleWeightChange = (e) => {
      // Garante que o valor é um número (ou string vazia)
      const value = e.target.value;
      onWeightChange(node.id, value);
  };

  // Determina o título para a ação de adicionar
  const addChildTitle = () => {
    return isCategoryNode ? "Adicionar Tema (1º nível)" : "Adicionar Sub-Tema ou Teste";
  };
  
  // --- Lógica de Classificação dos Filhos ---
  const sortedChildren = node.children ? [...node.children].sort((a, b) => {
    // Sujeito (children: []) deve vir antes de Teste (children: null)
    if (a.children !== null && b.children === null) return -1; 
    if (a.children === null && b.children !== null) return 1;
    return 0;
  }) : [];


  return (
    <li className="list-none pt-2 relative">
      <div 
        className="node-container flex items-start group transition duration-300 ease-in-out"
        style={{ paddingLeft: level > 0 ? '15px' : '0' }}
      >
        <div className={nodeClass}>
          
          {/* Ícone ou Indicador do Nó */}
          <NodeIcon className={`w-4 h-4 mr-2 ${textColor}`} />

          {/* Nome do Nó com peso ou input */}
          <div 
            className={`font-semibold text-sm ${textColor} whitespace-nowrap flex items-center gap-2 cursor-pointer group`}
            onClick={() => {
              if (isCategoryNode && node.id !== 'base') {
                setShowWeightInput(!showWeightInput);
              }
            }}
          >
            <span>{node.name}</span>
            {/* Peso para categorias */}
            {isCategoryNode && (
              node.id === 'base' ? (
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-green-400">100</span>
              ) : (
                showWeightInput ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    dir="ltl"
                    value={node.weight === 0 ? '' : node.weight}
                    onChange={handleWeightChange}
                    className="w-12 p-1 text-xs bg-gray-600 border border-gray-500 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-150 text-right"
                    title={`Pontuação Máxima (${node.id.toUpperCase()})`}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={() => setShowWeightInput(false)}
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
          
          {/* INPUT DE PESO (Apenas para Temas/Sujeitos) */}
          {(canBeDeleted && !isTestNode && !isCategoryNode) && (
            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                dir="ltl"
                value={node.weight === 0 ? '' : node.weight}
                onChange={handleWeightChange}
                className="ml-4 w-12 p-1 text-xs bg-gray-600 border border-gray-500 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition duration-150 text-right"
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
                onClick={() => onAddChild(node.id)}
                title={addChildTitle()}
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            {/* Remover Nó (Apenas para nós criados pelo usuário - nível > 0) */}
            {canBeDeleted && (
              <button
                className="text-red-500 hover:text-red-400 transition duration-150"
                onClick={() => onRemoveNode(node.id)}
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
              // Calcula o peso dos filhos do nó atual
              totalChildWeight={calculateChildWeights(child)} 
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// --- FUNÇÕES DE LÓGICA DE PESO ---

// Função auxiliar para calcular a soma dos pesos dos filhos de QUALQUER nó
const calculateChildWeights = (node) => {
    if (!node.children || node.children.length === 0) {
        return 0;
    }
    // Soma os pesos (garantindo que o peso seja um número)
    return node.children.reduce((acc, child) => acc + (parseFloat(child.weight) || 0), 0);
};

// Componente Principal
const CriteriaForm = ({ onSave }) => {
  // Estrutura inicial da árvore com peso 0
  const initialTreeData = [
    // Base é sempre 100 por padrão, o weight aqui define o valor inicial
    { id: 'base', name: 'Base', children: [], weight: 100 }, 
    { id: 'bonus', name: 'Bonus', children: [], weight: 0 }, // Peso inicial para Bonus
    { id: 'penalty', name: 'Penalty', children: [], weight: 0 }, // Peso inicial para Penalty
  ];
  const [treeData, setTreeData] = useState(initialTreeData);

  const [nodeCount, setNodeCount] = useState(1);
  const [newNodeName, setNewNodeName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState(null);
  // Novo estado para o seletor: 'Subject' ou 'Test'
  const [nodeTypeToCreate, setNodeTypeToCreate] = useState('Subject');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [saveButtonAnimation, setSaveButtonAnimation] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Calcula a soma dos pesos de cada categoria L0 (memoization)
  const categoryWeights = useMemo(() => {
    const sums = {};
    treeData.forEach(category => {
        sums[category.id] = calculateChildWeights(category);
    });
    return sums;
  }, [treeData]);

  // Função recursiva para adicionar um nó
  const addChildNode = (nodes, parentId, newNode) => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        // Se o nó pai tem children: null (folha), não podemos adicionar, mas o canAddChild previne isso.
        return {
          ...node,
          children: [...node.children, newNode],
        };
      }
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: addChildNode(node.children, parentId, newNode),
        };
      }
      return node;
    });
  };

  // Função recursiva para remover um nó
  const removeNode = (nodes, targetId) => {
    return nodes.filter((node) => {
      if (node.id === targetId) {
        return false;
      }
      if (node.children && node.children.length > 0) {
        node.children = removeNode(node.children, targetId);
      }
      return true;
    });
  };
  
  // Função recursiva para atualizar o peso
  const updateNodeWeight = (nodes, targetId, newWeight) => {
    return nodes.map(node => {
        if (node.id === targetId) {
            // Garante que o peso seja um número não negativo
            let weightValue = Math.max(0, parseFloat(newWeight) || 0);

            // Regra: Se o nó for Categoria (Bonus/Penalty), o máximo é 100
            if (targetId === 'bonus' || targetId === 'penalty') {
                weightValue = Math.min(100, weightValue);
            }
            
            return { ...node, weight: weightValue };
        }
        if (node.children && node.children.length > 0) {
            return {
                ...node,
                children: updateNodeWeight(node.children, targetId, newWeight),
            };
        }
        return node;
    });
  };
  
  const handleWeightChange = (targetId, newWeight) => {
      setTreeData(prevTree => updateNodeWeight(prevTree, targetId, newWeight));
  };

  const handleSaveCriteria = () => {
    // Transform tree structure to backend format
    // Backend expects: { base: {...}, bonus: {...}, penalty: {...} }
    // Each category has: weight and subjects (dict of subjects)
    // Each subject has: weight and either tests OR nested subjects
    
    const transformSubjectToBackend = (node) => {
      const subject = {};
      
      if (node.weight && node.weight > 0) {
        subject.weight = node.weight;
      }
      
      // Check if this subject has test children (leaf nodes with children === null)
      const hasTests = node.children && node.children.some(child => child.children === null);
      
      if (hasTests) {
        // Has tests - collect them (for now, as placeholder structure)
        subject.tests = node.children
          .filter(child => child.children === null)
          .map(test => ({
            name: test.name.replace(' (Teste)', ''),
            file: 'all', // Default, user should configure this later
            calls: [[]] // Empty calls array as placeholder
          }));
      } else if (node.children && node.children.length > 0) {
        // Has nested subjects
        subject.subjects = {};
        node.children.forEach(child => {
          // Use sanitized name as key (remove special chars, lowercase, spaces to underscores)
          const key = child.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
          subject.subjects[key] = transformSubjectToBackend(child);
        });
      }
      
      return subject;
    };

    const buildCategoryConfig = (categoryNode) => {
      if (!categoryNode || !categoryNode.children || categoryNode.children.length === 0) {
        return null;
      }
      
      const category = {
        subjects: {}
      };
      
      if (categoryNode.weight && categoryNode.weight > 0) {
        category.weight = categoryNode.weight;
      }
      
      // Convert each child to a subject
      categoryNode.children.forEach(child => {
        const key = child.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
        category.subjects[key] = transformSubjectToBackend(child);
      });
      
      return category;
    };

    const baseNode = treeData.find(n => n.id === 'base');
    const bonusNode = treeData.find(n => n.id === 'bonus');
    const penaltyNode = treeData.find(n => n.id === 'penalty');

    const criteriaConfig = {
      base: buildCategoryConfig(baseNode) || { subjects: {} }
    };
    
    // Only add bonus/penalty if they have content
    const bonusConfig = buildCategoryConfig(bonusNode);
    if (bonusConfig) {
      criteriaConfig.bonus = bonusConfig;
    }
    
    const penaltyConfig = buildCategoryConfig(penaltyNode);
    if (penaltyConfig) {
      criteriaConfig.penalty = penaltyConfig;
    }

    // Call parent callback if provided
    if (onSave) {
      onSave(criteriaConfig);
    }
    
    // Trigger celebration animation
    setSaveButtonAnimation(true);
    setShowSaveSuccess(true);
    setIsSaved(true);
    
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
    setIsSaved(false);
    // Call parent callback with null to indicate unsaved state
    if (onSave) {
      onSave(null);
    }
  };

  const handleAddChild = (parentId) => {
    // 1. Encontrar o nó pai para verificar o nível
    let parentLevel = -1;
    const findParentLevel = (nodes, level) => {
        for (const node of nodes) {
            if (node.id === parentId) {
                parentLevel = level;
                return true;
            }
            if (node.children && findParentLevel(node.children, level + 1)) {
                return true;
            }
        }
        return false;
    };
    findParentLevel(treeData, 0);

    // 2. Definir o tipo padrão e abrir o modal
    setSelectedParentId(parentId);
    setNewNodeName('');
    
    // Se for L0 (Categoria), o tipo é sempre 'Subject' e o modal aparece sem o seletor.
    // Se for L1 ou mais (Sujeito), o tipo padrão é 'Subject' e o modal aparece com o seletor.
    setNodeTypeToCreate('Subject'); 
  };

  const handleSubmitNewNode = (e) => {
    e.preventDefault();
    if (!newNodeName.trim() || !selectedParentId) return;

    const parentNode = findNodeById(treeData, selectedParentId);
    
    // Validação de Homogeneidade: Um Subject (agrupador) só pode ter um tipo de filho (ou Sub-Subjects OU Testes)
    if (parentNode && parentNode.children) {
      const isCreatingTest = nodeTypeToCreate === 'Test';
      const isCreatingSubject = nodeTypeToCreate === 'Subject';

      // Verifica se existe algum Teste (child.children === null)
      const hasExistingTests = parentNode.children.some(child => child.children === null);
      
      // Verifica se existe algum Sub-Sujeito (child.children !== null)
      const hasExistingSubSubjects = parentNode.children.some(child => child.children !== null);
      
      // Regra 1: Tenta adicionar Teste, mas já existem Sub-Sujeitos
      if (isCreatingTest && hasExistingSubSubjects) {
          alert("Erro: Este Tema já contém Sub-Temas aninhados. Para manter a clareza, os nós de 'Teste' devem ser adicionados apenas dentro do último Sujeito aninhado (nó folha agrupador).");
          return;
      }

      // Regra 2: Tenta adicionar Sub-Sujeito, mas já existem Testes
      if (isCreatingSubject && hasExistingTests) {
          alert("Erro: Este Tema já contém Testes. Para manter a clareza, um Tema só pode conter ou Testes ou Sub-Temas, mas não ambos.");
          return;
      }
    }
    // --- Fim da Validação ---

    const newId = `node-${selectedParentId}-${nodeCount}`; // ID único e descritivo
    
    // Determina a estrutura com base no tipo selecionado
    const isSubject = nodeTypeToCreate === 'Subject';
    const childrenStructure = isSubject ? [] : null; // Sujeito = [], Teste = null (folha)
    const nodeTypeLabel = isSubject ? '' : 'Teste';

    const newNode = {
      id: newId,
      name: newNodeName.trim() + (nodeTypeLabel ? ` (${nodeTypeLabel})` : ''),
      children: childrenStructure, 
      weight: 0, 
    };

    setTreeData((prevTree) => addChildNode(prevTree, selectedParentId, newNode));
    setNodeCount((prev) => prev + 1);
    setSelectedParentId(null); // Fecha o modal/form
    setNewNodeName('');
  };

  const handleRemoveNode = (targetId) => {
    setTreeData((prevTree) => removeNode(prevTree, targetId));
  };

  // Determinar se o modal deve mostrar o seletor (apenas se o pai NÃO for L0)
  const isCategoryParent = selectedParentId === 'base' || selectedParentId === 'bonus' || selectedParentId === 'penalty';
  const showTypeSelector = selectedParentId !== null && !isCategoryParent;

  // Determinar o título do modal
  const modalTitle = isCategoryParent ? "Novo Tema" : "Novo Item";


  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 font-sans p-6 md:p-10 overflow-x-auto">
      <TreeStyles /> {/* Injeta os estilos de linha */}
      <div className="max-w-5xl mx-auto">

        {/* Header - Raiz da Árvore */}
        <header className="text-center mb-3 border-b border-indigo-700/50 pb-4">
          <h1 className="text-4xl font-extrabold text-white">
            <span className="text-indigo-400">Assignment</span> Structure
          </h1>
          <p className="text-gray-400 mt-2">Defina os temas e o peso de cada seção.</p>
        </header>

        {/* Formulário de Adição de Nó (Modal Simples) */}
        {selectedParentId && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmitNewNode} className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-sm border border-indigo-600 animate-in fade-in zoom-in duration-300">
              <h3 className="xl font-bold mb-4 text-indigo-400">{modalTitle}</h3>
              
              {/* Seletor de Tipo (VISÍVEL APENAS SE NÃO FOR CATEGORIA L0) */}
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
                placeholder={`Nome do ${isCategoryParent ? 'Tema' : nodeTypeToCreate === 'Subject' ? 'Tema' : 'Teste'}`}
                className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedParentId(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition duration-150"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
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
                // Passa a soma total dos filhos de L0 (Calculada via useMemo para estabilidade)
                totalChildWeight={categoryWeights[node.id] || 0} 
              />
            ))}
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default CriteriaForm;
