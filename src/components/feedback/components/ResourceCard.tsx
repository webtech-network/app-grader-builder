/**
 * @fileoverview Individual resource card component with delete functionality.
 * @module components/feedback/components/ResourceCard
 */

import React from 'react';

/**
 * ExternalLinkIcon - SVG icon indicating an external link.
 * @returns The rendered SVG icon
 */
const ExternalLinkIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-4 w-4 ml-1" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
    />
  </svg>
);

/**
 * Props for the ResourceCard component.
 * @interface ResourceCardProps
 */
interface ResourceCardProps {
  /** Display title of the resource */
  title: string;
  /** URL to the online resource */
  url: string;
  /** Tags/tests associated with this resource */
  tags: string[];
  /** Callback fired when the delete button is clicked */
  onDelete: () => void;
}

/**
 * ResourceCard - Displays a single online resource with metadata and actions.
 * 
 * @description A card component showing resource information including title,
 * link to access the resource, and associated tags. Features a delete button
 * that appears on hover and a visual hover effect on the card border.
 * 
 * @example
 * ```tsx
 * <ResourceCard
 *   title="DOM Manipulation Guide"
 *   url="https://example.com/dom-guide"
 *   tags={['DOM', 'JavaScript']}
 *   onDelete={() => removeResource(id)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered ResourceCard component
 */
const ResourceCard: React.FC<ResourceCardProps> = ({ title, url, tags, onDelete }) => (
  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-indigo-500 transition duration-300 group">
    <div className="flex justify-between items-start mb-2">
      <p className="font-semibold text-sm text-gray-50 flex-1">{title}</p>
      <button
        onClick={onDelete}
        className="ml-2 p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        title="Remover recurso"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 break-all text-xs inline-flex items-center hover:text-blue-300 transition duration-150">
      Acessar Recurso
      <ExternalLinkIcon />
    </a>
    <div className="mt-3 border-t border-gray-700 pt-3 flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span 
          key={index}
          className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default ResourceCard;
