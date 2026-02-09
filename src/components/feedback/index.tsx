/**
 * @fileoverview Main FeedbackForm component for configuring feedback settings.
 * This is the primary entry point for the feedback configuration feature.
 * 
 * @description Provides a complete form interface for configuring how feedback
 * is generated and displayed to students, including general settings and
 * AI-powered feedback options.
 * 
 * @module components/feedback
 */

import React from 'react';
import { FormHeader, GeneralSection, AISection } from './components';
import { SaveButton } from '../../shared';
import { useSaveState, useArrayState } from '../../hooks';
import useFeedbackForm, { FeedbackConfig, OnlineResource } from './hooks/useFeedbackForm';

/**
 * Defines the feedback generation mode.
 * - 'ai': Uses AI to generate personalized feedback
 * - 'static': Uses predefined static feedback templates
 * - 'default': Uses default system feedback
 */
type FeedbackMode = 'ai' | 'static' | 'default';

/**
 * Props for the FeedbackForm component.
 * @interface FeedbackFormProps
 */
interface FeedbackFormProps {
  /** Callback triggered when the form is saved. Receives the config or null if cancelled. */
  onSave?: (config: FeedbackConfig | null) => void;
  /** The feedback generation mode. Defaults to 'ai'. */
  feedbackMode?: FeedbackMode;
  /** Whether to display the form header. Defaults to true. */
  showHeader?: boolean;
  /** Custom title for the form header. Defaults to 'Configuração do Feedback'. */
  headerTitle?: string;
  /** Optional subtitle for the form header. */
  headerSubtitle?: string;
  /** Whether to show the online content/resources section. Defaults to true. */
  showOnlineContent?: boolean;
}

/**
 * FeedbackForm - Main component for configuring feedback settings.
 * 
 * @description A comprehensive form that allows instructors to configure how
 * feedback is generated and presented to students. Supports both AI-powered
 * and static feedback modes with customizable display options.
 * 
 * @example
 * ```tsx
 * <FeedbackForm
 *   feedbackMode="ai"
 *   onSave={(config) => console.log(config)}
 *   showHeader={true}
 *   headerTitle="Configure Feedback"
 * />
 * ```
 * 
 * @param props - Component props
 * @returns The rendered FeedbackForm component
 */
const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  onSave, 
  feedbackMode = 'ai',
  showHeader = true,
  headerTitle = 'Configuração do Feedback',
  headerSubtitle,
  showOnlineContent = true
}) => {
  // Custom hook for feedback form state and logic
  const feedbackForm = useFeedbackForm(feedbackMode);

  // Array states for resources and reading files
  const readingFilesState = useArrayState<string>([]);
  const resourcesState = useArrayState<OnlineResource>([]);

  // Save state hook
  const { isSaved, showSuccess: showSaveSuccess, showAnimation: saveButtonAnimation, triggerSave, cancelSave } = useSaveState();

  // Event handlers
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
        {showHeader && (
          <FormHeader title={headerTitle} subtitle={headerSubtitle} />
        )}

        <div className="space-y-8">
          <GeneralSection
            reportTitle={feedbackForm.reportTitle}
            onReportTitleChange={feedbackForm.setReportTitle}
            toggleStates={feedbackForm.toggleStates}
            onToggle={feedbackForm.handleToggle}
            resources={resourcesState.items}
            onAddResource={resourcesState.add}
            onDeleteResource={resourcesState.remove}
            showOnlineContent={showOnlineContent}
          />

          {feedbackMode === 'ai' && (
            <AISection
              solutionType={feedbackForm.solutionType}
              onSolutionTypeChange={feedbackForm.setSolutionType}
              feedbackTone={feedbackForm.feedbackTone}
              onFeedbackToneChange={feedbackForm.setFeedbackTone}
              feedbackPersona={feedbackForm.feedbackPersona}
              onFeedbackPersonaChange={feedbackForm.setFeedbackPersona}
              activityContext={feedbackForm.activityContext}
              onActivityContextChange={feedbackForm.setActivityContext}
              extraGuidelines={feedbackForm.extraGuidelines}
              onExtraGuidelinesChange={feedbackForm.setExtraGuidelines}
              readingFiles={readingFilesState.items}
              onAddReadingFile={readingFilesState.add}
              onRemoveReadingFile={readingFilesState.remove}
            />
          )}

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
