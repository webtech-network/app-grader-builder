/**
 * @fileoverview Tag/chip input component for managing lists of strings.
 * @module components/feedback/components/TagInput
 */

import React from 'react';
import { Tooltip } from '../../../shared';
import { useFormInput } from '../../../hooks';

/**
 * Props for the TagInput component.
 * @interface TagInputProps
 */
interface TagInputProps {
  /** Label text displayed above the input */
  label: string;
  /** Optional tooltip text for additional context */
  tooltipText?: string;
  /** Current array of tag/item strings */
  items: string[];
  /** Callback fired when a new item is added */
  onAdd: (item: string) => void;
  /** Callback fired when an item is removed (by index) */
  onRemove: (index: number) => void;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Message shown when the items array is empty */
  emptyMessage?: string;
  /** Text for the add button */
  addButtonText?: string;
  /** Tailwind classes for tag/chip styling */
  tagColorClass?: string;
}

/**
 * TagInput - An input component for managing a list of string tags/chips.
 * 
 * @description Provides a text input with an add button for building a list
 * of tags displayed as removable chips. Supports Enter key for quick adding,
 * customizable styling, and empty state messaging. Ideal for managing file
 * lists, tags, or any collection of string values.
 * 
 * @example
 * ```tsx
 * <TagInput
 *   label="Files to Read"
 *   tooltipText="Add files to include in the context"
 *   items={files}
 *   onAdd={(file) => setFiles([...files, file])}
 *   onRemove={(index) => setFiles(files.filter((_, i) => i !== index))}
 *   placeholder="Enter filename..."
 *   emptyMessage="No files added yet"
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered TagInput component
 */
const TagInput: React.FC<TagInputProps> = ({
  label,
  tooltipText,
  items,
  onAdd,
  onRemove,
  placeholder = 'Digite aqui...',
  emptyMessage = 'Nenhum item adicionado',
  addButtonText = 'Adicionar',
  tagColorClass = 'bg-indigo-600 text-white'
}) => {
  const inputState = useFormInput('');

  const handleAdd = () => {
    if (inputState.value.trim()) {
      onAdd(inputState.value.trim());
      inputState.clear();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col justify-between gap-3">
        <div className="flex items-center gap-2">
          <p className="text-gray-400 font-medium">{label}</p>
          {tooltipText && <Tooltip content={tooltipText} />}
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={inputState.value}
            onChange={inputState.onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleAdd}
            type="button"
            className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
          >
            {addButtonText}
          </button>
        </div>
      </div>

      <div>
        {items.length === 0 ? (
          <p className="text-gray-500 italic text-sm">{emptyMessage}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <div
                key={index}
                className={`group flex items-center text-xs font-mono font-semibold px-3 py-1 rounded-full shadow-md ${tagColorClass}`}
              >
                {item}
                <button
                  onClick={() => onRemove(index)}
                  type="button"
                  className="ml-2 text-indigo-200 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remover ${item}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;
