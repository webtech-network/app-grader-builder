/**
 * @fileoverview Setup configuration form for API and IO templates.
 * @module components/setup
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useArrayState, useFormInput, useToggle } from '../../hooks';
import SetupHeader from './components/SetupHeader';
import FileChecksSection from './components/FileChecksSection';
import SandboxConfigSection, { SandboxConfig } from './components/SandboxConfigSection';
import ActionButtons from './components/ActionButtons';
import { RuntimePreset } from './components/RuntimePresetCard';

/**
 * Setup configuration data structure for backend.
 * @interface SetupConfig
 */
interface SetupConfig {
    /** List of required files or null */
    file_checks: string[] | null;
    /** Sandbox configuration or null */
    sandbox: {
        /** Docker runtime image */
        runtime_image: string;
        /** Container port number */
        container_port: number;
        /** Command to start the application */
        start_command: string;
        /** Setup commands map or null */
        commands: Record<string, string> | null;
    } | null;
}

/**
 * Props for the SetupForm component.
 * @interface SetupFormProps
 */
interface SetupFormProps {
    /** Callback when configuration is saved */
    onSave: (config: SetupConfig | null) => void;
    /** Template name (api, io, or webdev) */
    templateName: string;
}

/**
 * Runtime preset configurations.
 * @constant
 */
const runtimePresets: Record<string, RuntimePreset> = {
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

/**
const SetupForm: React.FC<SetupFormProps> = ({ onSave, templateName }) => {
  // State management
  const fileChecksState = useArrayState<string>([]);
  const newFileInput = useFormInput('');
  const [sandboxConfig, setSandboxConfig] = useState<SandboxConfig>({
    runtime_image: '',
    container_port: '',
    start_command: '',
    commands: {}
  });
  const newCommandKeyInput = useFormInput('');
  const newCommandValueInput = useFormInput('');
  const sandboxConfigToggle = useToggle(false);

  // Check if setup is required for this template
  const isSetupRequired = templateName === 'api' || templateName === 'io';

  // Handle runtime image selection with preset loading
  const handleRuntimeImageChange = useCallback((imageKey: string): void => {
    const preset = runtimePresets[imageKey];
    if (preset) {
      setSandboxConfig({
        runtime_image: imageKey,
        container_port: preset.defaultPort,
        start_command: preset.defaultStartCommand,
        commands: { ...preset.defaultCommands }
      });
    } else {
      setSandboxConfig((prev) => ({
        ...prev,
        runtime_image: imageKey
      }));
    }
  }, []);

  // Set default values based on template
  useEffect(() => {
    if (templateName === 'api') {
      handleRuntimeImageChange('python:3.11-slim');
      fileChecksState.set(['app.py', 'requirements.txt']);
      sandboxConfigToggle.setTrue();
    } else if (templateName === 'io') {
      handleRuntimeImageChange('python:3.11-slim');
      setSandboxConfig(prev => ({
        ...prev,
        container_port: '5000',
        start_command: 'python main.py'
      }));
      fileChecksState.set(['main.py']);
      sandboxConfigToggle.setTrue();
    } else {
      sandboxConfigToggle.setFalse();
    }
  }, [templateName, handleRuntimeImageChange, fileChecksState, sandboxConfigToggle]);

  // File operations
  const handleAddFile = (): void => {
    if (newFileInput.value.trim() && !fileChecksState.items.includes(newFileInput.value.trim())) {
      fileChecksState.add(newFileInput.value.trim());
      newFileInput.clear();
    }
  };

  const handleRemoveFile = (index: number): void => {
    fileChecksState.remove(index);
  };

  // Command operations
  const handleAddCommand = (): void => {
    if (newCommandKeyInput.value.trim() && newCommandValueInput.value.trim()) {
      setSandboxConfig({
        ...sandboxConfig,
        commands: {
          ...sandboxConfig.commands,
          [newCommandKeyInput.value.trim()]: newCommandValueInput.value.trim()
        }
      });
      newCommandKeyInput.clear();
      newCommandValueInput.clear();
    }
  };

  const handleRemoveCommand = (key: string): void => {
    const newCommands = { ...sandboxConfig.commands };
    delete newCommands[key];
    setSandboxConfig({
      ...sandboxConfig,
      commands: newCommands
    });
  };

  // Sandbox config partial updates
  const handleSandboxConfigChange = (updates: Partial<SandboxConfig>): void => {
    setSandboxConfig(prev => ({ ...prev, ...updates }));
  };

  // Form submission with validation
  const handleSave = (): void => {
    if (isSetupRequired) {
      if (!sandboxConfig.runtime_image || !sandboxConfig.container_port || !sandboxConfig.start_command) {
        alert('Todos os campos de sandbox são obrigatórios para modelos API e IO!');
        return;
      }
      if (fileChecksState.items.length === 0) {
        alert('Pelo menos uma verificação de arquivo é obrigatória para modelos API e IO!');
        return;
      }
    }

    const config: SetupConfig = {
      file_checks: fileChecksState.items.length > 0 ? fileChecksState.items : null,
      sandbox: sandboxConfig.runtime_image ? {
        runtime_image: sandboxConfig.runtime_image,
        container_port: parseInt(sandboxConfig.container_port),
        start_command: sandboxConfig.start_command,
        commands: Object.keys(sandboxConfig.commands).length > 0 ? sandboxConfig.commands : null
      } : null
    };

    if (!config.file_checks && !config.sandbox) {
      onSave(null);
    } else {
      onSave(config);
    }
  };

  const handleCancel = (): void => {
    onSave(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-700">
      <SetupHeader isRequired={isSetupRequired} />

      <div className="space-y-8">
        {/* File Checks Section */}
        <FileChecksSection
          files={fileChecksState.items}
          inputValue={newFileInput.value}
          isRequired={isSetupRequired}
          onInputChange={newFileInput.onChange}
          onAdd={handleAddFile}
          onRemove={handleRemoveFile}
        />

        {/* Sandbox Configuration Section */}
        <SandboxConfigSection
          config={sandboxConfig}
          isRequired={isSetupRequired}
          isExpanded={sandboxConfigToggle.value}
          presets={runtimePresets}
          commandKeyInput={newCommandKeyInput.value}
          commandValueInput={newCommandValueInput.value}
          onExpand={sandboxConfigToggle.setTrue}
          onCollapse={sandboxConfigToggle.setFalse}
          onRuntimeChange={handleRuntimeImageChange}
          onConfigChange={handleSandboxConfigChange}
          onCommandKeyChange={newCommandKeyInput.onChange}
          onCommandValueChange={newCommandValueInput.onChange}
          onAddCommand={handleAddCommand}
          onRemoveCommand={handleRemoveCommand}
        />
      </div>

      {/* Action Buttons */}
      <ActionButtons onSave={handleSave} onCancel={handleCancel} /   </>
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
          Salvar Configuração
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <X className="w-5 h-5" />
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default SetupForm;
export type { SetupFormProps, SetupConfig, SandboxConfig, RuntimePreset };
