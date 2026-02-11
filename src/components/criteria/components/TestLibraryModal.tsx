/**
 * @fileoverview Modal for configuring test parameters from the test library.
 * @module components/criteria/components/TestLibraryModal
 */

import React, { useState, useEffect, useMemo, FormEvent, DragEvent } from 'react';
import { Library } from 'lucide-react';
import { toast } from 'react-toastify';
import { TreeNode, TestLibrary, TestTemplate, TestParameter } from '../utils';
import TestLibraryList from './TestLibraryList';
import TestDropZone from './TestDropZone';
import TestConfigForm from './TestConfigForm';

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
 * Props for the TestLibraryModal component.
 * @interface TestLibraryModalProps
 */
interface TestLibraryModalProps {
    /** Callback to close the modal */
    onClose: () => void;
    /** Initial name value for the test */
    initialName: string;
    /** Node being edited (null for creation mode) */
    editingNode: TreeNode | null;
    /** Callback for saving a new test */
    onSaveTest: (testData: TestData) => void;
    /** Callback for updating an existing test */
    onUpdateTest: (nodeId: string, testData: TestData) => void;
    /** Test library containing available tests */
    testLibrary: TestLibrary | null;
}

/**
 * TestLibraryModal - Modal for selecting and configuring tests from the library.
 * 
 * @description Comprehensive modal with two modes:
 * 1. Creation: Browse and drag tests to configure them
 * 2. Editing: Modify existing test parameters
 * 
 * Features:
 * - Drag-and-drop test selection
 * - Dynamic parameter form generation based on test template
 * - Parameter validation (required fields, type checking)
 * - Support for various parameter types (string, number, list, dictionary)
 * - Custom test naming
 * 
 * @example
 * ```tsx
 * <TestLibraryModal
 *   onClose={closeModal}
 *   initialName="My Test"
 *   editingNode={null}
 *   onSaveTest={(data) => saveTest(data)}
 *   onUpdateTest={(id, data) => updateTest(id, data)}
 *   testLibrary={library}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered TestLibraryModal component
 */
