/**
 * @fileoverview Configuration form for test parameters.
 * @module components/criteria/components/TestConfigForm
 */

import React, { FormEvent, ChangeEvent } from 'react';
import { Settings } from 'lucide-react';
import { TestTemplate, TestParameter } from '../utils';
import ParameterInput from './ParameterInput';

/**
 * Props for the TestConfigForm component.
 * @interface TestConfigFormProps
 */
interface TestConfigFormProps {
    /** Test template being configured */
    testTemplate: TestTemplate;
    /** Custom name for the test node */
    customName: string;
    /** Current parameter values */
    params: Record<string, unknown>;
    /** Whether in edit mode (vs creation mode) */
    isEditing: boolean;
    /** Callback when custom name changes */
    onNameChange: (name: string) => void;
    /** Callback when a parameter value changes */
    onParamChange: (name: string, value: string, type: string) => void;
    /** Callback to get display value for a parameter */
    getParamValue: (name: string, type: string) => string;
    /** Callback when form is submitted */
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    /** Callback to clear/reset the form */
    onClear: () => void;
}

/**
 * TestConfigForm - Form for configuring test parameters.
 * 
 * @description Displays test details and a form for setting:
 * - Custom test name
 * - All configurable parameters
 * 
 * Filters out system parameters (dictionary, submission_files, etc.)
 * and provides appropriate input fields for each parameter type.
 * 
 * @example
 * ```tsx
 * <TestConfigForm
 *   testTemplate={template}
 *   customName="My Test"
 *   params={{ count: 5 }}
 *   isEditing={false}
 *   onNameChange={(name) => setName(name)}
 *   onParamChange={(name, val, type) => updateParam(name, val)}
 *   getParamValue={(name, type) => String(params[name])}
 *   onSubmit={handleSubmit}
 *   onClear={clearForm}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered TestConfigForm component
 */
const TestConfigForm: React.FC<TestConfigFormProps> = ({
    testTemplate,
    customName,
    params,
    isEditing,
    onNameChange,
    onParamChange,
    getParamValue,
    onSubmit,
    onClear
}) => {
    // Filter out system parameters that users don't configure
    const userConfigurableParameters = testTemplate.parameters.filter((p: TestParameter) => 
        p.type !== 'dictionary' && 
        p.name !== 'submission_files' && 
        p.name !== 'html_file' && 
        p.name !== 'js_file'
    );

    const nodeLabel = customName.trim() || testTemplate.displayName;
    const buttonText = isEditing ? 'Atualizar Teste' : 'Adicionar Teste';

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
        onNameChange(e.target.value);
    };

    return (
        <div className="w-1/2 ml-4 p-4 overflow-y-auto">
            {/* Header */}
            <h4 className="text-lg font-bold mb-2 text-indigo-400 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                {isEditing ? 'Editando' : 'Configurar'}: {nodeLabel}
            </h4>
            <p className="text-gray-400 mb-4 text-sm">{testTemplate.description}</p>
            
            {/* Required File Badge */}
            <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                <p className="text-xs font-semibold text-gray-300">
                    Arquivo Requerido:{' '}
                    <span className="text-yellow-400">{testTemplate.required_file || 'N/A'}</span>
                </p>
            </div>
            
            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
                {/* Custom Name Input */}
                <div className="pb-2">
                    <label className="block text-gray-300 text-sm font-semibold mb-1">
                        Nome do Teste
                    </label>
                    <input
                        type="text"
                        value={customName}
                        onChange={handleNameChange}
                        placeholder={testTemplate.displayName}
                        className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                {/* Parameters Section */}
                <h5 className="text-sm font-bold text-gray-300 pt-2 border-t border-gray-700">
                    Parâmetros ({userConfigurableParameters.length})
                </h5>

                {userConfigurableParameters.length === 0 ? (
                    <p className="text-green-500 text-sm">Este teste não requer parâmetros.</p>
                ) : (
                    userConfigurableParameters.map((p: TestParameter) => (
                        <ParameterInput
                            key={p.name}
                            parameter={p}
                            value={getParamValue(p.name, p.type)}
                            onChange={onParamChange}
                        />
                    ))
                )}
                
                {/* Action Buttons */}
                <div className="flex justify-end pt-4 space-x-3">
                    <button
                        type="button"
                        onClick={onClear}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition duration-150 text-sm"
                    >
                        Limpar / Voltar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 text-sm"
                    >
                        {buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TestConfigForm;
