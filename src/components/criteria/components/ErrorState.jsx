import React from 'react';

const ErrorState = ({ error }) => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-50 font-sans p-6 md:p-10 flex items-center justify-center">
            <div className="text-center max-w-md">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Template</h2>
                <p className="text-gray-400 mb-4">{error}</p>
                <p className="text-sm text-gray-500">
                    Please try selecting a different template or refresh the page.
                </p>
            </div>
        </div>
    );
};

export default ErrorState;
