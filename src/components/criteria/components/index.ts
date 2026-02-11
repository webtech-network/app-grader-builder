/**
 * @fileoverview Barrel export file for all criteria components.
 * 
 * @description This module exports all components used in the criteria feature.
 * Components are organized by their purpose:
 * - Layout: Page structure components
 * - Tree Nodes: Components for rendering tree structure
 * - Modals: Dialog components for creation and configuration
 * - Form Elements: Input and display components
 * 
 * @module components/criteria/components
 */

// ============================================================================
// LAYOUT COMPONENTS
// Components for page structure and organization
// ============================================================================

/** Header component for the criteria builder page */
export { default as CriteriaHeader } from './CriteriaHeader';

// ============================================================================
// TREE NODE COMPONENTS
// Components for rendering the hierarchical tree structure
// ============================================================================

/** Main tree node component (renders categories, subjects, and tests) */
export { default as TreeNode } from './TreeNode';

// ============================================================================
// MODAL COMPONENTS
// Dialog components for user interactions
// ============================================================================

/** Modal for creating new nodes (subject or test selection) */
export { default as NodeCreationModal } from './NodeCreationModal';

/** Modal for configuring test parameters from the test library */
export { default as TestLibraryModal } from './TestLibraryModal';

/** Toggle selector for choosing between Subject and Test node types */
export { default as NodeTypeSelector } from './NodeTypeSelector';

/** Draggable test card in the library list */
export { default as TestDragCard } from './TestDragCard';

/** Scrollable list of available tests */
export { default as TestLibraryList } from './TestLibraryList';

/** Drop zone for test selection */
export { default as TestDropZone } from './TestDropZone';

/** Configuration form for test parameters */
export { default as TestConfigForm } from './TestConfigForm';

/** Individual parameter input field */
export { default as ParameterInput } from './ParameterInput';

// ============================================================================
// FORM ELEMENTS & UTILITIES
// Reusable form components and display utilities
// ============================================================================

/** Inline-editable weight input with percentage display */
export { default as WeightInput } from './WeightInput';

/** Progress bar for visualizing weight distribution completion */
export { default as ProgressBar } from './ProgressBar';

/** Action button group for tree nodes (add, edit, delete) */
export { default as NodeActions } from './NodeActions';

/** Icon component for tree nodes (test vs subject) */
export { default as NodeIcon } from './NodeIcon';

/** Weight display/editor for category nodes (Base, Bonus, Penalty) */
export { default as CategoryWeightDisplay } from './CategoryWeightDisplay';

/** Main content display component for node names */
export { default as NodeContentDisplay } from './NodeContentDisplay';

/** Styling utility functions for tree nodes */
export { getNodeStyling } from './NodeStyling';
export type { NodeStylingResult } from './NodeStyling';
