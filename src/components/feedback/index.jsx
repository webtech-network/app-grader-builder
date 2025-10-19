import React, { useState } from 'react';
import ReportTitleInput from './ReportTitleInput';
import ToggleSwitch from './ToggleSwitch';
import ResourceForm from './ResourceForm';
import ResourceList from './ResourceList';

const FeedbackForm = () => {
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
    const config = {
      general: {
        report_title: reportTitle,
        show_score: toggleStates.show_score,
        show_passed_tests: toggleStates.show_passed_tests,
        add_report_summary: toggleStates.add_report_summary,
        online_content: resources.map(resource => ({
          url: resource.url,
          description: resource.title,
          linked_tests: resource.tags
        }))
      },
      ai: {
        provide_solutions: solutionType,
        feedback_tone: feedbackTone,
        feedback_persona: feedbackPersona,
        assignment_context: activityContext,
        extra_orientations: extraGuidelines,
        submission_files_to_read: readingFiles
      },
      default: {
        category_headers: {
          base: "✅ Essential Requirements",
          bonus: "⭐ Extra Points and Best Practices",
          penalty: "🚨 Points of Attention and Bad Practices"
        }
      }
    };
    //TODO: remover este log
    console.log(JSON.stringify(config, null, 2));
    return config;
  };

  // Custom styles for toggle
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

          {/* Seção IA */}
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
              
              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  className="px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-lg"
                  onClick={assembleConfiguration}
                >
                  Salvar
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;