import React from 'react';
import { X, Code, Sparkles } from 'lucide-react';

const TestsModal = ({ 
  isOpen, 
  onClose, 
  onBackToOverview,
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
        className="bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 border-indigo-500/50 animate-in zoom-in-95 duration-300"
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
                  Test Details
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

        {/* Modal Content - Tests List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Tests Count Info */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 pb-3 border-b border-gray-700">
            <Code className="w-4 h-4 text-yellow-400" />
            <span className="px-3 py-1 bg-indigo-600/20 text-indigo-300 rounded-full text-xs font-bold">
              {templateDetails.tests.length}
            </span>
            <span className="font-medium">Available Tests</span>
          </div>

          {/* Tests Grid */}
          <div className="grid md:grid-cols-2 gap-4 items-start">
            {templateDetails.tests.map((test, index) => (
              <div
                key={index}
                className="bg-gray-900/50 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-all duration-200 overflow-hidden"
              >
                {/* Test Card Header */}
                <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/30 border-b border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                      <Code className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm mb-1">
                        {test.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {test.parameters && test.parameters.length > 0 && (
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                            {test.parameters.length} params
                          </span>
                        )}
                        {test.required_file && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded text-xs font-medium">
                            📁 File required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Card Body */}
                <div className="p-4 space-y-3">
                  {/* Description */}
                  <div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  {/* Required File */}
                  {test.required_file && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 mb-1">Required File:</h4>
                      <code className="text-xs text-green-400 bg-gray-900/50 px-2 py-1 rounded block break-all">
                        {test.required_file}
                      </code>
                    </div>
                  )}

                  {/* Parameters */}
                  {test.parameters && test.parameters.length > 0 ? (
                    <details className="group">
                      <summary className="text-xs font-semibold text-indigo-400 cursor-pointer hover:text-indigo-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        View Parameters ({test.parameters.length})
                      </summary>
                      <div className="mt-2 space-y-2 pl-4">
                        {test.parameters.map((param, pIndex) => (
                          <div
                            key={pIndex}
                            className="bg-gray-900/70 rounded p-2 border border-gray-700"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <code className="text-indigo-300 font-mono text-xs font-bold">
                                {param.name}
                              </code>
                              <span className="text-xs px-1.5 py-0.5 bg-purple-500/30 text-purple-200 rounded font-medium ml-2 flex-shrink-0">
                                {param.type}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">
                              {param.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <div className="text-xs text-gray-500 italic flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      This test needs no parameters
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-900/50 px-6 py-4 border-t border-gray-700 flex justify-between">
          <button
            onClick={onBackToOverview}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            ← Back to Overview
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestsModal;
