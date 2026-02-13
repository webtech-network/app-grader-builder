/**
 * @fileoverview Reusable section title component.
 * @module components/setup/components/SectionTitle
 */

import React from 'react';

/**
 * Props for the SectionTitle component.
 * @interface SectionTitleProps
 */
interface SectionTitleProps {
    /** Emoji icon to display before the title */
    icon: string;
    /** Title text */
    title: string;
    /** Whether this section is optional */
    optional?: boolean;
}

/**
 * SectionTitle - Formatted section header with icon and optional badge.
 * 
 * @description Displays a consistent section title format with emoji icon
 * and optional "(Opcional)" badge.
 * 
 * @example
 * ```tsx
 * <SectionTitle icon="📁" title="Arquivos Obrigatórios" optional={true} />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered SectionTitle component
 */
const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title, optional = false }) => {
    return (
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            {icon} {title}
            {optional && <span className="text-sm text-gray-400 font-normal">(Opcional)</span>}
        </h3>
    );
};

export default SectionTitle;
