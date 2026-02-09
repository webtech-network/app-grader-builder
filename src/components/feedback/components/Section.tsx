/**
 * @fileoverview Reusable Section component for grouping related form content.
 * @module components/feedback/components/Section
 */

import React, { ReactNode } from 'react';
import { Tooltip } from '../../../shared';

/**
 * Configuration for an optional badge displayed next to the section title.
 * @interface BadgeConfig
 */
interface BadgeConfig {
  /** Text to display inside the badge (e.g., 'Beta', 'New') */
  text: string;
  /** Custom Tailwind classes for badge styling. Defaults to purple theme. */
  colorClass?: string;
}

/**
 * Props for the Section component.
 * @interface SectionProps
 */
interface SectionProps {
  /** The section title displayed in the header */
  title: string;
  /** Optional tooltip text providing additional context */
  tooltipText?: string;
  /** Optional badge configuration for status indicators */
  badge?: BadgeConfig;
  /** Child components to render inside the section */
  children: ReactNode;
}

/**
 * Section - A reusable container component for grouping related form content.
 * 
 * @description Provides a consistent visual structure with a styled header,
 * optional tooltip, optional status badge, and a content area for children.
 * Used to organize the feedback form into logical sections.
 * 
 * @example
 * ```tsx
 * <Section
 *   title="Configuration"
 *   tooltipText="Configure your settings here"
 *   badge={{ text: 'Beta', colorClass: 'bg-blue-500/20 text-blue-300' }}
 * >
 *   <YourContent />
 * </Section>
 * ```
 * 
 * @param props - Component props
 * @returns The rendered Section component
 */
const Section: React.FC<SectionProps> = ({ 
  title, 
  tooltipText, 
  badge,
  children 
}) => {
  return (
    <section className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-700">
      <h2 className="text-2xl font-bold border-b-2 border-gray-700 pb-3 mb-6 text-indigo-400 flex items-center gap-3">
        {title}
        {tooltipText && <Tooltip content={tooltipText} />}
        {badge && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badge.colorClass || 'bg-purple-500/20 text-purple-300 border-purple-500/30'}`}>
            {badge.text}
          </span>
        )}
      </h2>
      {children}
    </section>
  );
};

export default Section;
