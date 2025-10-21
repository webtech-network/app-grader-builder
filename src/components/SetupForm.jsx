import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, AlertCircle } from 'lucide-react';

const SetupForm = ({ onSave, templateName }) => {
  const [fileChecks, setFileChecks] = useState([]);
  const [newFile, setNewFile] = useState('');
  const [sandboxConfig, setSandboxConfig] = useState({
    runtime_image: '',
    container_port: '',
    start_command: '',
    commands: {}
  });
  const [newCommandKey, setNewCommandKey] = useState('');
  const [newCommandValue, setNewCommandValue] = useState('');
  const [hasSaved, setHasSaved] = useState(false);
  const [showSandboxConfig, setShowSandboxConfig] = useState(false);

  // Check if setup is required for this template
  const isSetupRequired = templateName === 'api' || templateName === 'io';

  // Predefined runtime images with their configurations
  const runtimePresets = {
    'python:3.11-slim': {
      name: 'Python 3.11',
      description: 'For Python assignments and APIs',
      icon: '🐍',
      defaultPort: '8000',
      defaultStartCommand: 'python app.py',
      defaultCommands: {
        install_dependencies: 'pip install -r requirements.txt'
      }
    },
    'node:18-alpine': {
      name: 'Node.js 18',
      description: 'For JavaScript/Node.js applications and APIs',
      icon: '🟢',
      defaultPort: '3000',
      defaultStartCommand: 'npm start',
      defaultCommands: {
        install_dependencies: 'npm install',
        build: 'npm run build'
      }
    },
    'openjdk:17-slim': {
      name: 'Java 17',
      description: 'For Java applications and Spring Boot APIs',
      icon: '☕',
      defaultPort: '8080',
      defaultStartCommand: 'java -jar app.jar',
      defaultCommands: {
        build: 'mvn clean package',
        install_dependencies: 'mvn install'
      }
    },
    'ruby:3.2-slim': {
      name: 'Ruby 3.2',
      description: 'For Ruby applications and Rails APIs',
      icon: '💎',
      defaultPort: '3000',
      defaultStartCommand: 'ruby app.rb',
      defaultCommands: {
        install_dependencies: 'bundle install'
      }
    },
    'golang:1.21-alpine': {
      name: 'Go 1.21',
      description: 'For Go applications and APIs',
      icon: '🔷',
      defaultPort: '8080',
      defaultStartCommand: './main',
      defaultCommands: {
        build: 'go build -o main .',
        install_dependencies: 'go mod download'
      }
    }
  };

  // Handle runtime image selection
  const handleRuntimeImageChange = (imageKey) => {
    const preset = runtimePresets[imageKey];
    if (preset) {
      setSandboxConfig({
        runtime_image: imageKey,
        container_port: sandboxConfig.container_port || preset.defaultPort,
        start_command: sandboxConfig.start_command || preset.defaultStartCommand,
        commands: { ...preset.defaultCommands }
      });
    } else {
      // Custom image selected
      setSandboxConfig({
        ...sandboxConfig,
        runtime_image: imageKey
      });
    }
  };

  // Set default values based on template
  useEffect(() => {
    if (templateName === 'api') {
      handleRuntimeImageChange('python:3.11-slim');
      setFileChecks(['app.py', 'requirements.txt']);
      setShowSandboxConfig(true); // Auto-expand for required templates
    } else if (templateName === 'io') {
      handleRuntimeImageChange('python:3.11-slim');
      setSandboxConfig(prev => ({
        ...prev,
        container_port: '5000',
        start_command: 'python main.py'
      }));
      setFileChecks(['main.py']);
      setShowSandboxConfig(true); // Auto-expand for required templates
    } else {
      setShowSandboxConfig(false); // Collapse for optional templates
    }
  }, [templateName]);

  const handleAddFile = () => {
    if (newFile.trim() && !fileChecks.includes(newFile.trim())) {
      setFileChecks([...fileChecks, newFile.trim()]);
      setNewFile('');
    }
  };

  const handleRemoveFile = (index) => {
    setFileChecks(fileChecks.filter((_, i) => i !== index));
  };

  const handleAddCommand = () => {
    if (newCommandKey.trim() && newCommandValue.trim()) {
      setSandboxConfig({
        ...sandboxConfig,
        commands: {
          ...sandboxConfig.commands,
          [newCommandKey.trim()]: newCommandValue.trim()
        }
      });
      setNewCommandKey('');
      setNewCommandValue('');
    }
  };

  const handleRemoveCommand = (key) => {
    const newCommands = { ...sandboxConfig.commands };
    delete newCommands[key];
    setSandboxConfig({
      ...sandboxConfig,
      commands: newCommands
    });
  };

  const handleSave = () => {
    // Validate required fields for api/io templates
    if (isSetupRequired) {
      if (!sandboxConfig.runtime_image || !sandboxConfig.container_port || !sandboxConfig.start_command) {
        alert('All sandbox fields are required for API and IO templates!');
        return;
      }
      if (fileChecks.length === 0) {
        alert('At least one file check is required for API and IO templates!');
        return;
      }
    }

    const config = {
      file_checks: fileChecks.length > 0 ? fileChecks : null,
      sandbox: sandboxConfig.runtime_image ? {
        runtime_image: sandboxConfig.runtime_image,
        container_port: parseInt(sandboxConfig.container_port),
        start_command: sandboxConfig.start_command,
        commands: Object.keys(sandboxConfig.commands).length > 0 ? sandboxConfig.commands : null
      } : null
    };

    // If neither file_checks nor sandbox is set, pass null
    if (!config.file_checks && !config.sandbox) {
      onSave(null);
    } else {
      onSave(config);
      setHasSaved(true);
    }
  };

  const handleCancel = () => {
    setHasSaved(false);
    onSave(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-700">
      {/* Required Warning for API/IO */}
      {isSetupRequired && (
        <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-yellow-500 font-semibold mb-1">Setup Required</h3>
            <p className="text-yellow-200 text-sm">
              This template requires setup configuration. Please configure the sandbox environment and file checks.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* File Checks Section */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            📁 Required Files
            {!isSetupRequired && <span className="text-sm text-gray-400 font-normal">(Optional)</span>}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Specify files that must be present in the student's submission
          </p>

          {/* File List */}
          {fileChecks.length > 0 && (
            <div className="mb-4 space-y-2">
              {fileChecks.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-700 p-3 rounded-lg border border-gray-600"
                >
                  <span className="text-gray-100 font-mono">{file}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-400 hover:text-red-300 p-1 hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add File Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newFile}
              onChange={(e) => setNewFile(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddFile()}
              placeholder="e.g., main.py, requirements.txt"
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleAddFile}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Sandbox Configuration Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              🐳 Sandbox Configuration
              {!isSetupRequired && <span className="text-sm text-gray-400 font-normal">(Optional)</span>}
            </h3>
          </div>

          {/* Collapsed State for Non-Required Templates */}
          {!isSetupRequired && !showSandboxConfig && (
            <div className="bg-gray-700 rounded-lg border border-gray-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">ℹ️</span>
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm font-medium mb-1">
                      Sandbox Configuration Not Required
                    </p>
                    <p className="text-gray-400 text-xs">
                      This template doesn't need a Docker environment, but you can configure one if needed
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSandboxConfig(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium flex-shrink-0 ml-4"
                >
                  <Plus className="w-4 h-4" />
                  Configure
                </button>
              </div>
            </div>
          )}

          {/* Expanded Sandbox Configuration */}
          {(isSetupRequired || showSandboxConfig) && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 text-sm">
                  Configure the Docker environment for running and testing the student's code
                </p>
                {!isSetupRequired && (
                  <button
                    type="button"
                    onClick={() => setShowSandboxConfig(false)}
                    className="text-gray-400 hover:text-gray-200 text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Hide
                  </button>
                )}
              </div>

          <div className="space-y-4">
            {/* Runtime Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Runtime Image {isSetupRequired && <span className="text-red-400">*</span>}
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Select a pre-configured runtime or enter a custom Docker image
              </p>
              
              {/* Preset Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {Object.entries(runtimePresets).map(([key, preset]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleRuntimeImageChange(key)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      sandboxConfig.runtime_image === key
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{preset.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-100 text-sm">{preset.name}</span>
                          {sandboxConfig.runtime_image === key && (
                            <span className="text-indigo-400 text-xs">✓</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{preset.description}</p>
                        <p className="text-xs text-gray-500 font-mono mt-1">{key}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Image Input */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!Object.keys(runtimePresets).includes(sandboxConfig.runtime_image)) {
                      // Already custom, do nothing
                    } else {
                      setSandboxConfig({ ...sandboxConfig, runtime_image: '', commands: {} });
                    }
                  }}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    !Object.keys(runtimePresets).includes(sandboxConfig.runtime_image) && sandboxConfig.runtime_image !== ''
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔧</span>
                    <div>
                      <span className="font-medium text-gray-100 text-sm">Custom Image</span>
                      <p className="text-xs text-gray-400">Enter your own Docker image</p>
                    </div>
                  </div>
                </button>
                
                {(!Object.keys(runtimePresets).includes(sandboxConfig.runtime_image) || sandboxConfig.runtime_image === '') && (
                  <input
                    type="text"
                    value={sandboxConfig.runtime_image}
                    onChange={(e) => setSandboxConfig({ ...sandboxConfig, runtime_image: e.target.value })}
                    placeholder="e.g., nginx:alpine, php:8.2-fpm"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  />
                )}
              </div>
            </div>

            {/* Container Port */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Container Port {isSetupRequired && <span className="text-red-400">*</span>}
              </label>
              <input
                type="number"
                value={sandboxConfig.container_port}
                onChange={(e) => setSandboxConfig({ ...sandboxConfig, container_port: e.target.value })}
                placeholder="e.g., 8000, 5000, 3000"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Start Command */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Command {isSetupRequired && <span className="text-red-400">*</span>}
              </label>
              <input
                type="text"
                value={sandboxConfig.start_command}
                onChange={(e) => setSandboxConfig({ ...sandboxConfig, start_command: e.target.value })}
                placeholder="e.g., python app.py, npm start"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Setup Commands */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Setup Commands (Optional)
              </label>
              <p className="text-gray-500 text-xs mb-3">
                Commands to run before starting the application (e.g., install dependencies)
              </p>

              {/* Command List */}
              {Object.entries(sandboxConfig.commands || {}).length > 0 && (
                <div className="mb-3 space-y-2">
                  {Object.entries(sandboxConfig.commands).map(([key, value]) => {
                    // Check if this command came from a preset
                    const currentPreset = runtimePresets[sandboxConfig.runtime_image];
                    const isPresetCommand = currentPreset?.defaultCommands?.[key] === value;
                    
                    return (
                      <div
                        key={key}
                        className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <label className="text-indigo-400 font-medium text-sm">{key}</label>
                            {isPresetCommand && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                                Auto-added
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveCommand(key)}
                            className="text-red-400 hover:text-red-300 p-1 hover:bg-red-900/20 rounded transition-colors"
                            title="Remove command"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-gray-100 font-mono text-sm bg-gray-800 p-2 rounded border border-gray-600">
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Command Input - Unified Form */}
              <div className="bg-gray-750 p-4 rounded-lg border-2 border-gray-600 hover:border-indigo-500/50 transition-colors">
                <div className="space-y-3">
                  {/* Command Name as Label */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Command Name
                    </label>
                    <input
                      type="text"
                      value={newCommandKey}
                      onChange={(e) => setNewCommandKey(e.target.value)}
                      placeholder="e.g., install_dependencies"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  
                  {/* Command Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Command
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCommandValue}
                        onChange={(e) => setNewCommandValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCommand()}
                        placeholder="e.g., pip install -r requirements.txt"
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
                      />
                      <button
                        onClick={handleAddCommand}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
                        disabled={!newCommandKey.trim() || !newCommandValue.trim()}
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
              </>
            )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
        <button
          onClick={handleSave}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Configuration
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <X className="w-5 h-5" />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SetupForm;
