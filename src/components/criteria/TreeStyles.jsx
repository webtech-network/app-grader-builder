import React from 'react';

const TreeStyles = () => (
  <style jsx="true">{`
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
      /* Remove a linha vertical abaixo do último nó */
      background: transparent;
    }
    /* Estilo para o último nó na lista principal */
    .tree > ul > li:last-child:before {
      background: #111827; /* Cor do fundo para esconder a linha vertical */
    }
    /* Estilo para a área de drop */
    .drag-over {
        border: 2px dashed #6366F1 !important; /* Indigo-500 */
        background-color: #1F2937 !important; /* Gray-800 */
    }
    
    /* Save celebration animation */
    @keyframes celebrate {
      0% {
        transform: scale(1);
      }
      25% {
        transform: scale(1.1) rotate(3deg);
      }
      50% {
        transform: scale(1.15) rotate(-3deg);
      }
      75% {
        transform: scale(1.1) rotate(2deg);
      }
      100% {
        transform: scale(1) rotate(0deg);
      }
    }
    
    @keyframes confetti {
      0% {
        opacity: 1;
        transform: translateY(0) rotate(0deg);
      }
      100% {
        opacity: 0;
        transform: translateY(-100px) rotate(360deg);
      }
    }
    
    .save-celebrate {
      animation: celebrate 0.6s ease-in-out;
    }
    
    .confetti-particle {
      position: absolute;
      width: 8px;
      height: 8px;
      animation: confetti 0.8s ease-out forwards;
      pointer-events: none;
    }
    
    @keyframes slideInUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutDown {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(100%);
        opacity: 0;
      }
    }
    
    .toast-enter {
      animation: slideInUp 0.3s ease-out;
    }
    
    .toast-exit {
      animation: slideOutDown 0.3s ease-in;
    }
  `}</style>
);

export default TreeStyles;
