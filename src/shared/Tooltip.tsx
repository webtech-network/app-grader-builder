import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children?: ReactNode;
  position?: 'top' | 'bottom';
}

export const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-flex items-center justify-center align-middle"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children ? (
        children
      ) : (
        <div className="cursor-help text-gray-400 hover:text-indigo-400 transition-colors p-0.5">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
      )}
      <div
        role="tooltip"
        className={`
          absolute z-50 px-3 py-2 text-sm font-normal rounded-lg shadow-xl
          w-64 md:w-72
          whitespace-normal text-left break-words leading-relaxed
          bg-gray-800 text-gray-100 border border-gray-700
          left-1/2 -translate-x-1/2
          ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
          transition-all duration-300 ease-in-out
          ${isVisible 
            ? 'opacity-100 visible translate-y-0 scale-100' 
            : 'opacity-0 invisible translate-y-2 scale-95'}
        `}
      >
        {content}
        <div 
          className={`
            absolute left-1/2 -translate-x-1/2 border-4 border-transparent
            ${position === 'top' ? 'top-full border-t-gray-800' : 'bottom-full border-b-gray-800'}
          `}
        />
      </div>
    </div>
  );
};