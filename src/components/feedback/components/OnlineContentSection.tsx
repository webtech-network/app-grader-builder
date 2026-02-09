/**
 * @fileoverview Combined section for managing online learning resources.
 * @module components/feedback/components/OnlineContentSection
 */

import React from 'react';
import { Tooltip } from '../../../shared';
import ResourceForm from './ResourceForm';
import ResourceList from './ResourceList';

/**
 * Represents an online learning resource.
 * @interface OnlineResource
 */
interface OnlineResource {
  /** Display title of the resource */
  title: string;
  /** URL to the online resource */
  url: string;
  /** Tags/tests associated with this resource */
  tags: string[];
}

/**
 * Props for the OnlineContentSection component.
 * @interface OnlineContentSectionProps
 */
interface OnlineContentSectionProps {
  /** Section label. Defaults to 'Adicionar Conteúdo Online de Apoio' */
  label?: string;
  /** Optional tooltip text for additional context */
  tooltipText?: string;
  /** Current array of online resources */
  resources: OnlineResource[];
  /** Callback fired when a new resource is added */
  onAddResource: (resource: OnlineResource) => void;
  /** Callback fired when a resource is deleted (by index) */
  onDeleteResource: (index: number) => void;
}

/**
 * OnlineContentSection - A combined section for adding and displaying online resources.
 * 
 * @description Combines the ResourceForm (for adding new resources) and
 * ResourceList (for displaying existing resources) into a single cohesive
 * section. Used to manage supplementary learning materials linked to specific
 * tests or topics.
 * 
 * @example
 * ```tsx
 * <OnlineContentSection
 *   label="Support Materials"
 *   tooltipText="Add helpful online resources for students"
 *   resources={resources}
 *   onAddResource={(r) => addResource(r)}
 *   onDeleteResource={(i) => removeResource(i)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered OnlineContentSection component
 */
const OnlineContentSection: React.FC<OnlineContentSectionProps> = ({
  label = 'Adicionar Conteúdo Online de Apoio',
  tooltipText,
  resources,
  onAddResource,
  onDeleteResource
}) => {
  return (
    <div className="pt-4 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3 text-sm">
          <p className="text-gray-400 font-medium">{label}</p>
          {tooltipText && <Tooltip content={tooltipText} />}
        </div>
        <ResourceForm onSubmit={onAddResource} />
      </div>

      <ResourceList
        resources={resources}
        onDeleteResource={onDeleteResource}
      />
    </div>
  );
};

export default OnlineContentSection;
