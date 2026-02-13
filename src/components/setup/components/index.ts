/**
 * @fileoverview Barrel exports for setup configuration components.
 * @module components/setup/components
 */

// Layout Components
export { default as SetupHeader } from './SetupHeader';
export { default as SectionTitle } from './SectionTitle';
export { default as ActionButtons } from './ActionButtons';

// File Checks Components
export { default as FileCheckItem } from './FileCheckItem';
export { default as FileCheckInput } from './FileCheckInput';
export { default as FileChecksSection } from './FileChecksSection';

// Runtime Selection Components
export { default as RuntimePresetCard } from './RuntimePresetCard';
export type { RuntimePreset } from './RuntimePresetCard';
export { default as CustomImageInput } from './CustomImageInput';
export { default as RuntimeImageSelector } from './RuntimeImageSelector';

// Sandbox Configuration Components
export { default as PresetField } from './PresetField';
export { default as SandboxCollapsedState } from './SandboxCollapsedState';
export { default as CommandItem } from './CommandItem';
export { default as CommandInput } from './CommandInput';
export { default as CommandsList } from './CommandsList';
export { default as SandboxConfigSection } from './SandboxConfigSection';
export type { SandboxConfig } from './SandboxConfigSection';
