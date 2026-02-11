/**
 * @fileoverview Validation functions for criteria tree structure and data.
 * 
 * @description Provides comprehensive validation for the criteria tree including:
 * - Structure validation (no empty subjects)
 * - Weight sum validation (must equal 100%)
 * - Test parameter validation
 * - Bonus/penalty content validation
 * 
 * @module components/criteria/validations
 */

import { TreeNode, TestLibrary } from '../utils';

/**
 * Validates that all subjects in the tree have content (tests or sub-subjects).
 * 
 * @description Recursively checks all nodes to ensure:
 * - No empty subjects (except empty Bonus/Penalty is allowed)
 * - All subjects eventually contain tests
 * - Structure is logically valid
 * 
 * @param nodes - Array of root tree nodes (categories)
 * @returns Array of error messages (empty if valid)
 * @exports
 */
export const validateCriteriaTree = (nodes: TreeNode[]): string[] => {
    const errors: string[] = [];
    
    const validateNode = (node: TreeNode, path: string[] = [], isCategoryLevel: boolean = false): void => {
        const currentPath = [...path, node.name];
        
        // Skip validation for test nodes (leaf nodes with metadata)
        if (node.metadata || node.children === null) {
            return;
        }
        
        // Check if this is a subject node (has children array)
        if (Array.isArray(node.children)) {
            // Allow empty Bonus and Penalty categories
            if (node.children.length === 0) {
                if (isCategoryLevel && (node.id === 'bonus' || node.id === 'penalty')) {
                    // Empty bonus/penalty is allowed
                    return;
                }
                errors.push(`O tema "${currentPath.join(' > ')}" está vazio. Todos os temas devem conter pelo menos um teste ou sub-tema.`);
                return;
            }
            
            // Check if all children are also subjects (no tests)
            const hasTests = node.children.some(child => child.metadata || child.children === null);
            const hasSubjects = node.children.some(child => !child.metadata && child.children !== null);
            
            // If has subjects but no tests at this level, validate children
            if (hasSubjects && !hasTests) {
                // Check if any child subject has tests (recursively)
                let hasTestsInChildren = false;
                
                const checkChildrenForTests = (childNode: TreeNode): boolean => {
                    if (childNode.metadata || childNode.children === null) {
                        hasTestsInChildren = true;
                        return true;
                    }
                    if (Array.isArray(childNode.children) && childNode.children.length > 0) {
                        return childNode.children.some(checkChildrenForTests);
                    }
                    return false;
                };
                
                node.children.forEach(child => {
                    if (!child.metadata && child.children !== null) {
                        checkChildrenForTests(child);
                    }
                });
                
                if (!hasTestsInChildren) {
                    errors.push(`O tema "${currentPath.join(' > ')}" não possui testes. Todos os temas devem eventualmente conter testes.`);
                }
            }
            
            // Recursively validate children
            node.children.forEach(child => validateNode(child, currentPath, false));
        }
    };
    
    nodes.forEach(category => validateNode(category, [], true));
    return errors;
};

/**
 * Validates that direct children weights sum to 100% within each category.
 * 
 * @description Checks each category (Base, Bonus, Penalty) to ensure the
 * weights of immediate children sum to exactly 100% (within 0.1 tolerance).
 * Skips empty Bonus/Penalty categories.
 * 
 * @param nodes - Array of root tree nodes (categories)
 * @returns Array of error messages (empty if valid)
 * @exports
 */
export const validateWeightSum = (nodes: TreeNode[]): string[] => {
    const errors: string[] = [];
    
    nodes.forEach(category => {
        // Skip empty bonus/penalty
        if ((category.id === 'bonus' || category.id === 'penalty') && 
            (!category.children || category.children.length === 0)) {
            return;
        }
        
        // Calculate sum of direct children weights
        if (category.children && category.children.length > 0) {
            const weightSum = category.children.reduce((sum, child) => {
                return sum + (parseFloat(String(child.weight)) || 0);
            }, 0);
            
            // Check if sum is approximately 100 (allowing small floating point differences)
            if (Math.abs(weightSum - 100) > 0.1) {
                const categoryDisplayName = category.name;
                errors.push(
                    `A soma dos pesos dos temas em "${categoryDisplayName}" é ${weightSum.toFixed(1)}. Deve ser exatamente 100%.`
                );
            }
        }
    });
    
    return errors;
};

