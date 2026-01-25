// Types for the criteria tree structure
export interface TestMetadata {
    functionName: string;
    calls: unknown[][];
    description?: string;
    required_file?: string;
}

export interface TreeNode {
    id: string;
    name: string;
    children: TreeNode[] | null;
    weight: number;
    metadata?: TestMetadata;
}

export interface TestParameter {
    name: string;
    type: 'string' | 'integer' | 'number' | 'boolean' | 'list of strings' | 'dictionary';
    description?: string;
    defaultValue?: unknown;
    required?: boolean;
}

export interface TestTemplate {
    name: string;
    displayName: string;
    description: string;
    parameters: TestParameter[];
    required_file?: string;
    type_tag?: string;
}

export interface TestLibrary {
    name: string;
    tests: TestTemplate[];
}

// Backend format types
export interface BackendTest {
    name: string;
    file: string;
    calls: unknown[][];
}

export interface BackendCategory {
    weight: number;
    subjects?: Record<string, BackendCategory>;
    tests?: BackendTest[];
}

export interface BackendCriteriaFormat {
    base?: BackendCategory;
    bonus?: BackendCategory;
    penalty?: BackendCategory;
}

// Função auxiliar para encontrar o nó por ID (necessário para a validação)
export const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
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

// Função auxiliar para encontrar o pai de um nó
export const findParentOfNode = (nodes: TreeNode[], targetId: string, parent: TreeNode | null = null): TreeNode | null => {
    for (const node of nodes) {
        if (node.id === targetId) {
            return parent;
        }
        if (node.children) {
            const found = findParentOfNode(node.children, targetId, node);
            if (found !== null) return found;
        }
    }
    return null;
};

// Função auxiliar para calcular a soma dos pesos dos filhos de QUALQUER nó
export const calculateChildWeights = (node: TreeNode): number => {
    if (!node.children || node.children.length === 0) {
        return 0;
    }
    // Soma os pesos (garantindo que o peso seja um número)
    return node.children.reduce((acc, child) => acc + (parseFloat(String(child.weight)) || 0), 0);
};

// Adiciona um novo nó filho
export const addChildNode = (nodes: TreeNode[], parentId: string, newNode: TreeNode): TreeNode[] => {
    return nodes.map((node) => {
        if (node.id === parentId) {
            return {
                ...node,
                children: [...(node.children || []), newNode],
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

interface UpdatedNodeData {
    functionName: string;
    calls: unknown[][];
    name: string;
    description?: string;
    required_file?: string;
    weight?: number;
}

// Atualiza um nó existente
export const updateExistingNode = (nodes: TreeNode[], targetId: string, updatedData: UpdatedNodeData, testLibrary: TestLibrary | null): TreeNode[] => {
    return nodes.map(node => {
        if (node.id === targetId) {
            // Encontra o template para atualizar o displayName
            const testTemplate = testLibrary?.tests?.find(t => t.name === updatedData.functionName);
            const name = `${updatedData.name.trim() || testTemplate?.displayName || updatedData.functionName} (Teste)`;

            return {
                ...node,
                name: name,
                weight: updatedData.weight ?? node.weight,
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
                children: updateExistingNode(node.children, targetId, updatedData, testLibrary),
            };
        }
        return node;
    });
};

// Remove um nó
export const removeNode = (nodes: TreeNode[], targetId: string): TreeNode[] => {
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

// Atualiza o peso de um nó
export const updateNodeWeight = (nodes: TreeNode[], targetId: string, newWeight: string | number): TreeNode[] => {
    return nodes.map(node => {
        if (node.id === targetId) {
            let weightValue = Math.max(0, parseFloat(String(newWeight)) || 0);

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

// Helper function to map file types
const mapRequiredFile = (requiredFile: string | undefined): string => {
    if (requiredFile === 'HTML') return 'index.html';
    if (requiredFile === 'CSS') return 'styles.css';
    if (requiredFile === 'JavaScript') return 'index.js';
    return requiredFile || '';
};

// Transform tree data to backend format
export const transformTreeToBackendFormat = (nodes: TreeNode[]): BackendCriteriaFormat => {
    const result: BackendCriteriaFormat = {};
    
    // Helper function to process children recursively
    const processNode = (node: TreeNode): BackendCategory | null => {
        // If node has no children (leaf/test node), return null
        if (node.children === null || (Array.isArray(node.children) && node.children.length === 0 && node.metadata)) {
            return null;
        }
        
        // If node has children, process them
        const subjects: Record<string, BackendCategory> = {};
        const tests: BackendTest[] = [];
        
        node.children?.forEach(child => {
            // Check if this is a test node (has metadata)
            if (child.metadata) {
                // This is a test node - add to tests array
                const fileName = mapRequiredFile(child.metadata.required_file);
                
                const testObj: BackendTest = {
                    name: child.metadata.functionName,
                    file: fileName,
                    calls: child.metadata.calls || [[]]
                };
                tests.push(testObj);
            } else {
                // This is a subject node - recursively process it
                const childName = child.name.replace(/\s\(Sujeito\)/, '').trim().toLowerCase().replace(/\s+/g, '_');
                const childData = processNode(child);
                
                if (childData) {
                    subjects[childName] = childData;
                } else {
                    // Leaf subject with only tests
                    const leafTests: BackendTest[] = [];
                    
                    if (child.children && child.children.length > 0) {
                        child.children.forEach(testChild => {
                            if (testChild.metadata) {
                                const fileName = mapRequiredFile(testChild.metadata.required_file);
                                
                                const testObj: BackendTest = {
                                    name: testChild.metadata.functionName,
                                    file: fileName,
                                    calls: testChild.metadata.calls || [[]]
                                };
                                leafTests.push(testObj);
                            }
                        });
                    }
                    
                    subjects[childName] = {
                        weight: parseFloat(String(child.weight)) || 0,
                        tests: leafTests
                    };
                }
            }
        });
        
        // Build the return object
        const nodeData: BackendCategory = {
            weight: parseFloat(String(node.weight)) || 0
        };
        
        // Add subjects if there are any
        if (Object.keys(subjects).length > 0) {
            nodeData.subjects = subjects;
        }
        
        // Add tests if there are any
        if (tests.length > 0) {
            nodeData.tests = tests;
        }
        
        return nodeData;
    };
    
    // Process each top-level category (base, bonus, penalty)
    nodes.forEach(category => {
        const categoryData = processNode(category);
        
        // Only include the category if it has content
        if (categoryData) {
            const isEmpty = !categoryData.subjects && !categoryData.tests;
            const isBonusOrPenalty = category.id === 'bonus' || category.id === 'penalty';
            
            // Include base always, but only include bonus/penalty if they have content
            if (!isBonusOrPenalty || !isEmpty) {
                result[category.id as keyof BackendCriteriaFormat] = categoryData;
            }
        }
    });
    
    return result;
};
