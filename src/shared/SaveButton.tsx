import React from 'react';

interface SaveButtonProps {
    isSaved: boolean;
    showAnimation: boolean;
    showSuccessToast: boolean;
    onSave: () => void;
    onCancel: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ 
    isSaved, 
    showAnimation, 
    showSuccessToast,
    onSave, 
    onCancel 
}) => {
    return (
        <>
            {/* Save/Cancel Buttons */}
            <div className="flex justify-start items-center gap-3 relative">
                <button
                    onClick={onSave}
                    disabled={isSaved}
                    className={`px-4 py-2 font-medium rounded-lg transition duration-150 flex items-center gap-2 text-sm relative overflow-hidden ${
                        isSaved 
                            ? 'bg-green-600 text-white cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    } ${showAnimation ? 'save-celebrate' : ''}`}
                >
                    {isSaved ? (
                        <>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Salvo
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                            </svg>
                            Salvar Critérios
                        </>
                    )}
                    {showAnimation && (
                        <>
                            {[...Array(8)].map((_, i) => (
                                <span
                                    key={i}
                                    className="confetti-particle"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        backgroundColor: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i % 5],
                                        transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateX(${20 + i * 5}px)`,
                                        animationDelay: `${i * 0.05}s`
                                    }}
                                />
                            ))}
                        </>
                    )}
                </button>
                
                {isSaved && (
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-150 flex items-center gap-2 text-sm"
                        title="Cancelar e descartar alterações"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelar
                    </button>
                )}
            </div>

            {/* Success Toast Notification */}
            {showSuccessToast && (
                <div className="fixed bottom-8 right-8 z-50 toast-enter">
                    <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border-2 border-green-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                            <p className="font-bold">Salvo!</p>
                            <p className="text-sm text-green-100">Critérios salvos com sucesso</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SaveButton;
