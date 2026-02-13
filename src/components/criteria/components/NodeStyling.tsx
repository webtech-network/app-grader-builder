/**
 * @fileoverview Utility functions for determining node styling based on type.
 * @module components/criteria/components/NodeStyling
 */

import { Code, ListTree, LucideIcon } from 'lucide-react';

/**
 * Styling configuration for a node based on its type.
 * @interface NodeStylingResult
 */
export interface NodeStylingResult {
    /** Tailwind CSS classes for the node container */
    className: string;
    /** Text color class for the node name */
    textColor: string;
    /** Lucide icon component to display */
    icon: LucideIcon;
}

/**
 * Determines styling for a tree node based on its type and properties.
 * 
 * @description Applies appropriate colors, borders, and styling based on:
 * - Category type (base=green, bonus=indigo, penalty=red)
 * - Node type (category, subject, test)
 * - Interaction state (hover, click)
 * 
 * @param id - Node ID (used to identify categories)
 * @param isCategory - Whether this is a category node (level 0)
 * @param isSubject - Whether this is a subject node (has children, level > 0)
 * @param isTest - Whether this is a test/leaf node
 * @returns Styling configuration object
 * @exports
 */
export const getNodeStyling = (
    id: string,
    isCategory: boolean,
    isSubject: boolean,
    isTest: boolean
): NodeStylingResult => {
    const baseClasses = "flex items-center p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01]";
    
    let textColor = 'text-gray-200';
    let bgClass = 'bg-gray-700';
    let borderColor = 'border-gray-600';
    const cursorClass = isTest ? 'cursor-pointer' : 'cursor-default';

    // Category-specific styling
    if (isCategory) {
        bgClass = 'bg-gray-700';
        switch (id) {
            case 'base':
                textColor = 'text-green-400';
                break;
            case 'bonus':
                textColor = 'text-indigo-400';
                break;
            case 'penalty':
                textColor = 'text-red-400';
                break;
            default:
                break;
        }
    } 
    // Test node styling
    else if (isTest) {
        bgClass = 'bg-gray-900';
        borderColor = 'border-indigo-700 border-2';
        textColor = 'text-gray-300';
    } 
    // Subject node styling
    else if (isSubject) {
        bgClass = 'bg-gray-800';
        borderColor = 'border-gray-700 border';
        textColor = 'text-gray-200';
    }

    const className = `${baseClasses} ${bgClass} border ${borderColor} ${isCategory ? 'mt-4' : ''} ${cursorClass}`;
    const icon = isTest ? Code : ListTree;

    return { className, textColor, icon };
};
