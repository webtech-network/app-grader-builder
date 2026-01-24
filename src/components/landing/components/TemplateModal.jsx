import React from 'react';
import { X, Zap, FileCode } from 'lucide-react';

const TemplateModal = ({ 
  isOpen, 
  onClose, 
  onViewTests,
  templateDetails, 
  getTemplateDisplayInfo 
}) => {
  if (!isOpen || !templateDetails) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full border-2 border-indigo-500/50 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`bg-gradient-to-r ${getTemplateDisplayInfo().color} p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-4xl border-2 border-white/20">
                {getTemplateDisplayInfo().icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  {templateDetails.template_name}
                </h2>
                <p className="text-white/90 text-sm">
                  Template Overview
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content - Overview */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed">
              {templateDetails.template_description}
            </p>
          </div>

          {/* Available Tests Summary */}
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="px-3 py-1 bg-indigo-600/20 text-indigo-300 rounded-full text-sm font-bold">
                {templateDetails.tests.length}
              </span>
              <h3 className="text-sm font-semibold text-gray-300">Available Tests</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              This template includes {templateDetails.tests.length} pre-configured tests to validate student submissions.
            </p>
            <button
              onClick={onViewTests}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FileCode className="w-4 h-4" />
              View All Tests Details
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-900/50 px-6 py-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
