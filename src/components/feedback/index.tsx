import React, { ChangeEvent } from 'react';
import ReportTitleInput from './components/ReportTitleInput';
import ToggleSwitch from './components/ToggleSwitch';
import ResourceForm from './components/ResourceForm';
import ResourceList from './components/ResourceList';
import { SaveButton, Tooltip } from '../../shared';
import { useSaveState, useArrayState, useFormInput } from '../../hooks';
import useFeedbackForm, { FeedbackConfig, OnlineResource } from './hooks/useFeedbackForm';
import { TooltipContent } from './config/TooltipContent';

type FeedbackMode = 'ai' | 'static' | 'default';

interface FeedbackFormProps {
  onSave?: (config: FeedbackConfig | null) => void;
  feedbackMode?: FeedbackMode;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSave, feedbackMode = 'ai' }) => {
  // Custom hook for feedback form state and logic
  const feedbackForm = useFeedbackForm(feedbackMode);

  // Array states for resources and reading files
  const readingFilesState = useArrayState<string>([]);
  const currentFileInput = useFormInput("");
  const resourcesState = useArrayState<OnlineResource>([]);

  // Save state hook
  const { isSaved, showSuccess: showSaveSuccess, showAnimation: saveButtonAnimation, triggerSave, cancelSave } = useSaveState();

  // Event handlers
  const handleAddResource = (newResource: OnlineResource): void => {
    resourcesState.add(newResource);
  };

  const handleDeleteResource = (index: number): void => {
    resourcesState.remove(index);
  };

  const handleSave = (): void => {
    feedbackForm.handleSave(
      readingFilesState.items,
      resourcesState.items,
      onSave ?? undefined,
      triggerSave
    );
  };

  const handleCancelSave = (): void => {
    cancelSave();
    if (onSave) {
      onSave(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 font-sans p-4 sm:p-8">
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
                title={feedbackForm.reportTitle}
                onChange={feedbackForm.setReportTitle}
                label="Título do Relatório"
                tooltipText={TooltipContent.geral.Titulo_do_relatorio}
              />

              {/* Configurações Booleanas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <ToggleSwitch
                  id="show_score"
                  isChecked={feedbackForm.toggleStates.show_score}
                  onChange={() => feedbackForm.handleToggle('show_score')}
                  label="Exibir Pontuação"
                  tooltipText={TooltipContent.geral.Exibir_pontuacao}
                />
                <ToggleSwitch
                  id="show_passed_tests"
                  isChecked={feedbackForm.toggleStates.show_passed_tests}
                  onChange={() => feedbackForm.handleToggle('show_passed_tests')}
                  label="Exibir Testes Aprovados"
                  tooltipText={TooltipContent.geral.Exibir_testes_aprovados}
                />
                <ToggleSwitch
                  id="add_report_summary"
                  isChecked={feedbackForm.toggleStates.add_report_summary}
                  onChange={() => feedbackForm.handleToggle('add_report_summary')}
                  label="Adicionar Resumo"
                  tooltipText={TooltipContent.geral.Adicionar_resumo}
                />

              </div>

              {/* Conteúdo Online */}
              <div className="pt-4 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <p className="text-gray-400 font-medium">
                      Adicionar Conteúdo Online de Apoio
                    </p>
                    <Tooltip content={TooltipContent.geral.Adicionar_conteudo_online_de_apoio} />
                  </div>
                  <ResourceForm onSubmit={handleAddResource} />
                </div>

                <ResourceList
                  resources={resourcesState.items}
                  onDeleteResource={handleDeleteResource}
                />
              </div>
            </div>
          </section>

          {/* Seção IA - Only show if feedback mode is 'ai' */}
          {feedbackMode === 'ai' && (
            <section className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-700">
              <h2 className="text-2xl font-bold border-b-2 border-gray-700 pb-3 mb-6 text-indigo-400 flex items-center gap-3">
                Inteligência Artificial
                <Tooltip content={TooltipContent.ai.inteligencia_artificial} />
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Beta
                </span>
              </h2>
              <div className="space-y-5 text-sm">
                {/* Fornecimento de Soluções */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-gray-400 font-medium">
                      Fornecimento de Soluções
                    </p>
                    <Tooltip content={TooltipContent.ai.Fornecimento_de_solucoes} />
                  </div>

                  <div className="flex gap-3">
                    {(["hint", "yes", "no"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => feedbackForm.setSolutionType(type)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md transition-colors ${feedbackForm.solutionType === type
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
                  title={feedbackForm.feedbackTone}
                  onChange={feedbackForm.setFeedbackTone}
                  label="Tom do Feedback"
                  tooltipText={TooltipContent.ai.Tom_do_feedback}
                  placeholder='Ex: "amigável, encorajador e direto ao ponto"'
                />


                {/* Persona do Feedback */}
                <ReportTitleInput
                  title={feedbackForm.feedbackPersona}
                  onChange={feedbackForm.setFeedbackPersona}
                  label="Persona do Feedback"
                  tooltipText={TooltipContent.ai.Persona_do_feedback}
                  placeholder="Ex: Code Buddy, um colega programador mais experiente"
                />

                {/* Contexto da Atividade */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 font-medium text-sm">Contexto da Atividade</p>
                    <Tooltip content={TooltipContent.ai.Contexto_da_atividade} />
                  </div>
                  <textarea
                    value={feedbackForm.activityContext}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => feedbackForm.setActivityContext(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl p-4 text-gray-300 text-xs leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[150px] resize-y"
                    placeholder="Descreva o contexto da atividade..."
                  />
                </div>

                {/* Orientações Extras */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-400 font-medium text-sm">Orientações Extras</p>
                    <Tooltip content={TooltipContent.ai.Orientacoes_extras} />
                  </div>
                  <textarea
                    value={feedbackForm.extraGuidelines}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => feedbackForm.setExtraGuidelines(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl p-4 text-gray-300 text-xs leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[200px] resize-y"
                    placeholder="Digite as orientações extras aqui..."
                  />
                </div>

                {/* Arquivos para Leitura */}
                <div className="space-y-3 ">
                  <div className="flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="text-gray-400 font-medium">Arquivos para Leitura</p>
                      <Tooltip content={TooltipContent.ai.Arquivos_para_leitura} />
                    </div>

                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={currentFileInput.value}
                        onChange={currentFileInput.onChange}
                        placeholder="Nome do arquivo..."
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => {
                          if (currentFileInput.value.trim()) {
                            readingFilesState.add(currentFileInput.value.trim());
                            currentFileInput.clear();
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
                    {readingFilesState.items.length === 0 ? (
                      <p className="text-gray-500 italic text-sm">Nenhum arquivo adicionado</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {readingFilesState.items.map((file, index) => (
                          <div
                            key={index}
                            className="group flex items-center bg-indigo-600 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full shadow-md"
                          >
                            {file}
                            <button
                              onClick={() => readingFilesState.remove(index)}
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
          <SaveButton
            isSaved={isSaved}
            showAnimation={saveButtonAnimation}
            showSuccessToast={showSaveSuccess}
            onSave={handleSave}
            onCancel={handleCancelSave}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
