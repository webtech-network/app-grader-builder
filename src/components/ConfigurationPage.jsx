import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
import CriteriaForm from './criteria'; // This imports from criteria/index.jsx
import FeedbackForm from './feedback'; // This imports from feedback/index.jsx
import SetupForm from './SetupForm'; // This is a standalone component

const ConfigurationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gradingTemplate, feedbackMode } = location.state || {};
  const [activeTab, setActiveTab] = useState('criteria');
  const [criteriaSaved, setCriteriaSaved] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [setupSaved, setSetupSaved] = useState(false);
  const [criteriaConfig, setCriteriaConfig] = useState(null);
  const [feedbackConfig, setFeedbackConfig] = useState(null);
  const [setupConfig, setSetupConfig] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Check if setup is required for this template
  const isSetupRequired = gradingTemplate === 'api' || gradingTemplate === 'io';

  // Check if all required configurations are saved
  useEffect(() => {
    const allRequiredSaved = criteriaSaved && feedbackSaved && 
      (isSetupRequired ? setupSaved : true);
    
    if (allRequiredSaved && criteriaConfig && feedbackConfig && 
        (isSetupRequired ? setupConfig : true)) {
      setShowDownloadModal(true);
    }
  }, [criteriaSaved, feedbackSaved, setupSaved, criteriaConfig, feedbackConfig, setupConfig, isSetupRequired]);

  if (!gradingTemplate || !feedbackMode) {
    // Redirect back to landing page if no configuration data
    navigate('/');
    return null;
  }

  const handleCriteriaSave = (config) => {
    if (config === null) {
      // Unsaved/cancelled
      setCriteriaConfig(null);
      setCriteriaSaved(false);
    } else {
      setCriteriaConfig(config);
      setCriteriaSaved(true);
      console.log('Criteria Configuration Saved:', JSON.stringify(config, null, 2));
    }
  };

  const handleFeedbackSave = (config) => {
    if (config === null) {
      // Unsaved/cancelled
      setFeedbackConfig(null);
      setFeedbackSaved(false);
    } else {
      setFeedbackConfig(config);
      setFeedbackSaved(true);
      console.log('Feedback Configuration Saved:', JSON.stringify(config, null, 2));
    }
  };

  const handleSetupSave = (config) => {
    if (config === null) {
      // Unsaved/cancelled
      setSetupConfig(null);
      setSetupSaved(false);
    } else {
      setSetupConfig(config);
      setSetupSaved(true);
      console.log('Setup Configuration Saved:', JSON.stringify(config, null, 2));
    }
  };

  const handleDownloadZip = () => {
    // Create configuration files
    const criteriaJson = JSON.stringify(criteriaConfig, null, 2);
    const feedbackJson = JSON.stringify(feedbackConfig, null, 2);
    const setupJson = setupConfig ? JSON.stringify(setupConfig, null, 2) : null;
    
    // Create a simple download for each file (since we can't create actual ZIP in browser without library)
    // Download criteria_config.json
    const criteriaBlob = new Blob([criteriaJson], { type: 'application/json' });
    const criteriaUrl = URL.createObjectURL(criteriaBlob);
    const criteriaLink = document.createElement('a');
    criteriaLink.href = criteriaUrl;
    criteriaLink.download = 'criteria_config.json';
    document.body.appendChild(criteriaLink);
    criteriaLink.click();
    document.body.removeChild(criteriaLink);
    URL.revokeObjectURL(criteriaUrl);
    
    // Download feedback_config.json
    setTimeout(() => {
      const feedbackBlob = new Blob([feedbackJson], { type: 'application/json' });
      const feedbackUrl = URL.createObjectURL(feedbackBlob);
      const feedbackLink = document.createElement('a');
      feedbackLink.href = feedbackUrl;
      feedbackLink.download = 'feedback_config.json';
      document.body.appendChild(feedbackLink);
      feedbackLink.click();
      document.body.removeChild(feedbackLink);
      URL.revokeObjectURL(feedbackUrl);
      
      // Download setup_config.json if it exists
      if (setupJson) {
        setTimeout(() => {
          const setupBlob = new Blob([setupJson], { type: 'application/json' });
          const setupUrl = URL.createObjectURL(setupBlob);
          const setupLink = document.createElement('a');
          setupLink.href = setupUrl;
          setupLink.download = 'setup_config.json';
          document.body.appendChild(setupLink);
          setupLink.click();
          document.body.removeChild(setupLink);
          URL.revokeObjectURL(setupUrl);
        }, 200);
      }
    }, 100);
  };

  const handleCloseModal = () => {
    setShowDownloadModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Configuration Page
              </h1>
              <p className="text-gray-400 mt-1">
                Configure your {gradingTemplate} grading package with {feedbackMode} feedback
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Start
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-lg shadow-sm mb-6 border border-gray-700">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('criteria')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors relative ${
                activeTab === 'criteria'
                  ? 'bg-gray-700 text-white border-b-2 border-indigo-500'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-750'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                📋 Criteria
                {criteriaSaved && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                    Saved
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors relative ${
                activeTab === 'feedback'
                  ? 'bg-gray-700 text-white border-b-2 border-indigo-500'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-750'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                💬 Feedback
                {feedbackSaved && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                    Saved
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('setup')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors relative ${
                activeTab === 'setup'
                  ? 'bg-gray-700 text-white border-b-2 border-indigo-500'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-750'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                🔧 Setup
                {isSetupRequired && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                    Required
                  </span>
                )}
                {setupSaved && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                    Saved
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          <div className={activeTab === 'criteria' ? '' : 'hidden'}>
            <CriteriaForm 
              onSave={handleCriteriaSave} 
              templateName={gradingTemplate}
            />
          </div>
          <div className={activeTab === 'feedback' ? '' : 'hidden'}>
            <FeedbackForm 
              onSave={handleFeedbackSave}
              feedbackMode={feedbackMode}
            />
          </div>
          <div className={activeTab === 'setup' ? '' : 'hidden'}>
            <SetupForm 
              onSave={handleSetupSave}
              templateName={gradingTemplate}
            />
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-indigo-600 p-8 max-w-md w-full animate-in zoom-in duration-300">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              Configuração Completa!
            </h2>

            {/* Message */}
            <p className="text-gray-300 text-center mb-8 text-lg">
              Clique em "Baixar Arquivos" para fazer o download dos arquivos de configuração!
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownloadZip}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Baixar Arquivos
              </button>
              
              <button
                onClick={handleCloseModal}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationPage;
