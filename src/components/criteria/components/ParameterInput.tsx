/**
 * @fileoverview Individual parameter input field for test configuration.
 * @module components/criteria/components/ParameterInput
 */

import React, { ChangeEvent } from 'react';
import { TestParameter } from '../utils';

/**
 * Props for the ParameterInput component.
 * @interface ParameterInputProps
 */
interface ParameterInputProps {
    /** Parameter definition from the test template */
    parameter: TestParameter;
    /** Current value of the parameter */
    value: string;
    /** Callback when value changes */
    onChange: (name: string, value: string, type: string) => void;
}

/**
 * ParameterInput - Input field for a test parameter.
 * 
 * @description Renders an appropriate input field based on parameter type
 * with label, type hint, and validation attributes. Supports:
 * - string, integer, number: text input
 * - list of strings: comma-separated input
 * - boolean: text input (true/false)
 * 
 * @example
 * ```tsx
 * <ParameterInput
 *   parameter={{ name: 'count', type: 'integer', description: 'Number of items' }}
 *   value="5"
 *   onChange={(name, val, type) => updateParam(name, val)}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered ParameterInput component
 */
const ParameterInput: React.FC<ParameterInputProps> = ({ parameter, value, onChange }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        onChange(parameter.name, e.target.value, parameter.type);
    };

    return (
        <div>
            <label className="block text-gray-300 text-sm font-semibold mb-1">
                {parameter.description}
            </label>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Tipo esperado: `{parameter.type}`</p>
        </div>
    );
};

export default ParameterInput;
