import React, { useState, useEffect, useMemo } from 'react';
import { Settings, Library } from 'lucide-react';
import { toast } from 'react-toastify';

const TestLibraryModal = ({ onClose, initialName, editingNode, onSaveTest, onUpdateTest, testLibrary }) => {
    
    // Armazena o objeto do teste sendo configurado
    const [currentTestConfig, setCurrentTestConfig] = useState(null); 
    const [isDropping, setIsDropping] = useState(false);
    const [params, setParams] = useState({});
    const [nodeCustomName, setNodeCustomName] = useState(initialName);

    // Get the flat list of tests from the library
    const testLibraryFlat = testLibrary?.tests || [];

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

        return nameToFind ? testLibraryFlat.find(t => t.name === nameToFind) || null : null;
    }, [editingNode, currentTestConfig, testLibraryFlat]);

    // 2. Efeito para carregar os parâmetros (Roda quando o templateBase muda)
    useEffect(() => {
        
        // Se estiver no modo edição, inicializa com o template base do nó
        if (editingNode && !currentTestConfig) {
            const initialTestName = editingNode.metadata.functionName;
            const testBase = testLibraryFlat.find(t => t.name === initialTestName);
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
        }
        // For 'list of strings', keep the raw string value during editing
        // It will be parsed only when submitting the form
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

        // For 'list of strings', keep the raw string during editing
        // If it's already an array (from loaded data), convert to string
        if (type === 'list of strings' && Array.isArray(value)) {
            return value.join(', ');
        }
        return value;
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (!testTemplate) return;
        
        // Parse 'list of strings' parameters before validation
        const parsedParams = { ...params };
        testTemplate.parameters.forEach(p => {
            if (p.type === 'list of strings' && typeof parsedParams[p.name] === 'string') {
                parsedParams[p.name] = parsedParams[p.name]
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
            }
        });
        
        // 2. Validação de campos obrigatórios
        const requiredParams = testTemplate.parameters.filter(p => p.type !== 'dictionary');
        
            for (const p of requiredParams) {
            // Checa se o campo está vazio ou se é NaN para números
            if (parsedParams[p.name] === '' || parsedParams[p.name] === null || parsedParams[p.name] === undefined || 
                (p.type === 'list of strings' && (Array.isArray(parsedParams[p.name]) && parsedParams[p.name].length === 0))) {
                toast.error(`O parâmetro '${p.description}' é obrigatório.`);
                return;
            }
            if ((p.type === 'integer' || p.type === 'number') && isNaN(parsedParams[p.name])) {
                toast.error(`O parâmetro '${p.description}' deve ser um número.`);
                return;
            }
        }        // 3. Mapeamento de Parâmetros para Calls (Formato de Argumentos)
        const calls = [[]]; 
        const callArgs = testTemplate.parameters.map(p => {
            if (p.type !== 'dictionary' && p.name !== 'submission_files' && p.name !== 'html_file' && p.name !== 'js_file') {
                return parsedParams[p.name];
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
            toast.error("Erro ao selecionar o teste. Tente novamente.");
        }
    };

    const groupedTests = testLibraryFlat.reduce((acc, test) => {
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
                                    type="text"
                                    value={getInputValue(p.name, p.type)}
                                    onChange={(e) => handleChange(p.name, e.target.value, p.type)}
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

export default TestLibraryModal;
