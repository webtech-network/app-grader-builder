/**
 * @fileoverview Utility functions and types for criteria tree management.
 * 
 * @description Provides type definitions for the criteria tree structure,
 * tree manipulation functions (CRUD operations), and backend transformation
 * utilities. Handles the complex tree operations and data transformations
 * needed for the criteria builder.
 * 
 * @module components/criteria/utils
 */

// ============================================================================
//  TYPE DEFINITIONS
// ============================================================================

/**
 * Metadata for test nodes containing evaluation logic.
 * @interface TestMetadata
 * @exports
 */
export interface TestMetadata {
    /** Internal function name from the test library */
    functionName: string;
    /** Array of test parameter arrays (usually one call) */
    calls: unknown[][];
    /** Optional test description */
    description?: string;
    /** Required file type (HTML, CSS, JavaScript) */
    required_file?: string;
}

/**
 * Represents a node in the criteria tree hierarchy.
 * @interface TreeNode
 * @exports
 */
export interface TreeNode {
    /** Unique identifier for the node */
    id: string;
    /** Display name of the node */
    name: string;
    /** Child nodes array (null for test/leaf nodes) */
    children: TreeNode[] | null;
    /** Weight percentage (0-100) */
    weight: number;
    /** Test metadata (only present for test nodes) */
    metadata?: TestMetadata;
}

/**
 * Parameter definition for a test template.
 * @interface TestParameter
 * @exports
 */
export interface TestParameter {
    /** Parameter name/identifier */
    name: string;
    /** Parameter data type */
    type: 'string' | 'integer' | 'number' | 'boolean' | 'list of strings' | 'dictionary';
    /** Optional description of the parameter */
    description?: string;
    /** Default value for the parameter */
    defaultValue?: unknown;
    /** Whether the parameter is required */
    required?: boolean;
}

/**
 * Test template definition from the library.
 * @interface TestTemplate
 * @exports
 */
export interface TestTemplate {
    /** Internal function name */
    name: string;
    /** Human-readable display name */
    displayName: string;
    /** Description of what the test validates */
    description: string;
    /** Array of parameter definitions */
    parameters: TestParameter[];
    /** Required file type (HTML, CSS, JS) */
    required_file?: string;
    /** Type tag for categorization */
    type_tag?: string;
}

/**
 * Test library container with metadata.
 * @interface TestLibrary
 * @exports
 */
export interface TestLibrary {
    /** Library name/identifier */
    name: string;
    /** Array of available test templates */
    tests: TestTemplate[];
}

// ============================================================================
//  BACKEND FORMAT TYPES
// ============================================================================

/**
 * Backend test format (simplified from frontend TreeNode).
 * @interface BackendTest
 * @exports
 */
export interface BackendTest {
    /** Test function name */
    name: string;
    /** Required file name (e.g., 'index.html') */
    file: string;
    /** Array of parameter calls */
    calls: unknown[][];
}

/**
 * Backend category format (recursive structure).
 * @interface BackendCategory
 * @exports
 */
export interface BackendCategory {
    /** Category/subject weight percentage */
    weight: number;
    /** Nested subjects/themes (recursive) */
    subjects?: Record<string, BackendCategory>;
    /** Tests at this level */
    tests?: BackendTest[];
}

/**
 * Complete backend criteria format with three categories.
 * @interface BackendCriteriaFormat
 * @exports
 */
export interface BackendCriteriaFormat {
    /** Base criteria (required, weighted at 100%) */
    base?: BackendCategory;
    /** Bonus criteria (extra credit) */
    bonus?: BackendCategory;
    /** Penalty criteria (deductions) */
    penalty?: BackendCategory;
}

// ============================================================================
//  TREE SEARCH & ACCESS FUNCTIONS
// ============================================================================

/**
 * Recursively finds a node by its ID in the tree.
 * 
 * @param nodes - Array of tree nodes to search
 * @param id - Node ID to find
 * @returns The found node or null
 * @exports
 */
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

/**
 * Recursively finds the parent node of a target node.
 * 
 * @param nodes - Array of tree nodes to search
 * @param targetId - ID of the node whose parent to find
 * @param parent - Current parent node in recursion
 * @returns The parent node or null
 * @exports
 */
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

/**
 * Calculates the sum of all direct children weights.
 * 
 * @param node - The parent node to calculate for
 * @returns Sum of children weights (0-100+)
 * @exports
 */
export const calculateChildWeights = (node: TreeNode): number => {
    if (!node.children || node.children.length === 0) {
        return 0;
    }
    // Soma os pesos (garantindo que o peso seja um número)
    return node.children.reduce((acc, child) => acc + (parseFloat(String(child.weight)) || 0), 0);
};

// ============================================================================
//  TREE MODIFICATION FUNCTIONS (CRUD)
// ============================================================================

/**
 * Adds a new child node to a parent node in the tree.
 * 
 * @param nodes - Array of tree nodes
 * @param parentId - ID of the parent node
 * @param newNode - New node to add
 * @returns Updated tree array
 * @exports
 */
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

/**
 * Data structure for updating test nodes.
 * @interface UpdatedNodeData
 */
interface UpdatedNodeData {
    /** Test function name */
    functionName: string;
    /** Parameter call arrays */
    calls: unknown[][];
    /** Custom display name */
    name: string;
    /** Test description */
    description?: string;
    /** Required file type */
    required_file?: string;
    /** Node weight */
    weight?: number;
}

/**
 * Updates an existing test node with new configuration.
 * 
 * @param nodes - Array of tree nodes
 * @param targetId - ID of the node to update
 * @param updatedData - New data for the node
 * @param testLibrary - Test library for display name lookup
 * @returns Updated tree array
 * @exports
 */
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

/**
 * Removes a node from the tree by ID.
 * 
 * @param nodes - Array of tree nodes
 * @param targetId - ID of the node to remove
 * @returns Updated tree array with node removed
 * @exports
 */
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

/**
 * Updates the weight of a specific node.
 * 
 * @param nodes - Array of tree nodes
 * @param targetId - ID of the node to update
 * @param newWeight - New weight value (clamped to valid range)
 * @returns Updated tree array
 * @exports
 */
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

// ============================================================================
//  BACKEND TRANSFORMATION
// ============================================================================

/**
 * Maps internal file type to actual filename.
 * 
 * @param requiredFile - File type string (HTML, CSS, JavaScript)
 * @returns Actual filename or empty string
 */
const mapRequiredFile = (requiredFile: string | undefined): string => {
    if (requiredFile === 'HTML') return 'index.html';
    if (requiredFile === 'CSS') return 'styles.css';
    if (requiredFile === 'JavaScript') return 'index.js';
    return requiredFile || '';
};

/**
 * Transforms the frontend tree structure to backend API format.
 * 
 * @description Recursively converts the tree structure used in the UI
 * to the flattened format expected by the backend API. Handles:
 * - Three main categories (base, bonus, penalty)
 * - Nested subjects/themes
 * - Test nodes with metadata
 * - Weight distribution
 * 
 * @param nodes - Array of tree nodes (should be the root categories)
 * @returns Backend-formatted criteria object
 * @exports
 */
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
