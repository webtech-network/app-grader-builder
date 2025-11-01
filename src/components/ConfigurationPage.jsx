import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import config from '../config';
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
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  // Hide download button if there are unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      setShowDownloadButton(false);
    }
  }, [hasUnsavedChanges]);

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
      setHasUnsavedChanges(true);
    } else {
      setCriteriaConfig(config);
      setCriteriaSaved(true);
      setHasUnsavedChanges(false);
      console.log('Criteria Configuration Saved:', JSON.stringify(config, null, 2));
    }
  };

  const handleFeedbackSave = (config) => {
    if (config === null) {
      // Unsaved/cancelled
      setFeedbackConfig(null);
      setFeedbackSaved(false);
      setHasUnsavedChanges(true);
    } else {
      setFeedbackConfig(config);
      setFeedbackSaved(true);
      setHasUnsavedChanges(false);
      console.log('Feedback Configuration Saved:', JSON.stringify(config, null, 2));
    }
  };

  const handleSetupSave = (config) => {
    if (config === null) {
      // Unsaved/cancelled
      setSetupConfig(null);
      setSetupSaved(false);
      setHasUnsavedChanges(true);
    } else {
      setSetupConfig(config);
      setSetupSaved(true);
      setHasUnsavedChanges(false);
      console.log('Setup Configuration Saved:', JSON.stringify(config, null, 2));
    }
  };

  const handleSaveLater = () => {
    setShowDownloadModal(false);
    setShowDownloadButton(true);
  };

  const handleDownloadZip = async () => {
    // Create a single configuration object with all three configs
    const completeConfig = {
      workflow: {
        template_preset: gradingTemplate,
        feedback_type: feedbackMode
      },
      criteria: criteriaConfig,
      feedback: feedbackConfig,
      ...(setupConfig && { setup: setupConfig })
    };
    
    const completeJson = JSON.stringify(completeConfig, null, 2);
    
    console.log('='.repeat(80));
    console.log('📦 COMPLETE CONFIGURATION:');
    console.log('='.repeat(80));
    console.log(completeJson);
    console.log('='.repeat(80));
    
    try {
      // Send configuration to backend API
      const response = await fetch(`${config.configApiUrl}/api/generate-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeConfig)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      // Get the zip file as a blob
      const blob = await response.blob();
      
      // Create download link for the zip file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'grader_package.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ Configuration sent successfully and zip file downloaded!');
      
    } catch (error) {
      console.error('❌ Error sending configuration to API:', error);
      alert(`Failed to generate configuration package: ${error.message}`);
    }
    
    // Close modal and show download button after download
    setShowDownloadModal(false);
    setShowDownloadButton(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Página de Configuração
              </h1>
              <p className="text-gray-400 mt-1">
                Configure seu pacote de avaliação {gradingTemplate} com feedback {feedbackMode}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Voltar ao Início
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
                📋 Critérios
                {criteriaSaved && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                    Salvo
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
                    Salvo
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
                🔧 Configuração
                {isSetupRequired && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                    Obrigatório
                  </span>
                )}
                {setupSaved && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                    Salvo
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* Download Button Below Tabs Navigation */}
          {showDownloadButton && !hasUnsavedChanges && (
            <div className="p-4 bg-gray-750 border-t border-gray-700 animate-in slide-in-from-top-4 fade-in duration-500">
              <button
                onClick={handleDownloadZip}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Download className="w-6 h-6" />
                <span className="text-lg">Baixar Pacote de Configuração</span>
              </button>
            </div>
          )}
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

      {/* Download Modal with Enhanced Animation */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <style jsx>{`
            @keyframes modalBounce {
              0% {
                transform: scale(0.3) translateY(-100px);
                opacity: 0;
              }
              50% {
                transform: scale(1.05) translateY(0);
              }
              70% {
                transform: scale(0.95);
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
            @keyframes successPulse {
              0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
              }
              50% {
                transform: scale(1.05);
                box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
              }
            }
            .modal-bounce {
              animation: modalBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .success-pulse {
              animation: successPulse 2s ease-in-out infinite;
            }
          `}</style>
          
          <div className="bg-gray-800 rounded-2xl shadow-2xl border-2 border-indigo-600 p-8 max-w-md w-full modal-bounce">
            {/* Success Icon with Enhanced Animation */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center success-pulse">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Title with Gradient */}
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 text-center mb-4">
              Configuração Completa!
            </h2>

            {/* Message */}
            <p className="text-gray-300 text-center mb-8 text-lg leading-relaxed">
              Você pode baixar os arquivos agora ou salvá-los para depois. O botão de download ficará disponível abaixo das abas.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownloadZip}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Baixar Arquivos Agora
              </button>
              
              <button
                onClick={handleSaveLater}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Salvar para Depois
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationPage;
