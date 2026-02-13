/**
 * @fileoverview Complete file checks configuration section.
 * @module components/setup/components/FileChecksSection
 */

import React from 'react';
import SectionTitle from './SectionTitle';
import FileCheckItem from './FileCheckItem';
import FileCheckInput from './FileCheckInput';

/**
 * Props for the FileChecksSection component.
 * @interface FileChecksSectionProps
 */
interface FileChecksSectionProps {
    /** List of file names to check */
    files: string[];
    /** Input value for new file */
    inputValue: string;
    /** Whether this section is required */
    isRequired: boolean;
    /** Callback when input value changes */
    onInputChange: (value: string) => void;
    /** Callback to add new file */
    onAdd: () => void;
    /** Callback to remove file by index */
    onRemove: (index: number) => void;
}

/**
 * FileChecksSection - Complete section for managing required files.
 * 
 * @description Displays title, description, file list, and add input for
 * managing file requirements. Shows optional badge when not required.
 * 
 * @example
 * ```tsx
 * <FileChecksSection
 *   files={['main.py', 'requirements.txt']}
 *   inputValue=""
 *   isRequired={true}
 *   onInputChange={setInput}
 *   onAdd={addFile}
 *   onRemove={removeFile}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered FileChecksSection component
 */
const FileChecksSection: React.FC<FileChecksSectionProps> = ({
    files,
    inputValue,
    isRequired,
    onInputChange,
    onAdd,
    onRemove
}) => {
    return (
        <div>
            <SectionTitle 
                icon="📁" 
                title="Arquivos Obrigatórios" 
                optional={!isRequired}
            />
            <p className="text-gray-400 text-sm mb-4">
                Especifique os arquivos que devem estar presentes na submissão do aluno
            </p>

            {/* File List */}
            {files.length > 0 && (
                <div className="mb-4 space-y-2">
                    {files.map((file, index) => (
                        <FileCheckItem
                            key={index}
                            fileName={file}
                            onDelete={() => onRemove(index)}
                        />
                    ))}
                </div>
            )}

            {/* Add File Input */}
            <FileCheckInput
                value={inputValue}
                onChange={onInputChange}
                onAdd={onAdd}
            />
        </div>
    );
};

export default FileChecksSection;
