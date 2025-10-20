import React, { useState, useMemo, useEffect } from 'react';
import { Plus, X, ListTree, Code, Library, Settings, FileText } from 'lucide-react'; 

// --- DADOS MOCK (Biblioteca de Testes Atualizada) ---
const TEST_LIBRARY = {
    "template_name": "Html Css Js Template",
    "template_description": "Um template abrangente para trabalhos de desenvolvimento web, incluindo testes para HTML, CSS e JavaScript.",
    "tests": [
        {
            "name": "has_class",
            "description": "Verifica a presença de classes CSS específicas, com suporte a curingas, um número mínimo de vezes.",
            "required_file": "HTML",
            "type_tag": "HTML", 
            "parameters": [
                { "name": "class_names", "description": "Lista de classes (separadas por vírgulas, ex: 'col-*, container')", "type": "list of strings", "defaultValue": "" },
                { "name": "required_count", "description": "O número mínimo de vezes que as classes devem aparecer no total.", "type": "integer", "defaultValue": 1 }
            ],
            "displayName": "Has Class"
        },
        {
            "name": "check_bootstrap_linked",
            "description": "Verifica se o framework Bootstrap está vinculado no arquivo HTML.",
            "required_file": "HTML",
            "type_tag": "PENALTY",
            "parameters": [],
            "displayName": "Check Bootstrap Linked"
        },
        {
            "name": "has_tag",
            "description": "Verifica se uma tag HTML específica aparece um número mínimo de vezes.",
            "required_file": "HTML",
            "type_tag": "HTML",
            "parameters": [
                { "name": "tag", "description": "A tag HTML a ser pesquisada (por exemplo, 'div').", "type": "string", "defaultValue": "div" },
                { "name": "required_count", "description": "O número mínimo de vezes que a tag deve aparecer.", "type": "integer", "defaultValue": 1 }
            ],
            "displayName": "Has Tag"
        },
        {
            "name": "check_all_images_have_alt",
            "description": "Verifica se todas as tags `<img>` possuem um atributo `alt` não vazio.",
            "required_file": "HTML",
            "type_tag": "ACCESSIBILITY",
            "parameters": [],
            "displayName": "Check All Images Have Alt"
        },
        {
            "name": "js_uses_query_string_parsing",
            "description": "Verifica se o código JavaScript contém padrões para ler query strings da URL.",
            "required_file": "JavaScript",
            "type_tag": "JS",
            "parameters": [],
            "displayName": "JS Uses Query String Parsing"
        },
        {
            "name": "check_media_queries",
            "description": "Verifica se existem media queries no arquivo CSS.",
            "required_file": "CSS",
            "type_tag": "CSS",
            "parameters": [],
            "displayName": "Check Media Queries"
        },
        {
            "name": "check_dir_exists",
            "description": "Verifica se um diretório específico existe no envio.",
            "required_file": "Project Structure",
            "type_tag": "STRUCTURE",
            "parameters": [
                { "name": "dir_path", "description": "O caminho do diretório (ex: css, imgs)", "type": "string", "defaultValue": "css" }
            ],
            "displayName": "Check Dir Exists"
        },
        {
            "name": "check_project_structure",
            "description": "Verifica se o caminho da estrutura esperada existe nos arquivos de envio.",
            "required_file": "Project Structure",
            "type_tag": "STRUCTURE",
            "parameters": [
                { "name": "expected_structure", "description": "O caminho do arquivo esperado (ex: css/styles.css)", "type": "string", "defaultValue": "" }
            ],
            "displayName": "Check Project Structure"
        },
        {
            "name": "has_no_js_framework",
            "description": "Verifica a presença de frameworks JavaScript proibidos (React, Vue, Angular).",
            "required_file": "Project Structure",
            "type_tag": "PENALTY",
            "parameters": [
                 // Estes parâmetros são preenchidos pelo autograder, não pelo usuário, então são omitidos da configuração
            ],
            "displayName": "Has No JS Framework"
        }
    ]
};

const MOCK_TEST_LIBRARY_FLAT = TEST_LIBRARY.tests;

