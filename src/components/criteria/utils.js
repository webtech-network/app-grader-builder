// Função auxiliar para encontrar o nó por ID (necessário para a validação)
export const findNodeById = (nodes, id) => {
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
export const findParentOfNode = (nodes, targetId, parent = null) => {
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
export const calculateChildWeights = (node) => {
    if (!node.children || node.children.length === 0) {
        return 0;
    }
    // Soma os pesos (garantindo que o peso seja um número)
    return node.children.reduce((acc, child) => acc + (parseFloat(child.weight) || 0), 0);
};

// Adiciona um novo nó filho
export const addChildNode = (nodes, parentId, newNode) => {
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

// Atualiza um nó existente
export const updateExistingNode = (nodes, targetId, updatedData, testLibrary) => {
    return nodes.map(node => {
        if (node.id === targetId) {
            // Encontra o template para atualizar o displayName
            const testTemplate = testLibrary?.tests?.find(t => t.name === updatedData.functionName);
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
                children: updateExistingNode(node.children, targetId, updatedData, testLibrary),
            };
        }
        return node;
    });
};

// Remove um nó
export const removeNode = (nodes, targetId) => {
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
export const updateNodeWeight = (nodes, targetId, newWeight) => {
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

// Transform tree data to backend format
export const transformTreeToBackendFormat = (nodes) => {
    const result = {};
    
    // Helper function to process children recursively
    const processNode = (node) => {
        // If node has no children (leaf/test node), return null
        if (node.children === null || (Array.isArray(node.children) && node.children.length === 0 && node.metadata)) {
            return null;
        }
        
        // If node has children, process them
        const subjects = {};
        const tests = [];
        
        node.children.forEach(child => {
            // Check if this is a test node (has metadata)
            if (child.metadata) {
                // This is a test node - add to tests array
                // Map generic file types to specific filenames
                let fileName = '';
                const requiredFile = child.metadata.required_file;
                if (requiredFile === 'HTML') {
                    fileName = 'index.html';
                } else if (requiredFile === 'CSS') {
                    fileName = 'styles.css';
                } else if (requiredFile === 'JavaScript') {
                    fileName = 'index.js';
                } else {
                    fileName = requiredFile || '';
                }
                
                const testObj = {
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
                    const leafTests = [];
                    
                    if (child.children && child.children.length > 0) {
                        child.children.forEach(testChild => {
                            if (testChild.metadata) {
                                // Map generic file types to specific filenames
                                let fileName = '';
                                const requiredFile = testChild.metadata.required_file;
                                if (requiredFile === 'HTML') {
                                    fileName = 'index.html';
                                } else if (requiredFile === 'CSS') {
                                    fileName = 'styles.css';
                                } else if (requiredFile === 'JavaScript') {
                                    fileName = 'index.js';
                                } else {
                                    fileName = requiredFile || '';
                                }
                                
                                const testObj = {
                                    name: testChild.metadata.functionName,
                                    file: fileName,
                                    calls: testChild.metadata.calls || [[]]
                                };
                                leafTests.push(testObj);
                            }
                        });
                    }
                    
                    subjects[childName] = {
                        weight: parseFloat(child.weight) || 0,
                        tests: leafTests
                    };
                }
            }
        });
        
        // Build the return object
        const nodeData = {
            weight: parseFloat(node.weight) || 0
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
        // For bonus and penalty, skip if they're empty (no subjects and no tests)
        if (categoryData) {
            const isEmpty = !categoryData.subjects && !categoryData.tests;
            const isBonusOrPenalty = category.id === 'bonus' || category.id === 'penalty';
            
            // Include base always, but only include bonus/penalty if they have content
            if (!isBonusOrPenalty || !isEmpty) {
                result[category.id] = categoryData;
            }
        }
    });
    
    return result;
};
