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
  const [extraGuidelines, setExtraGuidelines] = useState("");
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
          <h1 className="text-4xl font-extrabold text-white">Visualizador de Configuração</h1>
          <p className="text-lg text-gray-400 mt-2">Uma apresentação clara dos parâmetros do relatório.</p>
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
                <p className="text-gray-400 font-medium mb-1">Fornecimento de Soluções</p>
                <p className="text-gray-50">
                  <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    hint
                  </span>
                </p>
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
              <div>
                <p className="text-gray-400 font-medium mb-1">Contexto da Atividade</p>
                <p className="bg-gray-700 p-4 rounded-xl text-gray-300 text-xs leading-relaxed border border-gray-600">
                  O objetivo desta atividade é criar um portal de notícias com duas páginas: uma home (`index.html`) que exibe uma lista de notícias em formato de 'cards', e uma página de detalhes (`detalhes.html`) que mostra o conteúdo completo de uma notícia. Todo o conteúdo deve ser carregado dinamicamente a partir de uma estrutura de dados (array de objetos) no ficheiro `app.js`. É proibido o uso de frameworks como React, Vue ou Angular.
                </p>
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
              <div>
                <p className="text-gray-400 font-medium mb-1">Arquivos para Leitura</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-indigo-600 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full shadow-md">index.html</span>
                  <span className="bg-indigo-600 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full shadow-md">detalhes.html</span>
                  <span className="bg-indigo-600 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full shadow-md">css/styles.css</span>
                  <span className="bg-indigo-600 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full shadow-md">app.js</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;