/**
 * Validates that test parameters match their template requirements.
 * 
 * @description Checks all test nodes to ensure:
 * - Correct number of parameters provided
 * - Required parameters are present
 * - Parameter types match template
 * 
 * @param nodes - Array of root tree nodes (categories)
 * @param testLib - Test library for template lookups
 * @returns Array of error messages (empty if valid)
 * @exports
 */
export const validateTestParameters = (nodes: TreeNode[], testLib: TestLibrary | null): string[] => {
    const errors: string[] = [];
    
    const validateNode = (node: TreeNode, path: string[] = []): void => {
        const currentPath = [...path, node.name];
        
        // Check if this is a test node
        if (node.metadata) {
            const testName = node.metadata.functionName;
            const testCalls = node.metadata.calls;
            
            // Find the test definition in the library
            const testDefinition = testLib?.tests?.find(t => t.name === testName);
            
            if (testDefinition) {
                // Get required parameters (excluding dictionary, submission_files, html_file, js_file)
                const requiredParams = testDefinition.parameters.filter(
                    p => p.type !== 'dictionary' && 
                         p.name !== 'submission_files' && 
                         p.name !== 'html_file' && 
                         p.name !== 'js_file'
                );
                
                const providedParamsCount = testCalls && testCalls[0] ? testCalls[0].length : 0;
                const requiredParamsCount = requiredParams.length;
                
                if (providedParamsCount !== requiredParamsCount) {
                    errors.push(
                        `O teste "${currentPath.join(' > ')}" requer ${requiredParamsCount} parâmetro(s), mas ${providedParamsCount} foi(foram) fornecido(s).`
                    );
                }
            }
        }
        
        // Recursively validate children
        if (Array.isArray(node.children)) {
            node.children.forEach(child => validateNode(child, currentPath));
        }
    };
    
    nodes.forEach(category => validateNode(category));
    return errors;
};

/**
 * Validates that Bonus/Penalty categories with weight > 0 have content.
 * 
 * @description Ensures that if a Bonus or Penalty category has a non-zero
 * weight, it must contain at least one test. Empty categories with weight > 0
 * are invalid.
 * 
 * @param nodes - Array of root tree nodes (categories)
 * @returns Array of error messages (empty if valid)
 * @exports
 */
export const validateBonusPenaltyContent = (nodes: TreeNode[]): string[] => {
    const errors: string[] = [];
    
    nodes.forEach(category => {
        // Only check bonus and penalty categories
        if (category.id !== 'bonus' && category.id !== 'penalty') {
            return;
        }
        
        const categoryWeight = parseFloat(String(category.weight)) || 0;
        
        // If weight is greater than 0, must have content
        if (categoryWeight > 0) {
            const isEmpty = !category.children || category.children.length === 0;
            
            if (isEmpty) {
                const categoryDisplayName = category.name;
                errors.push(
                    `A categoria "${categoryDisplayName}" tem peso ${categoryWeight}, mas não possui conteúdo. Adicione pelo menos um tema e um teste.`
                );
                return;
            }
            
            // Check if there's at least one test in the entire tree
            const hasTests = (node: TreeNode): boolean => {
                if (node.metadata || node.children === null) {
                    return true; // This is a test node
                }
                if (Array.isArray(node.children) && node.children.length > 0) {
                    return node.children.some(child => hasTests(child));
                }
                return false;
            };
            
            const categoryHasTests = category.children.some(child => hasTests(child));
            
            if (!categoryHasTests) {
                const categoryDisplayName = category.name;
                errors.push(
                    `A categoria "${categoryDisplayName}" tem peso ${categoryWeight}, mas não possui testes. Adicione pelo menos um teste.`
                );
            }
        }
    });
    
    return errors;
};
