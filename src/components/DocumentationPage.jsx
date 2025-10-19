import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg';

const DocumentationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50">
      {/* Top Header with Logo */}
      <header className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <img 
            src={logo} 
            alt="Webtech Autograder Logo" 
            className="w-16 h-16 rounded-xl object-cover shadow-lg"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Webtech Autograder
            </h1>
            <p className="text-indigo-400 text-sm font-medium">
              Documentation
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-gray-400 hover:text-gray-200 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
        >
          ← Back to Home
        </button>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Grader Builder Documentation
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Learn how to configure and customize your GitHub Classroom autograder with our comprehensive guide.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">📋 Table of Contents</h2>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <a href="#overview" className="text-indigo-400 hover:text-indigo-300 transition-colors">1. Overview</a>
            <a href="#grading-templates" className="text-indigo-400 hover:text-indigo-300 transition-colors">2. Grading Templates</a>
            <a href="#feedback-modes" className="text-indigo-400 hover:text-indigo-300 transition-colors">3. Feedback Modes</a>
            <a href="#configuration" className="text-indigo-400 hover:text-indigo-300 transition-colors">4. Configuration Guide</a>
            <a href="#criteria" className="text-indigo-400 hover:text-indigo-300 transition-colors">5. Criteria Setup</a>
            <a href="#best-practices" className="text-indigo-400 hover:text-indigo-300 transition-colors">6. Best Practices</a>
          </div>
        </div>

        {/* Overview Section */}
        <section id="overview" className="mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
              🎯 Overview
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                The Webtech Autograder Builder is a powerful tool that generates complete autograder configurations 
                for GitHub Classroom assignments. It simplifies the process of creating comprehensive grading 
                criteria and feedback systems for educational projects.
              </p>
              <div className="bg-indigo-900/30 border border-indigo-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Key Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Multiple grading templates for different assignment types</li>
                  <li>AI-powered and traditional feedback modes</li>
                  <li>Visual criteria tree configuration</li>
                  <li>Automated test generation</li>
                  <li>Custom feedback personalization</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Grading Templates Section */}
        <section id="grading-templates" className="mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
              📝 Grading Templates
            </h2>
            <div className="grid gap-6">
              
              {/* Web Dev Template */}
              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-xl font-semibold text-indigo-400 mb-3">🌐 Web Dev (HTML/CSS/JS)</h3>
                <p className="text-gray-300 mb-4">
                  Perfect for front-end development assignments, websites, and interactive web applications.
                </p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-200">Best for:</span> HTML structure, CSS styling, JavaScript functionality</p>
                  <p><span className="font-medium text-gray-200">Tests:</span> DOM elements, CSS selectors, JavaScript functions, responsive design</p>
                  <p><span className="font-medium text-gray-200">Files checked:</span> index.html, style.css, script.js, assets</p>
                </div>
              </div>

              {/* Essay Template */}
              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-xl font-semibold text-indigo-400 mb-3">📄 Essay (AI Grading)</h3>
                <p className="text-gray-300 mb-4">
                  AI-powered grading for written assignments, research papers, and documentation.
                </p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-200">Best for:</span> Written content, documentation, research assignments</p>
                  <p><span className="font-medium text-gray-200">Tests:</span> Content quality, structure, grammar, citations</p>
                  <p><span className="font-medium text-gray-200">Files checked:</span> README.md, documentation files, text content</p>
                </div>
              </div>

              {/* API Testing Template */}
              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-xl font-semibold text-indigo-400 mb-3">🔌 API Testing</h3>
                <p className="text-gray-300 mb-4">
                  Comprehensive testing for REST APIs, backend services, and server applications.
                </p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-200">Best for:</span> Backend APIs, web services, server applications</p>
                  <p><span className="font-medium text-gray-200">Tests:</span> Endpoint responses, status codes, data validation, authentication</p>
                  <p><span className="font-medium text-gray-200">Files checked:</span> Server files, API routes, configuration files</p>
                </div>
              </div>

              {/* Input/Output Template */}
              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-xl font-semibold text-indigo-400 mb-3">⚡ Input/Output</h3>
                <p className="text-gray-300 mb-4">
                  Traditional testing for command-line programs, algorithms, and computational tasks.
                </p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-200">Best for:</span> Console applications, algorithms, data processing</p>
                  <p><span className="font-medium text-gray-200">Tests:</span> Program output, performance, edge cases, correctness</p>
                  <p><span className="font-medium text-gray-200">Files checked:</span> Source code, executables, test data</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Modes Section */}
        <section id="feedback-modes" className="mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
              💬 Feedback Modes
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Default Mode */}
              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-xl font-semibold text-indigo-400 mb-3">🔧 Default</h3>
                <p className="text-gray-300 mb-4">
                  Standard template-based feedback with predefined messages and scoring.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>Fast and consistent feedback</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>Clear pass/fail indicators</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>Structured test results</span>
                  </div>
                </div>
              </div>

              {/* AI-Powered Mode */}
              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-xl font-semibold text-indigo-400 mb-3">🤖 AI-Powered</h3>
                <p className="text-gray-300 mb-4">
                  Intelligent feedback with personalized suggestions and detailed explanations.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span>Personalized feedback tone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span>Contextual improvement suggestions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span>Adaptive learning insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Guide */}
        <section id="configuration" className="mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
              ⚙️ Configuration Guide
            </h2>
            <div className="space-y-6">
              <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">📋 Step-by-Step Process</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                  <li>Select your grading template based on assignment type</li>
                  <li>Choose feedback mode (Default or AI-Powered)</li>
                  <li>Click "Start Configuring" to proceed to detailed setup</li>
                  <li>Configure criteria tree with subjects and tests</li>
                  <li>Set up feedback preferences and AI settings (if applicable)</li>
                  <li>Download your complete autograder package</li>
                </ol>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">🎛️ Configuration Tabs</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Criteria Tab</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Visual tree structure</li>
                      <li>• Subject nodes with weights</li>
                      <li>• Test nodes with parameters</li>
                      <li>• Bonus criteria sections</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Feedback Tab</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Report title customization</li>
                      <li>• Display preferences</li>
                      <li>• AI tone and persona (AI mode)</li>
                      <li>• Additional guidelines</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Criteria Setup */}
        <section id="criteria" className="mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
              🌳 Criteria Setup
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Subject Nodes</h3>
                <p className="text-gray-300 mb-4">
                  Subject nodes represent major categories of your grading criteria (e.g., HTML, CSS, JavaScript).
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Properties:</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Name (e.g., "HTML Structure")</li>
                      <li>• Weight (percentage of total grade)</li>
                      <li>• Description</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Example:</h4>
                    <div className="bg-gray-800 p-3 rounded border">
                      <code className="text-green-400 text-xs">
                        HTML: 40%<br/>
                        CSS: 35%<br/>
                        JavaScript: 25%
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3">Test Nodes</h3>
                <p className="text-gray-300 mb-4">
                  Test nodes define specific checks within each subject category.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Common Tests:</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• <code className="text-green-400">has_tag</code> - Check for HTML elements</li>
                      <li>• <code className="text-green-400">has_attribute</code> - Verify attributes</li>
                      <li>• <code className="text-green-400">has_selector</code> - CSS selectors</li>
                      <li>• <code className="text-green-400">has_function</code> - JavaScript functions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-200 mb-2">Parameters:</h4>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Target file</li>
                      <li>• Test arguments</li>
                      <li>• Point values</li>
                      <li>• Error messages</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices" className="mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
              🚀 Best Practices
            </h2>
            <div className="space-y-6">
              
              <div className="bg-green-900/30 border border-green-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4">✅ Do's</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <ul className="space-y-2">
                    <li>• Keep criteria weights balanced and logical</li>
                    <li>• Use clear, descriptive test names</li>
                    <li>• Test core functionality thoroughly</li>
                    <li>• Provide helpful error messages</li>
                  </ul>
                  <ul className="space-y-2">
                    <li>• Include bonus criteria for advanced features</li>
                    <li>• Test edge cases and error handling</li>
                    <li>• Use consistent file naming conventions</li>
                    <li>• Document your grading criteria clearly</li>
                  </ul>
                </div>
              </div>

              <div className="bg-red-900/30 border border-red-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4">❌ Don'ts</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <ul className="space-y-2">
                    <li>• Don't make tests too specific or brittle</li>
                    <li>• Avoid testing implementation details</li>
                    <li>• Don't create overly complex criteria trees</li>
                    <li>• Avoid unclear or misleading test names</li>
                  </ul>
                  <ul className="space-y-2">
                    <li>• Don't forget to test accessibility features</li>
                    <li>• Avoid hardcoding specific values unnecessarily</li>
                    <li>• Don't skip testing error conditions</li>
                    <li>• Avoid inconsistent grading weights</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">💡 Pro Tips</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <p><strong>Start Simple:</strong> Begin with basic tests and gradually add complexity</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <p><strong>Test Early:</strong> Run your configuration on sample submissions before deployment</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <p><strong>Iterate:</strong> Refine your criteria based on student submissions and feedback</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <p><strong>Backup:</strong> Keep copies of working configurations for future assignments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer with External Link */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">📖 Additional Resources</h3>
          <p className="text-gray-300 mb-4">
            For more detailed technical documentation and advanced configuration options, 
            visit our comprehensive documentation repository.
          </p>
          <a
            href="https://github.com/webtech-network/autograder/tree/main/docs/system/configuration"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            View GitHub Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
