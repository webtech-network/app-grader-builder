import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ConfigurationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gradingTemplate, feedbackMode } = location.state || {};

  if (!gradingTemplate || !feedbackMode) {
    // Redirect back to landing page if no configuration data
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
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

        {/* Placeholder Content */}
        <div className="bg-gray-800 rounded-lg shadow-sm p-8 text-center border border-gray-700">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Configuration Page Coming Soon
            </h2>
            <p className="text-gray-400 mb-6">
              This page will contain the criteria and feedback configuration tabs as described in your requirements.
            </p>
            
            {/* Selected Configuration Display */}
            <div className="bg-gray-700 rounded-lg p-4 text-left border border-gray-600">
              <h3 className="font-semibold text-white mb-2">Your Selection:</h3>
              <div className="space-y-1 text-sm text-gray-400">
                <p><span className="font-medium text-gray-300">Grading Template:</span> {gradingTemplate}</p>
                <p><span className="font-medium text-gray-300">Feedback Mode:</span> {feedbackMode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPage;
