/**
 * @fileoverview CSS-in-JS component for tree visualization styles.
 * @module components/criteria/TreeStyles
 */

import React from 'react';

/**
 * TreeStyles - Provides CSS styles for the hierarchical tree visualization.
 * 
 * @description Injects CSS styles for tree lines, connectors, and node positioning.
 * Uses pseudo-elements to create visual connecting lines between parent and child nodes.
 * 
 * Note: Common animation styles (celebrate, confetti, toast) are in index.css.
 * 
 * @returns The rendered style element
 */
const TreeStyles: React.FC = () => (
  <style>{`
    /* Tree line styles */
    .tree ul {
      padding-left: 25px;
      position: relative;
    }
    .tree ul:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 10px;
      width: 2px;
      background: #4B5563; /* gray-600 */
    }
    .tree li {
      position: relative;
    }
    .tree li:before {
      content: '';
      position: absolute;
      top: 15px;
      left: 10px;
      width: 15px;
      height: 2px;
      background: #4B5563; /* gray-600 */
    }
    .tree li:last-child:before {
      /* Remove the vertical line below the last node */
      background: transparent;
    }
    /* Style for the last node in the main list */
    .tree > ul > li:last-child:before {
      background: #111827; /* Background color to hide the vertical line */
    }
  `}</style>
);

export default TreeStyles;
