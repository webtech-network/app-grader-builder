import React, { ChangeEvent } from 'react';
import { Tooltip } from '../../../shared';

interface ReportTitleInputProps {
  title: string;
  onChange: (value: string) => void;
  label?: string;
  tooltipText?: string;
  placeholder?: string;
}

const ReportTitleInput: React.FC<ReportTitleInputProps> = ({ 
  title, 
  onChange, 
  label = "Título do Relatório",
  tooltipText,
  placeholder = "Digite o título do relatório"
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="text-gray-400 font-medium mb-1 text-sm block">
          {label}
        </label>
        {tooltipText && <Tooltip content={tooltipText} />}
      </div>
      
      <input
        type="text"
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-50 text-base font-semibold placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        placeholder={placeholder}
      />
    </div>
  );
};

export default ReportTitleInput;
