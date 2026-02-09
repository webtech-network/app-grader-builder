/**
 * @fileoverview General settings section component for feedback configuration.
 * @module components/feedback/components/GeneralSection
 */

import React from 'react';
import Section from './Section';
import ReportTitleInput from './ReportTitleInput';
import ToggleGrid from './ToggleGrid';
import OnlineContentSection from './OnlineContentSection';
import { TooltipContent } from '../config/TooltipContent';

/**
 * State object for general toggle settings.
 * @interface ToggleStates
 */
interface ToggleStates {
  /** Whether to show the numeric score */
  show_score: boolean;
  /** Whether to show passed tests in the report */
  show_passed_tests: boolean;
  /** Whether to add a summary section to the report */
  add_report_summary: boolean;
}

/**
 * Represents an online learning resource.
 * @interface OnlineResource
 */
interface OnlineResource {
  /** Display title of the resource */
  title: string;
  /** URL to the online resource */
  url: string;
  /** Tags/tests associated with this resource */
  tags: string[];
}

/**
 * Props for the GeneralSection component.
 * @interface GeneralSectionProps
 */
interface GeneralSectionProps {
  /** Current report title value */
  reportTitle: string;
  /** Callback for report title changes */
  onReportTitleChange: (value: string) => void;
  /** Current toggle states object */
  toggleStates: ToggleStates;
  /** Callback fired when a toggle is changed */
  onToggle: (id: keyof ToggleStates) => void;
  /** Current array of online resources */
  resources: OnlineResource[];
  /** Callback for adding a new resource */
  onAddResource: (resource: OnlineResource) => void;
  /** Callback for deleting a resource (by index) */
  onDeleteResource: (index: number) => void;
  /** Whether to show the online content section. Defaults to true. */
  showOnlineContent?: boolean;
}

/**
 * GeneralSection - The general settings section of the feedback form.
 * 
 * @description A complete section component that includes:
 * - Report title input
 * - Toggle grid for display options (score, passed tests, summary)
 * - Online content/resources section (optional)
 * 
 * Uses predefined tooltip content from the config for consistent help text.
 * 
 * @example
 * ```tsx
 * <GeneralSection
 *   reportTitle={title}
 *   onReportTitleChange={setTitle}
 *   toggleStates={toggles}
 *   onToggle={handleToggle}
 *   resources={resources}
 *   onAddResource={addResource}
 *   onDeleteResource={removeResource}
 *   showOnlineContent={true}
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered GeneralSection component
 */
const GeneralSection: React.FC<GeneralSectionProps> = ({
  reportTitle,
  onReportTitleChange,
  toggleStates,
  onToggle,
  resources,
  onAddResource,
  onDeleteResource,
  showOnlineContent = true
}) => {
  const toggleConfigs = [
    {
      id: 'show_score',
      label: 'Exibir Pontuação',
      tooltipText: TooltipContent.geral.Exibir_pontuacao,
      isChecked: toggleStates.show_score
    },
    {
      id: 'show_passed_tests',
      label: 'Exibir Testes Aprovados',
      tooltipText: TooltipContent.geral.Exibir_testes_aprovados,
      isChecked: toggleStates.show_passed_tests
    },
    {
      id: 'add_report_summary',
      label: 'Adicionar Resumo',
      tooltipText: TooltipContent.geral.Adicionar_resumo,
      isChecked: toggleStates.add_report_summary
    }
  ];

  return (
    <Section title="Geral">
      <div className="space-y-6">
        <ReportTitleInput
          title={reportTitle}
          onChange={onReportTitleChange}
          label="Título do Relatório"
          tooltipText={TooltipContent.geral.Titulo_do_relatorio}
        />

        <ToggleGrid
          toggles={toggleConfigs}
          onToggle={(id) => onToggle(id as keyof ToggleStates)}
          columns={3}
        />

        {showOnlineContent && (
          <OnlineContentSection
            tooltipText={TooltipContent.geral.Adicionar_conteudo_online_de_apoio}
            resources={resources}
            onAddResource={onAddResource}
            onDeleteResource={onDeleteResource}
          />
        )}
      </div>
    </Section>
  );
};

export default GeneralSection;
