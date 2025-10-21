import React, { useState } from 'react';
import ReportTitleInput from './ReportTitleInput';
import ToggleSwitch from './ToggleSwitch';
import ResourceForm from './ResourceForm';
import ResourceList from './ResourceList';
import { toast } from 'react-toastify';

const FeedbackForm = ({ onSave, feedbackMode = 'ai' }) => {
  // State management
  const [reportTitle, setReportTitle] = useState("");
  const [feedbackTone, setFeedbackTone] = useState("");
  const [feedbackPersona, setFeedbackPersona] = useState("");
  const [activityContext, setActivityContext] = useState("");
  const [extraGuidelines, setExtraGuidelines] = useState("");
  const [solutionType, setSolutionType] = useState("hint");
  const [readingFiles, setReadingFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState("");
  const [toggleStates, setToggleStates] = useState({
    show_score: true,
    show_passed_tests: true,
    add_report_summary: true
  });
  const [resources, setResources] = useState([]);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [saveButtonAnimation, setSaveButtonAnimation] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Event handlers
  const handleToggle = (id) => {
    setToggleStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddResource = (newResource) => {
    setResources(prev => [...prev, newResource]);
  };

  const handleDeleteResource = (index) => {
    setResources(prev => prev.filter((_, i) => i !== index));
  };

  const assembleConfiguration = () => {
    // Backend expects: { general: {...}, ai: {...}, default: {...} }
    const config = {};
    
    // General configuration (only include if at least one value is set)
    const generalConfig = {};
    if (reportTitle && reportTitle.trim() !== '') {
      generalConfig.report_title = reportTitle;
    }
    if (toggleStates.show_passed_tests !== undefined) {
      generalConfig.show_passed_tests = toggleStates.show_passed_tests;
    }
    if (toggleStates.show_score !== undefined) {
      generalConfig.show_test_details = toggleStates.show_score; // Map to backend field
    }
    if (toggleStates.add_report_summary !== undefined) {
      generalConfig.add_report_summary = toggleStates.add_report_summary;
    }
    
    // Only add general key if at least one field is provided
    if (Object.keys(generalConfig).length > 0) {
      config.general = generalConfig;
    }
    
    // AI configuration (only if feedback mode is 'ai' and values are provided)
    if (feedbackMode === 'ai') {
      const aiConfig = {};
      if (feedbackTone) {
        aiConfig.feedback_tone = feedbackTone;
      }
      if (feedbackPersona) {
        aiConfig.feedback_persona = feedbackPersona;
      }
      if (activityContext) {
        aiConfig.assignment_context = activityContext;
      }
      if (extraGuidelines) {
        aiConfig.extra_orientations = extraGuidelines;
      }
      if (solutionType) {
        aiConfig.solution_type = solutionType;
      }
      if (readingFiles && readingFiles.length > 0) {
        aiConfig.submission_files_to_read = readingFiles;
      }
      
      if (Object.keys(aiConfig).length > 0) {
        config.ai = aiConfig;
      }
    }
    
    // Default configuration (custom category headers)
    const defaultConfig = {};
    if (toggleStates.add_report_summary || Object.keys(defaultConfig).length > 0) {
      defaultConfig.category_headers = {
        base: "✅ Essential Requirements",
        bonus: "⭐ Extra Points and Best Practices",
        penalty: "🚨 Points of Attention and Bad Practices"
      };
      config.default = defaultConfig;
    }
    
    // Include online resources (optional, can be empty array)
    if (resources && resources.length > 0) {
      config.online_resources = resources;
    }
    
    return config;
  };

  const validateConfiguration = () => {
    const errors = [];
    
    // Validate General section required fields
    if (!reportTitle || reportTitle.trim() === '') {
      errors.push('Título do Relatório é obrigatório');
    }
    
    // Note: toggleStates are boolean values and always exist with defaults
    // We validate that the user has explicitly set them (which they have via defaults)
    // The toggles show_score, show_passed_tests, and add_report_summary are required
    // but they have default values (true), so they're always present
    
    // Conteúdo Online is optional (resources array can be empty)
    
    // Only validate AI fields if feedback mode is 'ai'
    if (feedbackMode === 'ai') {
      // Validate Feedback Tone (required)
      if (!feedbackTone || feedbackTone.trim() === '') {
        errors.push('Tom do Feedback é obrigatório');
      }
      
      // Validate Feedback Persona (required)
      if (!feedbackPersona || feedbackPersona.trim() === '') {
        errors.push('Persona do Feedback é obrigatória');
      }
      
      // Validate Activity Context (required)
      if (!activityContext || activityContext.trim() === '') {
        errors.push('Contexto da Atividade é obrigatório');
      }
      
      // Validate Extra Guidelines (required)
      if (!extraGuidelines || extraGuidelines.trim() === '') {
        errors.push('Orientações Extras são obrigatórias');
      }
      
      // Validate Solution Type (required, but has default so should always exist)
      if (!solutionType || solutionType.trim() === '') {
        errors.push('Tipo de Fornecimento de Soluções é obrigatório');
      }
      
      // Validate Reading Files (required, at least one)
      if (!readingFiles || readingFiles.length === 0) {
        errors.push('Pelo menos um arquivo para leitura é obrigatório');
      }
    }
    
    // Note: resources (online resources) is optional and can be empty
    
    return errors;
  };

  const handleSave = () => {
    // Validate configuration before saving
    const validationErrors = validateConfiguration();
    
    if (validationErrors.length > 0) {
      validationErrors.forEach((err, idx) => {
        toast.error(`${idx + 1}. ${err}`);
      });
      return;
    }
    
    const config = assembleConfiguration();
    
    // Log final configuration to console
    console.log('Final Feedback Configuration:', JSON.stringify(config, null, 2));
    
    // Call parent callback if provided
    if (onSave) {
      onSave(config);
    }
    
    // Trigger celebration animation
    setSaveButtonAnimation(true);
    setShowSaveSuccess(true);
    setIsSaved(true);
    
    // Reset animation after it completes
    setTimeout(() => {
      setSaveButtonAnimation(false);
    }, 600);
    
    // Hide success message after 2 seconds
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 2000);
  };

  const handleCancelSave = () => {
    setIsSaved(false);
    // Call parent callback with null to indicate unsaved state
    if (onSave) {
      onSave(null);
    }
  };

  // Custom styles for toggle and animations
  const ToggleStyle = () => (
    <style jsx="true">{`
      .toggle-checkbox {
        transform: translate(0);
      }
      .toggle-checkbox:checked {
        transform: translateX(16px);
        border-color: #4f46e5;
      }
      .toggle-checkbox:checked + .toggle-label {
        background-color: #4f46e5;
      }
      .toggle-checkbox:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3);
      }
      
      /* Save celebration animation */
      @keyframes celebrate {
        0% {
          transform: scale(1);
        }
        25% {
          transform: scale(1.1) rotate(3deg);
        }
        50% {
          transform: scale(1.15) rotate(-3deg);
        }
        75% {
          transform: scale(1.1) rotate(2deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
      
      @keyframes confetti {
        0% {
          opacity: 1;
          transform: translateY(0) rotate(0deg);
        }
        100% {
          opacity: 0;
          transform: translateY(-100px) rotate(360deg);
        }
      }
      
      .save-celebrate {
        animation: celebrate 0.6s ease-in-out;
      }
      
      .confetti-particle {
        position: absolute;
        width: 8px;
        height: 8px;
        animation: confetti 0.8s ease-out forwards;
        pointer-events: none;
      }
      
      @keyframes slideInUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutDown {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(100%);
          opacity: 0;
        }
      }
      
      .toast-enter {
        animation: slideInUp 0.3s ease-out;
      }
      
      .toast-exit {
        animation: slideOutDown 0.3s ease-in;
      }
    `}</style>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 font-sans p-4 sm:p-8">
      <ToggleStyle />
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-10 p-4 border-b border-gray-700/50">
          <h1 className="text-4xl font-extrabold text-white">Configuração do Feedback</h1>
        </header>

        {/* Section Wrapper - General, AI, Standard */}
        <div className="space-y-8">
          {/* Seção Geral */}
          <section className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold border-b-2 border-gray-700 pb-3 mb-6 text-indigo-400">
              Geral
            </h2>
            
            <div className="space-y-6">
              <ReportTitleInput 
                title={reportTitle}
                onChange={setReportTitle}
              />

              {/* Configurações Booleanas (Toggles) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <ToggleSwitch 
                  id="show_score" 
                  label="Exibir Pontuação" 
                  isChecked={toggleStates.show_score}
                  onChange={() => handleToggle('show_score')}
                />
                <ToggleSwitch 
                  id="show_passed_tests" 
                  label="Exibir Testes Aprovados" 
                  isChecked={toggleStates.show_passed_tests}
                  onChange={() => handleToggle('show_passed_tests')}
                />
                <ToggleSwitch 
                  id="add_report_summary" 
                  label="Adicionar Resumo" 
                  isChecked={toggleStates.add_report_summary}
                  onChange={() => handleToggle('add_report_summary')}
                />
              </div>

              {/* Conteúdo Online */}
              <div className="pt-4 space-y-6">
                <div>
                  <p className="text-gray-400 font-medium mb-3 text-sm">
                    Adicionar Conteúdo Online de Apoio
                  </p>
                  <ResourceForm onSubmit={handleAddResource} />
                </div>

                <ResourceList 
                  resources={resources}
                  onDeleteResource={handleDeleteResource}
                />
              </div>
            </div>
          </section>

          {/* Seção IA - Only show if feedback mode is 'ai' */}
          {feedbackMode === 'ai' && (
            <section className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-700">
              <h2 className="text-2xl font-bold border-b-2 border-gray-700 pb-3 mb-6 text-indigo-400">
                Inteligência Artificial
              </h2>
            <div className="space-y-5 text-sm">
              {/* Fornecimento de Soluções */}
              <div>
                <p className="text-gray-400 font-medium mb-2">Fornecimento de Soluções</p>
                <div className="flex gap-3">
                  {["hint", "yes", "no"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSolutionType(type)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md transition-colors ${
                        solutionType === type 
                          ? "bg-indigo-600 text-white" 
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {type === "hint" ? "Dica" : type === "yes" ? "Sim" : "Não"}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tom do Feedback */}
              <ReportTitleInput
                title={feedbackTone}
                onChange={setFeedbackTone}
                label="Tom do Feedback"
                placeholder='Ex: "amigável, encorajador e direto ao ponto"'
              />
              
              {/* Persona do Feedback */}
              <ReportTitleInput
                title={feedbackPersona}
                onChange={setFeedbackPersona}
                label="Persona do Feedback"
                placeholder="Ex: Code Buddy, um colega programador mais experiente"
              />
              
              {/* Contexto da Atividade */}
              <div className="space-y-1">
                <p className="text-gray-400 font-medium text-sm">Contexto da Atividade</p>
                <textarea
                  value={activityContext}
                  onChange={(e) => setActivityContext(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-4 text-gray-300 text-xs leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[150px] resize-y"
                  placeholder="Descreva o contexto da atividade..."
                />
              </div>
              
              {/* Orientações Extras */}
              <div className="space-y-1">
                <p className="text-gray-400 font-medium text-sm">Orientações Extras</p>
                <textarea
                  value={extraGuidelines}
                  onChange={(e) => setExtraGuidelines(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl p-4 text-gray-300 text-xs leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[200px] resize-y"
                  placeholder="Digite as orientações extras aqui..."
                />
              </div>
              
              {/* Arquivos para Leitura */}
              <div className="space-y-3 ">
                <div className="flex flex-col justify-between gap-3">
                  <p className="text-gray-400 font-medium">Arquivos para Leitura</p>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={currentFile}
                      onChange={(e) => setCurrentFile(e.target.value)}
                      placeholder="Nome do arquivo..."
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => {
                        if (currentFile.trim()) {
                          setReadingFiles(prev => [...prev, currentFile.trim()]);
                          setCurrentFile("");
                        }
                      }}
                      type="button"
                      className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                <div>
                  {readingFiles.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">Nenhum arquivo adicionado</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {readingFiles.map((file, index) => (
                        <div
                          key={index}
                          className="group flex items-center bg-indigo-600 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full shadow-md"
                        >
                          {file}
                          <button
                            onClick={() => setReadingFiles(prev => prev.filter((_, i) => i !== index))}
                            className="ml-2 text-indigo-200 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          )}

          {/* Save Button - Always visible at the end */}
          <div className="mt-8 flex justify-end items-center gap-3 relative">
                <button
                  type="button"
                  disabled={isSaved}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-lg flex items-center gap-2 relative overflow-hidden ${
                    isSaved 
                      ? 'bg-green-600 text-white cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } ${saveButtonAnimation ? 'save-celebrate' : ''}`}
                  onClick={handleSave}
                >
                  {isSaved ? (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Saved
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                      </svg>
                      Salvar
                    </>
                  )}
                  {saveButtonAnimation && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <span
                          key={i}
                          className="confetti-particle"
                          style={{
                            left: '50%',
                            top: '50%',
                            backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5],
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
                    type="button"
                    onClick={handleCancelSave}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-150 flex items-center gap-2 text-sm"
                    title="Cancel and unsave changes"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                )}
              </div>
        </div>
        
        {/* Success Toast Notification */}
        {showSaveSuccess && (
          <div className="fixed bottom-8 right-8 z-50 toast-enter">
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border-2 border-green-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-bold">Saved!</p>
                <p className="text-sm text-green-100">Feedback saved successfully</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;