/**
 * @fileoverview Barrel export file for all feedback form components.
 * 
 * @description This module exports all reusable components used in the feedback
 * configuration feature. Components are organized by their purpose:
 * - Layout: Structural components for page/section layout
 * - Form Elements: Reusable input controls and form fields
 * - Resource: Components for managing online learning resources
 * - Section: Complete section components combining multiple elements
 * 
 * @module components/feedback/components
 */

// ============================================================================
// LAYOUT COMPONENTS
// Structural components for organizing page content and sections
// ============================================================================

/** Page header component with title and optional subtitle */
export { default as FormHeader } from './FormHeader';

/** Reusable section wrapper with title, tooltip, and optional badge */
export { default as Section } from './Section';

// ============================================================================
// FORM ELEMENTS
// Reusable input controls and form field components
// ============================================================================

/** Single-line text input with label and tooltip support */
export { default as ReportTitleInput } from './ReportTitleInput';

/** Toggle/checkbox switch component for boolean settings */
export { default as ToggleSwitch } from './ToggleSwitch';

/** Grid layout for multiple toggle switches with responsive columns */
export { default as ToggleGrid } from './ToggleGrid';

/** Multi-line textarea with label, tooltip, and configurable height */
export { default as LabeledTextArea } from './LabeledTextArea';

/** Generic button group selector with type-safe options */
export { default as ButtonGroup } from './ButtonGroup';

/** Tag/chip input for managing lists of strings (files, tags, etc.) */
export { default as TagInput } from './TagInput';

// ============================================================================
// RESOURCE COMPONENTS
// Components for managing online learning resources
// ============================================================================

/** Form for creating new online resources with title, URL, and tags */
export { default as ResourceForm } from './ResourceForm';

/** Grid list displaying all added resources */
export { default as ResourceList } from './ResourceList';

/** Individual resource card with delete functionality */
export { default as ResourceCard } from './ResourceCard';

/** Combined section for adding and displaying online content */
export { default as OnlineContentSection } from './OnlineContentSection';

// ============================================================================
// SECTION COMPONENTS
// Complete section components that combine multiple elements
// ============================================================================

/** General settings section (report title, toggles, online content) */
export { default as GeneralSection } from './GeneralSection';

/** AI configuration section (tone, persona, context, guidelines) */
export { default as AISection } from './AISection';