// --- ESTILOS CUSTOMIZADOS PARA AS LINHAS DA ÁRVORE (INJETADOS NO JSX) ---
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
    /* Estilo para a área de drop */
    .drag-over {
        border: 2px dashed #6366F1 !important; /* Indigo-500 */
        background-color: #1F2937 !important; /* Gray-800 */
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

// --- COMPONENTE: MODAL DA BIBLIOTECA DE TESTES (DRAG & DROP) ---
const TestLibraryModal = ({ onClose, initialName, editingNode, onSaveTest, onUpdateTest }) => {
    
    // Armazena o objeto MOCK_TEST_LIBRARY_FLAT do teste sendo configurado
    const [currentTestConfig, setCurrentTestConfig] = useState(null); 
    const [isDropping, setIsDropping] = useState(false);
    const [params, setParams] = useState({});
    const [nodeCustomName, setNodeCustomName] = useState(initialName);

    // 1. Determina a definição completa do template (Baseado no drop ou no editingNode)
    const testTemplate = useMemo(() => {
        let nameToFind = null;
        
        // 1. Edição (usa metadata.functionName)
        if (editingNode && editingNode.metadata) {
            nameToFind = editingNode.metadata.functionName;
        } 
        // 2. Criação (usa o teste dropado)
        else if (currentTestConfig) {
            nameToFind = currentTestConfig.name;
        }

        return nameToFind ? MOCK_TEST_LIBRARY_FLAT.find(t => t.name === nameToFind) || null : null;
    }, [editingNode, currentTestConfig]);

    // 2. Efeito para carregar os parâmetros (Roda quando o templateBase muda)
    useEffect(() => {
        
        // Se estiver no modo edição, inicializa com o template base do nó
        if (editingNode && !currentTestConfig) {
            const initialTestName = editingNode.metadata.functionName;
            const testBase = MOCK_TEST_LIBRARY_FLAT.find(t => t.name === initialTestName);
            setCurrentTestConfig(testBase);
        }
        
        if (testTemplate) {
            
            // Inicializa o nome
            const initialCustomName = editingNode 
                ? editingNode.name.replace(/\s\(Teste\)\s\(.*\)/, '').trim() 
                : initialName;
            setNodeCustomName(initialCustomName);

            const initialParams = {};
            
            testTemplate.parameters.forEach(p => {
                const paramName = p.name;
                const paramType = p.type;
                
                // Tenta carregar valores de CALLS se estiver editando
                if (editingNode) {
                    const nodeCalls = editingNode.metadata.calls[0] || [];
                    const paramIndex = testTemplate.parameters.findIndex(tp => tp.name === p.name);
                    const nodeValue = nodeCalls[paramIndex];
                    
                    if (nodeValue !== undefined) {
                        initialParams[paramName] = nodeValue;
                        return;
                    }
                }
                
                // Se não estiver editando ou valor não encontrado, usa o default
                if (p.defaultValue !== undefined) {
                    initialParams[paramName] = p.defaultValue;
                } else {
                    // Default para inputs controlados: string vazia ou 0
                    initialParams[paramName] = (paramType === 'integer' || paramType === 'number') ? 0 : '';
                }
            });
            
            setParams(initialParams);

        } else {
            // Limpa estados se não houver template (para quando o modal abre vazio)
            setParams({});
            setNodeCustomName(initialName);
        }
    }, [testTemplate, editingNode, initialName]);


    const handleChange = (id, value, type) => {
        let parsedValue = value;
        if (type === 'integer' || type === 'number') {
             parsedValue = value === '' ? '' : parseFloat(value);
        } else if (type === 'list of strings') {
             parsedValue = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        }
        setParams(prev => ({ ...prev, [id]: parsedValue }));
    };

    const getInputType = (type) => {
        if (type === 'integer' || type === 'number') return 'number';
        return 'text';
    };

    const getInputValue = (id, type) => {
        const value = params[id];
        // Retorna string vazia para undefined/null em inputs controlados
        if (value === undefined || value === null) return ''; 

        if (type === 'list of strings' && Array.isArray(value)) {
            return value.join(', ');
        }
        return value;
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (!testTemplate) return;
        
        // 2. Validação de campos obrigatórios
        const requiredParams = testTemplate.parameters.filter(p => p.type !== 'dictionary');
        
        for (const p of requiredParams) {
            // Checa se o campo está vazio ou se é NaN para números
            if (params[p.name] === '' || params[p.name] === null || params[p.name] === undefined || 
                (p.type === 'list of strings' && (Array.isArray(params[p.name]) && params[p.name].length === 0))) {
                alert(`O parâmetro '${p.description}' é obrigatório.`);
                return;
            }
            if ((p.type === 'integer' || p.type === 'number') && isNaN(params[p.name])) {
                alert(`O parâmetro '${p.description}' deve ser um número.`);
                return;
            }
        }
        
        // 3. Mapeamento de Parâmetros para Calls (Formato de Argumentos)
        const calls = [[]]; 
        const callArgs = testTemplate.parameters.map(p => {
            if (p.type !== 'dictionary' && p.name !== 'submission_files' && p.name !== 'html_file' && p.name !== 'js_file') {
                return params[p.name];
            }
            return null; 
        }).filter(arg => arg !== null);

        calls[0] = callArgs;
        
        const testData = {
            functionName: testTemplate.name,
            calls: calls,
            name: nodeCustomName,
            description: testTemplate.description,
            required_file: testTemplate.required_file,
            displayName: testTemplate.displayName,
            weight: editingNode?.weight || 0 // Mantém o peso se estiver editando
        };
        
        if (editingNode) {
            onUpdateTest(editingNode.id, testData);
        } else {
            onSaveTest(testData); 
        }
    };
    
    // --- Lógica de Drag & Drop ---
    const handleDragStart = (e, test) => {
        e.dataTransfer.setData('application/json', JSON.stringify(test));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDropping(false);
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            
            // Define o currentTestConfig com o objeto dropado
            setCurrentTestConfig(data); 
        } catch (error) {
            console.error("Erro ao processar o teste arrastado:", error);
            alert("Erro ao selecionar o teste. Tente novamente.");
        }
    };

    const groupedTests = MOCK_TEST_LIBRARY_FLAT.reduce((acc, test) => {
        const type = test.type_tag || test.required_file || 'Outros';
        if (!acc[type]) acc[type] = [];
        acc[type].push(test);
        return acc;
    }, {});
    
    // --- Renderização do Painel de Configuração (Lado Direito) ---
    const renderConfigPanel = () => {
        if (!testTemplate) {
            // Drop Target Inicial
            return (
                <div 
                    className={`w-1/2 p-6 flex flex-col items-center justify-center text-center transition duration-300 border-2 border-dashed rounded-lg ml-4 ${isDropping ? 'drag-over' : 'border-gray-600 bg-gray-700'}`}
                    onDragOver={handleDragOver}
                    onDragEnter={() => setIsDropping(true)}
                    onDragLeave={() => setIsDropping(false)}
                    onDrop={handleDrop}
                >
                    <Settings className="w-10 h-10 text-gray-400 mb-4"/>
                    <p className="text-lg text-gray-300 font-semibold">Arraste um Teste para cá</p>
                    <p className="text-sm text-gray-400 mt-2">Solte o item para configurar os parâmetros e adicionar o nó **{initialName.trim() || '(Sem Nome)'}**.</p>
                </div>
            );
        }

        // Formulário de Configuração do Teste
        const test = testTemplate; // Usa o template completo
        const userConfigurableParameters = test.parameters.filter(p => 
            p.type !== 'dictionary' && p.name !== 'submission_files' && p.name !== 'html_file' && p.name !== 'js_file'
        );
        const nodeLabel = nodeCustomName.trim() || test.displayName;
        const buttonText = editingNode ? 'Atualizar Teste' : 'Adicionar Teste';

        return (
            <div className='w-1/2 ml-4 p-4 overflow-y-auto'>
                <h4 className="text-lg font-bold mb-2 text-indigo-400 flex items-center">
                    <Settings className="w-5 h-5 mr-2"/> {editingNode ? 'Editando' : 'Configurar'}: {nodeLabel}
                </h4>
                <p className="text-gray-400 mb-4 text-sm">{test.description}</p>
                <div className='mb-4 p-3 bg-gray-700 rounded-lg'>
                    <p className='text-xs font-semibold text-gray-300'>Arquivo Requerido: <span className='text-yellow-400'>{test.required_file || 'N/A'}</span></p>
                </div>
                
                <form onSubmit={handleFormSubmit} className='space-y-4'>
                    
                    {/* Campo de Nome Customizado (Apenas em Edição/Criação) */}
                    <div className='pb-2'>
                        <label className="block text-gray-300 text-sm font-semibold mb-1">
                            Nome do Teste
                        </label>
                         <input
                            type="text"
                            value={nodeCustomName}
                            onChange={(e) => setNodeCustomName(e.target.value)}
                            placeholder={test.displayName}
                            className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <h5 className="text-sm font-bold text-gray-300 pt-2 border-t border-gray-700">Parâmetros ({userConfigurableParameters.length})</h5>

                    {userConfigurableParameters.length === 0 ? (
                        <p className="text-green-500 text-sm">Este teste não requer parâmetros.</p>
                    ) : (
                        userConfigurableParameters.map(p => (
                            <div key={p.name}>
                                <label className="block text-gray-300 text-sm font-semibold mb-1">
                                    {p.description}
                                </label>
                                <input
                                    type={getInputType(p.type)}
                                    min={p.type === 'integer' || p.type === 'number' ? 0 : undefined}
                                    step={p.type === 'number' ? 'any' : undefined}
                                    // CORRIGIDO: Garantindo que o valor seja o retorno da função, não undefined
                                    value={getInputValue(p.name, p.type)}
                                    onChange={(e) => handleChange(p.name, e.target.value, p.type)}
                                    placeholder={p.type === 'list of strings' ? 'Separado por vírgulas (ex: "div, p, h1")' : ''}
                                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <p className='text-xs text-gray-500 mt-1'>Tipo esperado: `{p.type}`</p>
                            </div>
                        ))
                    )}
                    
                    <div className="flex justify-end pt-4 space-x-3">
                        {testTemplate && (
                             <button
                                type="button"
                                onClick={() => setCurrentTestConfig(null)} // Volta para a área de drop
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition duration-150 text-sm"
                            >
                                Limpar / Voltar
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 text-sm"
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        );
    };


    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col border border-indigo-600 animate-in fade-in zoom-in duration-300">
                
                <div className='flex justify-between items-center mb-4 border-b border-gray-700 pb-3'>
                    <h3 className="text-xl font-bold text-indigo-400 flex items-center">
                        <Library className="w-5 h-5 mr-2"/> Biblioteca de Testes
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150 text-sm"
                    >
                        Fechar
                    </button>
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                    
                    {/* Lista de Testes Disponíveis (Lado Esquerdo) */}
                    <div className="w-1/2 p-3 overflow-y-auto border-r border-gray-700 space-y-4">
                        {Object.entries(groupedTests).map(([type, tests]) => (
                            <div key={type}>
                                <h4 className="text-sm font-semibold text-gray-300 uppercase mb-2 border-b border-gray-700 pb-1">{type}</h4>
                                <div className="space-y-2">
                                    {tests.map(test => (
                                        <div
                                            key={test.name}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, test)}
                                            className="cursor-grab p-3 bg-gray-700 rounded-lg shadow-sm hover:bg-gray-600 transition duration-150 border border-gray-600"
                                        >
                                            <p className="font-semibold text-sm text-indigo-300">{test.displayName || test.name.replace(/_/g, ' ').toUpperCase()}</p>
                                            <p className="text-xs text-gray-400 mt-1">{test.description}</p>
                                            <p className='text-xs text-yellow mt-1 font-mono'>Arquivo: {test.required_file || 'Project Structure'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Área de Drop / Configuração (Lado Direito) */}
                    {renderConfigPanel()}

                </div>

            </div>
        </div>
    );
};


// --- FUNÇÕES DE LÓGICA DE NÓS (RECURSIVAS) ---

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
const TreeNode = ({ node, level, onAddChild, onRemoveNode, onWeightChange, totalChildWeight, onEditTest }) => {
  const isLeaf = node.children === null || node.children.length === 0;
  const canAddChild = node.children !== null; 
  
  // State for showing weight input
  const [showWeightInput, setShowWeightInput] = useState(false);
  
  const isCategoryNode = level === 0;
  const isSubjectNode = node.children !== null && level > 0;
  const isTestNode = node.children === null; // Nó Teste
  const canBeDeleted = level > 0; 
  
  // Determina a cor e estilo do nó
  const getStyling = (id, isCategory, isSubject, isTest) => {
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

  const handleWeightChange = (e) => {
      const value = e.target.value;
      onWeightChange(node.id, value);
  };

  const addChildTitle = () => {
    return isCategoryNode ? "Adicionar Tema (1º nível)" : "Adicionar Sub-Tema ou Teste";
  };
  
  // --- Lógica de Classificação dos Filhos ---
  const sortedChildren = node.children ? [...node.children].sort((a, b) => {
    if (a.children !== null && b.children === null) return -1; 
    if (a.children === null && b.children !== null) return 1;
    return 0;
  }) : [];
  
  // --- Renderização do Nome e Título do Teste ---
  const getDisplayName = () => {
    if (isTestNode && node.metadata) {
        const testTemplate = MOCK_TEST_LIBRARY_FLAT.find(t => t.name === node.metadata.functionName);
        const testDisplayName = testTemplate?.displayName || node.metadata.functionName;
        // Nome customizado + (Título do Teste)
        return `${node.name.replace(/\s\(Teste\)/, '')} (${testDisplayName})`;
    }
    return node.name;
  };
  
  const handleNodeClick = () => {
      if (isTestNode) {
          onEditTest(node.id, node.name);
      }
  }


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
                setShowWeightInput(!showWeightInput);
              }
            }}
          >
            <span>{getDisplayName()}</span>
            
            {/* Peso para categorias Base/Bonus/Penalty */}
            {isCategoryNode && (
              node.id === 'base' ? (
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-green-400">100</span>
              ) : (
                showWeightInput ? (
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    dir="ltr"
                    value={node.weight === 0 ? '' : node.weight}
                    onChange={handleWeightChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setShowWeightInput(false);
                      }
                    }}
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
          
          {/* INPUT DE PESO (Apenas para Temas/Sujeitos que não são categoria e não são testes) */}
          {(canBeDeleted && !isTestNode && !isCategoryNode) && (
            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                dir="ltr"
                value={node.weight === 0 ? '' : node.weight}
                onChange={handleWeightChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.target.blur();
                  }
                }}
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
                onClick={(e) => { e.stopPropagation(); onAddChild(node.id); }}
                title={addChildTitle()}
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            {/* Remover Nó (Apenas para nós criados pelo usuário - nível > 0) */}
            {canBeDeleted && (
              <button
                className="text-red-500 hover:text-red-400 transition duration-150"
                onClick={(e) => { e.stopPropagation(); onRemoveNode(node.id); }}
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
const CriteriaForm = () => {
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
  // --- Fim dos Novos estados ---


  // Calcula a soma dos pesos de cada categoria L0 (memoization)
  const categoryWeights = useMemo(() => {
    const sums = {};
    treeData.forEach(category => {
        sums[category.id] = calculateChildWeights(category);
    });
    return sums;
  }, [treeData]);

  // --- LÓGICA DE NÓS (CRUD) ---
  const addChildNode = (nodes, parentId, newNode) => {
    return nodes.map((node) => {
      if (node.id === parentId) {
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
  
  const updateExistingNode = (nodes, targetId, updatedData) => {
    return nodes.map(node => {
      if (node.id === targetId) {
        // Encontra o template para atualizar o displayName
        const testTemplate = MOCK_TEST_LIBRARY_FLAT.find(t => t.name === updatedData.functionName);
        const name = `${updatedData.name.trim() || testTemplate?.displayName || updatedData.functionName} (Teste)`;

        return {
          ...node,
          name: name,
          weight: updatedData.weight,
          metadata: {
              functionName: updatedData.functionName,
              calls: updatedData.calls,
              description: updatedData.description,
              required_file: updatedData.required_file
          },
        };
      }
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: updateExistingNode(node.children, targetId, updatedData),
        };
      }
      return node;
    });
  };


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
  
  const updateNodeWeight = (nodes, targetId, newWeight) => {
    return nodes.map(node => {
        if (node.id === targetId) {
            let weightValue = Math.max(0, parseFloat(newWeight) || 0);

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
        setTreeData(prevTree => updateExistingNode(prevTree, editingNode.id, updatedNodeData));
    } else {
        // Modo Criação: Cria um novo nó
        const newId = `node-${selectedParentId}-${nodeCount}`; 
        const testTemplate = MOCK_TEST_LIBRARY_FLAT.find(t => t.name === testData.functionName);

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
      
      if (isCreatingTest && hasExistingSubSubjects) {
          alert("Erro: Este Tema já contém Sub-Temas aninhados. Os Testes devem ser adicionados dentro do último Sujeito aninhado.");
          return;
      }
      if (isCreatingSubject && hasExistingTests) {
          alert("Erro: Este Tema já contém Testes. Um Tema só pode conter ou Testes ou Sub-Temas, mas não ambos.");
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
      name: newNodeName.trim() + (isCategoryParent ? '' : ` (Sujeito)`),
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

  // --- Funções Save/Cancel que usam o estado da árvore (Corpo do Arquivo) ---

  const handleSaveCriteria = () => {
    // A lógica de transformação para o formato backend deve ir aqui
    // (Omitida para manter o foco no frontend)
    
    // Simulação de salvamento
    
    // Trigger celebration animation
    // ... animation logic ...
    
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
    // Lógica para reverter ou limpar o estado de "salvo"
    setIsSaved(false);
  };
  
  // Variáveis para animação de salvar (Mockadas para evitar erro)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [saveButtonAnimation, setSaveButtonAnimation] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const handleRemoveNode = (targetId) => {
    setTreeData((prevTree) => removeNode(prevTree, targetId));
  };


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
                        <span className="font-semibold text-sm">Tema/Sujeito</span>
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
        {isLibraryOpen && (
            <TestLibraryModal 
                onClose={closeAllModals} 
                initialName={initialName}
                parentNodeId={selectedParentId}
                // Se editingNode existe, passamos o nó para o modo Edição
                editingNode={editingNode} 
                onSaveTest={handleSaveTest}
                onUpdateTest={(nodeId, testData) => {
                    setTreeData(prevTree => updateExistingNode(prevTree, nodeId, testData));
                    closeAllModals();
                }}
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
              />
            ))}
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default CriteriaForm;
