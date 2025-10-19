import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CriteriaForm from './CriteriaForm';
import FeedbackForm from './feedback';

const ConfigurationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gradingTemplate, feedbackMode } = location.state || {};
  const [activeTab, setActiveTab] = useState('criteria');
  const [criteriaSaved, setCriteriaSaved] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [criteriaConfig, setCriteriaConfig] = useState(null);
  const [feedbackConfig, setFeedbackConfig] = useState(null);

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
                📋 Criteria Configuration
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
                💬 Feedback Configuration
                {feedbackSaved && (
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
            <CriteriaForm onSave={handleCriteriaSave} />
          </div>
          <div className={activeTab === 'feedback' ? '' : 'hidden'}>
            <FeedbackForm onSave={handleFeedbackSave} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
