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
                const testName = child.metadata.functionName;
                const calls = child.metadata.calls;
                
                // Check if this test has parameters (calls with values)
                if (calls && calls.length > 0 && calls[0].length > 0) {
                    // Parameterized test format: { "test_name": [[params]] }
                    tests.push({
                        [testName]: calls
                    });
                } else {
                    // Simple test format: "test_name"
                    tests.push(testName);
                }
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
                                const testName = testChild.metadata.functionName;
                                const calls = testChild.metadata.calls;
                                
                                if (calls && calls.length > 0 && calls[0].length > 0) {
                                    leafTests.push({
                                        [testName]: calls
                                    });
                                } else {
                                    leafTests.push(testName);
                                }
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
        if (categoryData) {
            result[category.id] = categoryData;
        }
    });
    
    return result;
};
