import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Info } from 'lucide-react';
import logo from '../../assets/logo.jpeg';
import TemplateModal from './TemplateModal';
import TestsModal from './TestsModal';

const LandingPage = () => {
  const [gradingTemplate, setGradingTemplate] = useState('');
  const [feedbackMode, setFeedbackMode] = useState('');
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTestsModal, setShowTestsModal] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showFeedbackDropdown, setShowFeedbackDropdown] = useState(false);
  const navigate = useNavigate();

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('http://localhost:8000/templates/');
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setTemplates(['webdev', 'api', 'essay', 'io']);
      } finally {
        setLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  // Fetch template details
  const fetchTemplateDetails = async (templateName) => {
    try {
      const response = await fetch(`http://localhost:8000/templates/${templateName}`);
      const data = await response.json();
      setSelectedTemplateDetails(data);
      setShowTemplateModal(true);
    } catch (error) {
      console.error('Error fetching template details:', error);
    }
  };

  const feedbackModeOptions = [
    { value: 'default', label: 'Default', icon: '📋', color: 'from-gray-500 to-slate-500', bgColor: 'bg-gray-500/10' },
    { value: 'ai', label: 'AI-Powered', icon: '🤖', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-500/10' }
  ];

  const getFeedbackDisplayInfo = (feedbackValue) => {
    return feedbackModeOptions.find(opt => opt.value === feedbackValue) || 
           { label: feedbackValue, icon: '📋', color: 'from-gray-500 to-slate-500', bgColor: 'bg-gray-500/10' };
  };

  const getTemplateDisplayInfo = (templateName = gradingTemplate) => {
    const templates = {
      'webdev': { label: 'Web Development', icon: '🌐', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/10' },
      'api': { label: 'API Testing', icon: '🔌', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/10' },
      'essay': { label: 'Essay Grading', icon: '📝', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-500/10' },
      'io': { label: 'Input/Output', icon: '💻', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-500/10' }
    };
    return templates[templateName] || { label: templateName, icon: '📦', color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-500/10' };
  };

  const isConfigurationReady = gradingTemplate && feedbackMode;

  const handleStartConfiguring = () => {
    if (isConfigurationReady) {
      navigate('/configure', { 
        state: { 
          gradingTemplate, 
          feedbackMode 
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 overflow-x-hidden">
      {/* Top Header with Logo */}
      <header className="flex items-center p-6">
        <div className="flex items-center space-x-4">
          <img 
            src={logo} 
            alt="Webtech Autograder Logo" 
            className="w-20 h-20 rounded-xl object-cover shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-white">
              Webtech Autograder
            </h1>
            <p className="text-indigo-400 text-sm font-medium">
              Automated Grading System
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 sm:px-6 pb-6" style={{minHeight: 'calc(100vh - 120px)'}}>
        <div className="max-w-5xl mx-auto w-full">
          {/* Main Title Section */}
          <div className="text-center mb-12 pt-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Create Your Grading Package
            </h2>
            <h3 className="text-xl md:text-2xl text-gray-400 mb-2">
              for GitHub Classroom
            </h3>
            <p className="text-gray-400 max-w-lg mx-auto">
              Configure your automated grading system with just a few clicks. 
              Select your template and feedback preferences to get started.
            </p>
          </div>

        {/* Configuration Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 border border-gray-700 max-w-2xl mx-auto">
          <div className="space-y-8">
            {/* Dropdowns Container */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Grading Template Dropdown */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Grading Template
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                    className="w-full px-4 py-3 border-2 border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-100 flex items-center justify-between hover:border-gray-500"
                  >
                    {gradingTemplate ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getTemplateDisplayInfo(gradingTemplate).icon}</span>
                        <span>{getTemplateDisplayInfo(gradingTemplate).label}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Select a template...</span>
                    )}
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showTemplateDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showTemplateDropdown && (
                    <div className="absolute z-50 w-full mt-2 bg-gray-800 border-2 border-gray-600 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {loadingTemplates ? (
                        <div className="p-4 text-center text-gray-400">Loading templates...</div>
                      ) : (
                        <div className="max-h-80 overflow-y-auto">
                          {templates.map((template) => {
                            const info = getTemplateDisplayInfo(template);
                            return (
                              <div key={template} className="group relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setGradingTemplate(template);
                                    setShowTemplateDropdown(false);
                                  }}
                                  className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-all duration-200 flex items-center justify-between ${
                                    gradingTemplate === template ? 'bg-indigo-600/20 border-l-4 border-indigo-500' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${info.bgColor} flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-200`}>
                                      {info.icon}
                                    </div>
                                    <span className="font-medium text-gray-100">{info.label}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      fetchTemplateDetails(template);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-600 rounded"
                                    title="View details"
                                  >
                                    <Info className="w-5 h-5 text-indigo-400" />
                                  </button>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback Mode Dropdown */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Feedback Mode
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackDropdown(!showFeedbackDropdown)}
                    className="w-full px-4 py-3 border-2 border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-100 flex items-center justify-between hover:border-gray-500"
                  >
                    {feedbackMode ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getFeedbackDisplayInfo(feedbackMode).icon}</span>
                        <span>{getFeedbackDisplayInfo(feedbackMode).label}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Select feedback mode...</span>
                    )}
                    <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showFeedbackDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showFeedbackDropdown && (
                    <div className="absolute z-50 w-full mt-2 bg-gray-800 border-2 border-gray-600 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="max-h-80 overflow-y-auto">
                        {feedbackModeOptions.map((option) => (
                          <div key={option.value} className="group relative">
                            <button
                              type="button"
                              onClick={() => {
                                setFeedbackMode(option.value);
                                setShowFeedbackDropdown(false);
                              }}
                              className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-all duration-200 flex items-center justify-between ${
                                feedbackMode === option.value ? 'bg-indigo-600/20 border-l-4 border-indigo-500' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${option.bgColor} flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-200`}>
                                  {option.icon}
                                </div>
                                <span className="font-medium text-gray-100">{option.label}</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate('/documentation#feedback-modes');
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-600 rounded"
                                title="View details"
                              >
                                <Info className="w-5 h-5 text-indigo-400" />
                              </button>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selection Summary */}
            {(gradingTemplate || feedbackMode) && (
              <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-l-indigo-400 border border-gray-600">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Selected Configuration:</h3>
                <div className="space-y-1 text-sm text-gray-400">
                  {gradingTemplate && (
                    <p>
                      <span className="font-medium text-gray-300">Template:</span> {getTemplateDisplayInfo(gradingTemplate).label}
                    </p>
                  )}
                  {feedbackMode && (
                    <p>
                      <span className="font-medium text-gray-300">Feedback:</span> {feedbackModeOptions.find(opt => opt.value === feedbackMode)?.label}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Start Configuring Button */}
            <div className="pt-4">
              <button
                onClick={handleStartConfiguring}
                disabled={!isConfigurationReady}
                className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  isConfigurationReady
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isConfigurationReady ? (
                  <>
                    <span className="mr-2">🚀</span>
                    Start Configuring
                  </>
                ) : (
                  'Please select both options above'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Need help? Check out our{' '}
            <button 
              onClick={() => navigate('/documentation')}
              className="text-indigo-400 hover:text-indigo-300 underline bg-transparent border-none cursor-pointer"
            >
              documentation
            </button>{' '}
            or{' '}
            <button className="text-indigo-400 hover:text-indigo-300 underline bg-transparent border-none cursor-pointer">
              examples
            </button>
          </p>
        </div>

        {/* Open Source Hook */}
        <div className="mt-12 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 sm:p-8 border border-indigo-500/30 backdrop-blur-sm overflow-visible max-w-3xl mx-auto">
          <div className="text-center overflow-visible">
            <div className="flex items-center justify-center space-x-2 mb-4 flex-wrap">
              <svg className="w-8 h-8 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                🚀 Powered by Open Source
              </h3>
            </div>
            
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Webtech Autograder is a robust educational platform trusted by educators worldwide. 
              Join our growing community and help shape the future of automated grading!
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                <div className="text-green-400 font-semibold mb-1">🔧 Hyper Flexible</div>
                <div className="text-gray-400">Adapt to any grading workflow</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                <div className="text-blue-400 font-semibold mb-1">🎯 Precise Grading</div>
                <div className="text-gray-400">Accurate & consistent evaluation</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                <div className="text-purple-400 font-semibold mb-1">🤖 AI-Enhanced</div>
                <div className="text-gray-400">Smart feedback generation</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap overflow-visible">
              <a
                href="https://github.com/webtech-network/autograder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500 group overflow-visible"
                style={{ minWidth: 'fit-content' }}
              >
                <svg className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20" style={{ display: 'block' }}>
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                <span className="whitespace-nowrap">Star on GitHub</span>
              </a>
              
              <div className="flex items-center flex-wrap gap-3 sm:gap-4 justify-center text-xs sm:text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 32 32" fill="none">
                    <path d="M15.885 2.1c-7.1 0-6.651 3.07-6.651 3.07l.008 3.18h6.729v.951H8.066s-4.618-.525-4.618 6.58c0 7.106 4.028 6.846 4.028 6.846h2.411v-3.383s-.13-4.028 3.959-4.028h6.646s3.86.062 3.86-3.729V7.668s.582-5.568-8.467-5.568zm-3.674 3.205a1.193 1.193 0 11.001 2.387 1.193 1.193 0 01-.001-2.387z" fill="#3776ab"/>
                    <path d="M16.115 29.9c7.1 0 6.651-3.07 6.651-3.07l-.008-3.18h-6.729v-.951h7.905s4.618.525 4.618-6.58c0-7.106-4.028-6.846-4.028-6.846h-2.411v3.383s.13 4.028-3.959 4.028h-6.646s-3.86-.062-3.86 3.729v6.936s-.582 5.568 8.467 5.568v-.017zm3.674-3.205a1.193 1.193 0 11-.001-2.387 1.193 1.193 0 01.001 2.387z" fill="#ffd43b"/>
                  </svg>
                  <span>Python</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  <span>Active Development</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
                  <span>Community Driven</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Built with ❤️ by the Autograder team
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Modals */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onViewTests={() => {
          setShowTestsModal(true);
          setShowTemplateModal(false);
        }}
        templateDetails={selectedTemplateDetails}
        getTemplateDisplayInfo={() => getTemplateDisplayInfo(gradingTemplate)}
      />

      <TestsModal
        isOpen={showTestsModal}
        onClose={() => setShowTestsModal(false)}
        onBackToOverview={() => {
          setShowTestsModal(false);
          setShowTemplateModal(true);
        }}
        templateDetails={selectedTemplateDetails}
        getTemplateDisplayInfo={() => getTemplateDisplayInfo(gradingTemplate)}
      />

      {/* Click outside to close dropdowns */}
      {showTemplateDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowTemplateDropdown(false)}></div>
      )}
      {showFeedbackDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowFeedbackDropdown(false)}></div>
      )}
    </div>
  );
};

export default LandingPage;
