/**
 * @fileoverview AI configuration section component for feedback settings.
 * @module components/feedback/components/AISection
 */

import React, { Dispatch, SetStateAction } from 'react';
import Section from './Section';
import ReportTitleInput from './ReportTitleInput';
import LabeledTextArea from './LabeledTextArea';
import ButtonGroup from './ButtonGroup';
import TagInput from './TagInput';
import { TooltipContent } from '../config/TooltipContent';

/**
 * Defines how solutions should be provided in feedback.
 * - 'hint': Provide hints without full solutions
 * - 'yes': Provide complete solutions
 * - 'no': Do not provide solutions
 */
type SolutionType = 'hint' | 'yes' | 'no';

/**
 * Props for the AISection component.
 * @interface AISectionProps
 */
interface AISectionProps {
  // -------------------------------------------------------------------------
  // Solution Type
  // -------------------------------------------------------------------------
  /** Current solution type selection */
  solutionType: SolutionType;
  /** Callback for solution type changes */
  onSolutionTypeChange: Dispatch<SetStateAction<SolutionType>>;
  
  // -------------------------------------------------------------------------
  // Feedback Tone
  // -------------------------------------------------------------------------
  /** Current feedback tone value */
  feedbackTone: string;
  /** Callback for feedback tone changes */
  onFeedbackToneChange: Dispatch<SetStateAction<string>>;
  
  // -------------------------------------------------------------------------
  // Feedback Persona
  // -------------------------------------------------------------------------
  /** Current feedback persona value */
  feedbackPersona: string;
  /** Callback for feedback persona changes */
  onFeedbackPersonaChange: Dispatch<SetStateAction<string>>;
  
  // -------------------------------------------------------------------------
  // Activity Context
  // -------------------------------------------------------------------------
  /** Current activity context value */
  activityContext: string;
  /** Callback for activity context changes */
  onActivityContextChange: Dispatch<SetStateAction<string>>;
  
  // -------------------------------------------------------------------------
  // Extra Guidelines
  // -------------------------------------------------------------------------
  /** Current extra guidelines value */
  extraGuidelines: string;
  /** Callback for extra guidelines changes */
  onExtraGuidelinesChange: Dispatch<SetStateAction<string>>;
  
  // -------------------------------------------------------------------------
  // Reading Files
  // -------------------------------------------------------------------------
  /** Current array of files to read */
  readingFiles: string[];
  /** Callback for adding a reading file */
  onAddReadingFile: (file: string) => void;
  /** Callback for removing a reading file (by index) */
  onRemoveReadingFile: (index: number) => void;
  
  // -------------------------------------------------------------------------
  // Visibility Flags (optional)
  // -------------------------------------------------------------------------
  /** Whether to show solution type selector. Defaults to true. */
  showSolutionType?: boolean;
  /** Whether to show feedback tone input. Defaults to true. */
  showFeedbackTone?: boolean;
  /** Whether to show feedback persona input. Defaults to true. */
  showFeedbackPersona?: boolean;
  /** Whether to show activity context textarea. Defaults to true. */
  showActivityContext?: boolean;
  /** Whether to show extra guidelines textarea. Defaults to true. */
  showExtraGuidelines?: boolean;
  /** Whether to show reading files input. Defaults to true. */
  showReadingFiles?: boolean;
}

/**
 * Predefined options for the solution type button group.
 * @constant
 */
const SOLUTION_TYPE_OPTIONS: { value: SolutionType; label: string }[] = [
  { value: 'hint', label: 'Dica' },
  { value: 'yes', label: 'Sim' },
  { value: 'no', label: 'Não' }
];

