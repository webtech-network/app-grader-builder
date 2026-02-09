/**
 * @fileoverview Grid list component for displaying online resources.
 * @module components/feedback/components/ResourceList
 */

import React from 'react';
import ResourceCard from './ResourceCard';

/**
 * Represents an online learning resource.
 * @interface Resource
 */
interface Resource {
  /** Display title of the resource */
  title: string;
  /** URL to the online resource */
  url: string;
  /** Tags/tests associated with this resource */
  tags: string[];
}

/**
 * Props for the ResourceList component.
 * @interface ResourceListProps
 */
interface ResourceListProps {
  /** Array of resources to display */
  resources: Resource[];
  /** Callback fired when a resource is deleted (by index) */
  onDeleteResource: (index: number) => void;
}

/**
 * ResourceList - Displays a grid of resource cards with delete functionality.
 * 
 * @description Renders a responsive 2-column grid of ResourceCard components.
 * Shows an empty state message when no resources are present. Each card
 * includes a delete button that appears on hover.
 * 
 * @example
 * ```tsx
 * <ResourceList
 *   resources={myResources}
 *   onDeleteResource={(index) => removeResource(index)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered ResourceList component
 */
const ResourceList: React.FC<ResourceListProps> = ({ resources, onDeleteResource }) => {
  return (
    <div>
      <p className="text-gray-400 font-medium mb-3 text-sm">Recursos Adicionados</p>
      {resources.length === 0 ? (
        <p className="text-gray-500 italic text-sm">Nenhum conteúdo adicionado</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, index) => (
            <ResourceCard 
              key={index} 
              {...resource} 
              onDelete={() => onDeleteResource(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceList;
