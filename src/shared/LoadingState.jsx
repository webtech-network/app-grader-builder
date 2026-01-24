import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ templateName }) => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-50 font-sans p-6 md:p-10 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
                <p className="text-xl text-gray-300">Loading template...</p>
                <p className="text-sm text-gray-500 mt-2">Fetching {templateName} configuration</p>
            </div>
        </div>
    );
};

export default LoadingState;