/**
 * AISection - The AI configuration section of the feedback form.
 * 
 * @description A complete section for configuring AI-powered feedback generation.
 * Includes controls for:
 * - Solution type (hint/yes/no)
 * - Feedback tone (friendly, encouraging, etc.)
 * - Feedback persona (Code Buddy, mentor, etc.)
 * - Activity context (description of the assignment)
 * - Extra guidelines (additional AI instructions)
 * - Files to read (for context)
 * 
 * All sub-sections can be individually hidden using visibility props.
 * Marked with a 'Beta' badge to indicate experimental feature status.
 * 
 * @example
 * ```tsx
 * <AISection
 *   solutionType={solutionType}
 *   onSolutionTypeChange={setSolutionType}
 *   feedbackTone={tone}
 *   onFeedbackToneChange={setTone}
 *   feedbackPersona={persona}
 *   onFeedbackPersonaChange={setPersona}
 *   activityContext={context}
 *   onActivityContextChange={setContext}
 *   extraGuidelines={guidelines}
 *   onExtraGuidelinesChange={setGuidelines}
 *   readingFiles={files}
 *   onAddReadingFile={addFile}
 *   onRemoveReadingFile={removeFile}
 *   showSolutionType={true}
 *   showReadingFiles={false}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered AISection component
 */
const AISection: React.FC<AISectionProps> = ({
  solutionType,
  onSolutionTypeChange,
  feedbackTone,
  onFeedbackToneChange,
  feedbackPersona,
  onFeedbackPersonaChange,
  activityContext,
  onActivityContextChange,
  extraGuidelines,
  onExtraGuidelinesChange,
  readingFiles,
  onAddReadingFile,
  onRemoveReadingFile,
  showSolutionType = true,
  showFeedbackTone = true,
  showFeedbackPersona = true,
  showActivityContext = true,
  showExtraGuidelines = true,
  showReadingFiles = true
}) => {
  return (
    <Section
      title="Inteligência Artificial"
      tooltipText={TooltipContent.ai.inteligencia_artificial}
      badge={{ text: 'Beta' }}
    >
      <div className="space-y-5 text-sm">
        {showSolutionType && (
          <ButtonGroup<SolutionType>
            label="Fornecimento de Soluções"
            tooltipText={TooltipContent.ai.Fornecimento_de_solucoes}
            options={SOLUTION_TYPE_OPTIONS}
            selectedValue={solutionType}
            onSelect={onSolutionTypeChange}
          />
        )}

        {showFeedbackTone && (
          <ReportTitleInput
            title={feedbackTone}
            onChange={onFeedbackToneChange}
            label="Tom do Feedback"
            tooltipText={TooltipContent.ai.Tom_do_feedback}
            placeholder='Ex: "amigável, encorajador e direto ao ponto"'
          />
        )}

        {showFeedbackPersona && (
          <ReportTitleInput
            title={feedbackPersona}
            onChange={onFeedbackPersonaChange}
            label="Persona do Feedback"
            tooltipText={TooltipContent.ai.Persona_do_feedback}
            placeholder="Ex: Code Buddy, um colega programador mais experiente"
          />
        )}

        {showActivityContext && (
          <LabeledTextArea
            value={activityContext}
            onChange={onActivityContextChange}
            label="Contexto da Atividade"
            tooltipText={TooltipContent.ai.Contexto_da_atividade}
            placeholder="Descreva o contexto da atividade..."
            minHeight="150px"
          />
        )}

        {showExtraGuidelines && (
          <LabeledTextArea
            value={extraGuidelines}
            onChange={onExtraGuidelinesChange}
            label="Orientações Extras"
            tooltipText={TooltipContent.ai.Orientacoes_extras}
            placeholder="Digite as orientações extras aqui..."
            minHeight="200px"
          />
        )}

        {showReadingFiles && (
          <TagInput
            label="Arquivos para Leitura"
            tooltipText={TooltipContent.ai.Arquivos_para_leitura}
            items={readingFiles}
            onAdd={onAddReadingFile}
            onRemove={onRemoveReadingFile}
            placeholder="Nome do arquivo..."
            emptyMessage="Nenhum arquivo adicionado"
            addButtonText="Adicionar"
          />
        )}
      </div>
    </Section>
  );
};

export default AISection;
