/**
 * @fileoverview Icon component for tree nodes based on type.
 * @module components/criteria/components/NodeIcon
 */

import React from 'react';
import { Code, ListTree, LucideIcon } from 'lucide-react';

/**
 * Props for the NodeIcon component.
 * @interface NodeIconProps
 */
interface NodeIconProps {
    /** Whether this is a test node */
    isTest: boolean;
    /** Text color class for the icon */
    textColor: string;
}

/**
 * NodeIcon - Displays the appropriate icon for a tree node.
 * 
 * @description Shows a Code icon for test nodes and ListTree for others.
 * 
 * @example
 * ```tsx
 * <NodeIcon isTest={true} textColor="text-indigo-400" />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered NodeIcon component
 */
const NodeIcon: React.FC<NodeIconProps> = ({ isTest, textColor }) => {
    const Icon: LucideIcon = isTest ? Code : ListTree;
    
    return <Icon className={`w-4 h-4 mr-2 ${textColor}`} />;
};

export default NodeIcon;
