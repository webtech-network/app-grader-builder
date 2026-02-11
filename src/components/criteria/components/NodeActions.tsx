/**
 * @fileoverview Action buttons component for tree nodes.
 * @module components/criteria/components/NodeActions
 */

import React from 'react';
import { Plus, X, Settings } from 'lucide-react';

/**
 * Props for the NodeActions component.
 * @interface NodeActionsProps
 */
interface NodeActionsProps {
  /** Node ID for action callbacks */
  nodeId: string;
  /** Node name for edit callback */
  nodeName: string;
  /** Whether the node can have children added */
  canAddChild?: boolean;
  /** Whether the node can be deleted */
  canDelete?: boolean;
  /** Whether the node is a test (leaf node) */
  isTest?: boolean;
  /** Callback fired when add button is clicked */
  onAddChild?: (nodeId: string) => void;
  /** Callback fired when delete button is clicked */
  onDelete?: (nodeId: string) => void;
  /** Callback fired when edit button is clicked (for tests) */
  onEdit?: (nodeId: string, nodeName: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * NodeActions - Action button group for tree node operations.
 * 
 * @description Displays a flexible set of action buttons based on node type
 * and permissions. Supports add, delete, and edit(test) operations.
 * 
 * @example
 * ```tsx
 * <NodeActions
 *   nodeId="node-123"
 *   nodeName="My Node"
 *   canAddChild={true}
 *   canDelete={true}
 *   isTest={false}
 *   onAddChild={(id) => handleAdd(id)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered NodeActions component
 */
const NodeActions: React.FC<NodeActionsProps> = ({
  nodeId,
  nodeName,
  canAddChild = false,
  canDelete = false,
  isTest = false,
  onAddChild,
  onDelete,
  onEdit,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ml-auto ${className}`}>
      {canAddChild && onAddChild && (
        <button
          onClick={() => onAddChild(nodeId)}
          className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          title="Add child"
          aria-label="Add child node"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
      
      {isTest && onEdit && (
        <button
          onClick={() => onEdit(nodeId, nodeName)}
          className="p-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors shadow-md"
          title="Edit test"
          aria-label="Edit test configuration"
        >
          <Settings className="w-4 h-4" />
        </button>
      )}
      
      {canDelete && onDelete && (
        <button
          onClick={() => onDelete(nodeId)}
          className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
          title="Delete node"
          aria-label="Delete node"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default NodeActions;
