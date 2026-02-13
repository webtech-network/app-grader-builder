/**
 * @fileoverview Tree node component for rendering hierarchical criteria structure.
 * @module components/criteria/components/TreeNode
 */

import React from 'react';
import { calculateChildWeights, TreeNode as TreeNodeType, TestLibrary } from '../utils';
import { useToggle } from '../../../hooks';
import { getNodeStyling } from './NodeStyling';
import NodeIcon from './NodeIcon';
import CategoryWeightDisplay from './CategoryWeightDisplay';
import WeightInput from './WeightInput';
import ProgressBar from './ProgressBar';
import NodeActions from './NodeActions';

/**
 * Props for the TreeNode component.
 * @interface TreeNodeProps
 */
interface TreeNodeProps {
    /** The tree node data to render */
    node: TreeNodeType;
    /** Depth level in the tree (0 = category, 1+ = subjects/tests) */
    level: number;
    /** Callback for adding a child node */
    onAddChild: (parentId: string) => void;
    /** Callback for removing this node */
    onRemoveNode: (nodeId: string) => void;
    /** Callback for weight value changes */
    onWeightChange: (nodeId: string, weight: string | number) => void;
    /** Sum of all direct children weights (for progress bar) */
    totalChildWeight: number;
    /** Callback for editing test configuration */
    onEditTest: (nodeId: string, nodeName: string) => void;
    /** Test library for lookups and display */
    testLibrary: TestLibrary | null;
}

/**
 * TreeNode - Renders a single node in the criteria tree with actions and children.
 * 
 * @description A recursive component that renders nodes at any level of the tree.
 * Handles categories, subjects, and tests with appropriate styling, actions,
 * and weight management. Shows progress bars for nesting levels with children.
 * 
 * @example
 * ```tsx
 * <TreeNode
 *   node={nodeData}
 *   level={0}
 *   onAddChild={handleAdd}
 *   onRemoveNode={handleRemove}
 *   onWeightChange={handleWeight}
 *   totalChildWeight={85.5}
 *   onEditTest={handleEdit}
 *   testLibrary={library}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered TreeNode component
 */
const TreeNode: React.FC<TreeNodeProps> = ({ 
    node, 
    level, 
    onAddChild, 
    onRemoveNode, 
    onWeightChange, 
    totalChildWeight, 
    onEditTest, 
    testLibrary 
}) => {
    const isLeaf = node.children === null || node.children.length === 0;
    const canAddChild = node.children !== null;
    
    // State for category weight editing
    const categoryWeightEdit = useToggle(false);
    
    // Node type determination
    const isCategoryNode = level === 0;
    const isSubjectNode = node.children !== null && level > 0;
    const isTestNode = node.children === null;
    const canBeDeleted = level > 0;
    
    // Get styling configuration
    const { className: nodeClass, textColor } = getNodeStyling(
        node.id,
        isCategoryNode,
        isSubjectNode,
        isTestNode
    );

    // Progress bar logic
    const hasNestedSubjects = canAddChild && node.children && node.children.some(child => child.children !== null);
    const showProgressBar = isCategoryNode || (isSubjectNode && hasNestedSubjects);
    
    // Display name formatting
    const getDisplayName = (): string => {
        if (isTestNode && node.metadata) {
            const testTemplate = testLibrary?.tests?.find(t => t.name === node.metadata?.functionName);
            const testDisplayName = testTemplate?.displayName || node.metadata.functionName;
            return `${node.name.replace(/\s\(Teste\)/, '')} (${testDisplayName})`;
        }
        return node.name;
    };
    
    // Event handlers
    const handleNodeClick = (): void => {
        if (isTestNode) {
            onEditTest(node.id, node.name);
        }
    };

    const handleCategoryWeightChange = (value: string): void => {
        onWeightChange(node.id, value);
    };

    // Sort children: subjects before tests
    const sortedChildren = node.children ? [...node.children].sort((a, b) => {
        if (a.children !== null && b.children === null) return -1;
        if (a.children === null && b.children !== null) return 1;
        return 0;
    }) : [];
    
    // Add child tooltip
    const addChildTitle = (): string => {
        return isCategoryNode ? "Adicionar Tema (1º nível)" : "Adicionar Sub-Tema ou Teste";
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
                    {/* Node Icon */}
                    <NodeIcon isTest={isTestNode} textColor={textColor} />

                    {/* Node Name with Category Weight */}
                    <div 
                        className={`font-semibold text-sm ${textColor} whitespace-nowrap flex items-center gap-2 ${
                            isCategoryNode && node.id !== 'base' ? 'cursor-pointer' : ''
                        }`}
                        onClick={() => {
                            if (isCategoryNode && node.id !== 'base') {
                                categoryWeightEdit.toggle();
                            }
                        }}
                    >
                        <span>{getDisplayName()}</span>
                        
                        {/* Category Weight Display (Base/Bonus/Penalty) */}
                        {isCategoryNode && (
                            <CategoryWeightDisplay
                                categoryId={node.id}
                                weight={node.weight}
                                isEditing={categoryWeightEdit.value}
                                onToggle={categoryWeightEdit.toggle}
                                onWeightChange={handleCategoryWeightChange}
                                onBlur={categoryWeightEdit.setFalse}
                            />
                        )}
                    </div>
                    
                    {/* Subject/Theme Weight Input */}
                    {(canBeDeleted && !isTestNode && !isCategoryNode) && (
                        <WeightInput
                            weight={node.weight}
                            onChange={(value) => onWeightChange(node.id, value)}
                            className="ml-4"
                        />
                    )}

                    {/* Progress Bar for Categories and Nested Subjects */}
                    {showProgressBar && (
                        <ProgressBar
                            current={totalChildWeight}
                            target={100}
                            className="ml-4 w-24 sm:w-32"
                        />
                    )}
                    
                    {/* Action Buttons */}
                    <NodeActions
                        canAdd={canAddChild}
                        canDelete={canBeDeleted}
                        onAdd={() => onAddChild(node.id)}
                        onDelete={() => onRemoveNode(node.id)}
                        addTitle={addChildTitle()}
                        className="ml-4"
                    />
                </div>
            </div>

            {/* Render Children Recursively */}
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
