import React from 'react';

const ToggleSwitch = ({ id, label, isChecked, onChange }) => {
  const containerId = `toggle-${id}`;
  return (
    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-xl border border-gray-700 shadow-md">
      <span className="font-medium text-gray-300 text-sm">{label}</span>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input 
          type="checkbox" 
          name={id}
          id={containerId} 
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in z-10" 
          checked={isChecked}
          onChange={onChange}
        />
        <label 
          htmlFor={containerId} 
          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer transition-colors duration-200 ease-in"
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;