const TestLibraryModal: React.FC<TestLibraryModalProps> = ({ 
    onClose, 
    initialName, 
    editingNode, 
    onSaveTest, 
    onUpdateTest, 
    testLibrary 
}) => {
    // State management
    const [currentTestConfig, setCurrentTestConfig] = useState<TestTemplate | null>(null);
    const [isDropping, setIsDropping] = useState<boolean>(false);
    const [params, setParams] = useState<Record<string, unknown>>({});
    const [nodeCustomName, setNodeCustomName] = useState<string>(initialName);

    // Get flat test list
    const testLibraryFlat = useMemo<TestTemplate[]>(() => testLibrary?.tests || [], [testLibrary]);

    // Determine the complete template
    const testTemplate = useMemo<TestTemplate | null>(() => {
        let nameToFind: string | null = null;
        
        if (editingNode && editingNode.metadata) {
            nameToFind = editingNode.metadata.functionName;
        } else if (currentTestConfig) {
            nameToFind = currentTestConfig.name;
        }

        return nameToFind ? testLibraryFlat.find(t => t.name === nameToFind) || null : null;
    }, [editingNode, currentTestConfig, testLibraryFlat]);

    // Load parameters when template changes
    useEffect(() => {
        if (editingNode && !currentTestConfig) {
            const initialTestName = editingNode.metadata?.functionName;
            const testBase = testLibraryFlat.find(t => t.name === initialTestName);
            setCurrentTestConfig(testBase || null);
        }
        
        if (testTemplate) {
            const initialCustomName = editingNode 
                ? editingNode.name.replace(/\s\(Teste\)\s\(.*\)/, '').trim() 
                : initialName;
            setNodeCustomName(initialCustomName);

            const initialParams: Record<string, unknown> = {};
            
            testTemplate.parameters.forEach((p: TestParameter) => {
                const paramName = p.name;
                const paramType = p.type;
                
                if (editingNode) {
                    const nodeCalls = editingNode.metadata?.calls[0] || [];
                    const paramIndex = testTemplate.parameters.findIndex(tp => tp.name === p.name);
                    const nodeValue = nodeCalls[paramIndex];
                    
                    if (nodeValue !== undefined) {
                        initialParams[paramName] = nodeValue;
                        return;
                    }
                }
                
                if (p.defaultValue !== undefined) {
                    initialParams[paramName] = p.defaultValue;
                } else {
                    initialParams[paramName] = (paramType === 'integer' || paramType === 'number') ? 0 : '';
                }
            });
            
            setParams(initialParams);
        } else {
            setParams({});
            setNodeCustomName(initialName);
        }
    }, [testTemplate, editingNode, initialName, testLibraryFlat, currentTestConfig]);

    // Parameter handling
    const handleChange = (id: string, value: string, type: string): void => {
        let parsedValue: unknown = value;
        if (type === 'integer' || type === 'number') {
            parsedValue = value === '' ? '' : parseFloat(value);
        }
        setParams(prev => ({ ...prev, [id]: parsedValue }));
    };

    const getInputValue = (id: string, type: string): string => {
        const value = params[id];
        if (value === undefined || value === null) return '';

        if (type === 'list of strings' && Array.isArray(value)) {
            return value.join(', ');
        }
        return String(value);
    };
    
    // Form submission
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        
        if (!testTemplate) return;
        
        // Parse list parameters
        const parsedParams: Record<string, unknown> = { ...params };
        testTemplate.parameters.forEach((p: TestParameter) => {
            if (p.type === 'list of strings' && typeof parsedParams[p.name] === 'string') {
                parsedParams[p.name] = (parsedParams[p.name] as string)
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
            }
        });
        
        // Validate required parameters
        const requiredParams = testTemplate.parameters.filter(p => p.type !== 'dictionary');
        
        for (const p of requiredParams) {
            if (parsedParams[p.name] === '' || parsedParams[p.name] === null || 
                parsedParams[p.name] === undefined || 
                (p.type === 'list of strings' && Array.isArray(parsedParams[p.name]) && 
                (parsedParams[p.name] as unknown[]).length === 0)) {
                toast.error(`O parâmetro '${p.description}' é obrigatório.`);
                return;
            }
            if ((p.type === 'integer' || p.type === 'number') && isNaN(parsedParams[p.name] as number)) {
                toast.error(`O parâmetro '${p.description}' deve ser um número.`);
                return;
            }
        }
        
        // Build calls array
        const calls: unknown[][] = [[]];
        const callArgs = testTemplate.parameters.map((p: TestParameter) => {
            if (p.type !== 'dictionary' && p.name !== 'submission_files' && 
                p.name !== 'html_file' && p.name !== 'js_file') {
                return parsedParams[p.name];
            }
            return null;
        }).filter(arg => arg !== null);

        calls[0] = callArgs;
        
        const testData: TestData = {
            functionName: testTemplate.name,
            calls: calls,
            name: nodeCustomName,
            description: testTemplate.description,
            required_file: testTemplate.required_file,
            displayName: testTemplate.displayName,
            weight: editingNode?.weight || 0
        };
        
        if (editingNode) {
            onUpdateTest(editingNode.id, testData);
        } else {
            onSaveTest(testData);
        }
    };
    
    // Drag & Drop handlers
    const handleDragStart = (e: DragEvent<HTMLDivElement>, test: TestTemplate): void => {
        e.dataTransfer.setData('application/json', JSON.stringify(test));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDropping(false);
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json')) as TestTemplate;
            setCurrentTestConfig(data);
        } catch {
            toast.error("Erro ao selecionar o teste. Tente novamente.");
        }
    };

    // Group tests by type
    const groupedTests = testLibraryFlat.reduce<Record<string, TestTemplate[]>>((acc, test) => {
        const type = test.type_tag || test.required_file || 'Outros';
        if (!acc[type]) acc[type] = [];
        acc[type].push(test);
        return acc;
    }, {});
    
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col border border-indigo-600 animate-in fade-in zoom-in duration-300">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                    <h3 className="text-xl font-bold text-indigo-400 flex items-center">
                        <Library className="w-5 h-5 mr-2" /> Biblioteca de Testes
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150 text-sm"
                    >
                        Fechar
                    </button>
                </div>
                
                {/* Modal Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Test Library List */}
                    <TestLibraryList
                        groupedTests={groupedTests}
                        onDragStart={handleDragStart}
                    />

                    {/* Drop Zone or Config Form */}
                    {!testTemplate ? (
                        <TestDropZone
                            isDropping={isDropping}
                            targetName={initialName}
                            onDragEnter={() => setIsDropping(true)}
                            onDragLeave={() => setIsDropping(false)}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        />
                    ) : (
                        <TestConfigForm
                            testTemplate={testTemplate}
                            customName={nodeCustomName}
                            params={params}
                            isEditing={!!editingNode}
                            onNameChange={setNodeCustomName}
                            onParamChange={handleChange}
                            getParamValue={getInputValue}
                            onSubmit={handleFormSubmit}
                            onClear={() => setCurrentTestConfig(null)}
                        />
                    )}
                </div>

            </div>
        </div>
    );
};

export default TestLibraryModal;
