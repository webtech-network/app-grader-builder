import React from 'react';

const ReportTitleInput = ({ 
  title, 
  onChange, 
  label = "Título do Relatório",
  placeholder = "Digite o título do relatório"
}) => {
  return (
    <div>
      <label className="text-gray-400 font-medium mb-1 text-sm block">
        {label}
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-50 text-base font-semibold placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        placeholder={placeholder}
      />
    </div>
  );
};

export default ReportTitleInput;