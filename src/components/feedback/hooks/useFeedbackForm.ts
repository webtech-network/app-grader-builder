/**
 * @fileoverview Custom hook for managing feedback form state and logic.
 * 
 * @description Provides centralized state management for the entire feedback
 * configuration form, including general settings, AI configuration, validation,
 * and save functionality. Separates business logic from presentation components.
 * 
 * @module components/feedback/hooks/useFeedbackForm
 */

import { useState, Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';

/**
 * Defines the feedback generation mode.
 * - 'ai': Uses AI to generate personalized feedback
 * - 'static': Uses predefined static feedback templates  
 * - 'default': Uses default system feedback
 */
type FeedbackMode = 'ai' | 'static' | 'default';

/**
 * Defines how solutions should be provided in AI feedback.
 * - 'hint': Provide hints without full solutions
 * - 'yes': Provide complete solutions
 * - 'no': Do not provide solutions
 */
type SolutionType = 'hint' | 'yes' | 'no';

/**
 * State object for general toggle settings.
 * @interface ToggleStates
 */
interface ToggleStates {
    /** Whether to show the numeric score in feedback */
    show_score: boolean;
    /** Whether to show passed tests in the report */
    show_passed_tests: boolean;
    /** Whether to add a summary section to the report */
    add_report_summary: boolean;
}

/**
 * Configuration for general feedback settings (sent to backend).
 * @interface GeneralConfig
 */
interface GeneralConfig {
    /** Title displayed at the top of the feedback report */
    report_title?: string;
    /** Whether to display passed tests */
    show_passed_tests?: boolean;
    /** Whether to show detailed test information */
    show_test_details?: boolean;
    /** Whether to include a summary section */
    add_report_summary?: boolean;
}

/**
 * Configuration for AI-powered feedback (sent to backend).
 * @interface AIConfig
 */
interface AIConfig {
    /** The tone/style of AI-generated feedback */
    feedback_tone?: string;
    /** The persona/character the AI should adopt */
    feedback_persona?: string;
    /** Context about the assignment for better feedback */
    assignment_context?: string;
    /** Additional instructions for the AI */
    extra_orientations?: string;
    /** How solutions should be provided */
    solution_type?: SolutionType;
    /** List of files to read for context */
    submission_files_to_read?: string[];
}

/**
 * Configuration for default category headers.
 * @interface DefaultConfig
 */
interface DefaultConfig {
    /** Custom headers for feedback categories */
    category_headers?: {
        /** Header for base/required criteria */
        base: string;
        /** Header for bonus/extra credit criteria */
        bonus: string;
        /** Header for penalty/deduction criteria */
        penalty: string;
    };
}

/**
 * Represents an online learning resource linked to feedback.
 * @interface OnlineResource
 * @exports
 */
export interface OnlineResource {
    /** Display title of the resource */
    title: string;
    /** URL to the online resource */
    url: string;
    /** Tags/tests this resource is associated with */
    tags: string[];
}

/**
 * Complete feedback configuration object (sent to backend).
 * @interface FeedbackConfig
 * @exports
 */
export interface FeedbackConfig {
    /** General feedback display settings */
    general?: GeneralConfig;
    /** AI feedback generation settings */
    ai?: AIConfig;
    /** Default category header settings */
    default?: DefaultConfig;
    /** List of online learning resources */
    online_resources?: OnlineResource[];
}

/**
 * Return type for the useFeedbackForm hook.
 * Contains all state values, setters, and methods for the feedback form.
 * @interface UseFeedbackFormReturn
 * @exports
 */
export interface UseFeedbackFormReturn {
    // -------------------------------------------------------------------------
    // General Section State
    // -------------------------------------------------------------------------
    /** Current report title value */
    reportTitle: string;
    /** Setter for report title */
    setReportTitle: Dispatch<SetStateAction<string>>;
    /** Current toggle states for display options */
    toggleStates: ToggleStates;
    /** Handler for toggling a specific toggle by id */
    handleToggle: (id: keyof ToggleStates) => void;
    
    // -------------------------------------------------------------------------
    // AI Section State
    // -------------------------------------------------------------------------
    /** Current feedback tone value */
    feedbackTone: string;
    /** Setter for feedback tone */
    setFeedbackTone: Dispatch<SetStateAction<string>>;
    /** Current feedback persona value */
    feedbackPersona: string;
    /** Setter for feedback persona */
    setFeedbackPersona: Dispatch<SetStateAction<string>>;
    /** Current activity context value */
    activityContext: string;
    /** Setter for activity context */
    setActivityContext: Dispatch<SetStateAction<string>>;
    /** Current extra guidelines value */
    extraGuidelines: string;
    /** Setter for extra guidelines */
    setExtraGuidelines: Dispatch<SetStateAction<string>>;
    /** Current solution type selection */
    solutionType: SolutionType;
    /** Setter for solution type */
    setSolutionType: Dispatch<SetStateAction<SolutionType>>;
    
    // -------------------------------------------------------------------------
    // Methods
    // -------------------------------------------------------------------------
    /** Assembles all form state into a FeedbackConfig object for the backend */
    assembleConfiguration: (readingFiles?: string[], resources?: OnlineResource[]) => FeedbackConfig;
    /** Validates all required fields and returns an array of error messages */
    validateConfiguration: (readingFiles?: string[]) => string[];
    /** Validates, assembles, and triggers save with callbacks */
    handleSave: (
        readingFiles: string[],
        resources: OnlineResource[],
        onSave?: (config: FeedbackConfig) => void,
        triggerSave?: () => void
    ) => boolean;
}

/**
 * useFeedbackForm - Custom hook for managing feedback form state and logic.
 * 
 * @description Provides comprehensive state management for the feedback configuration
 * form. Handles both general settings and AI-specific settings based on the feedback
 * mode. Includes validation logic and methods for assembling the configuration object
 * that gets sent to the backend.
 * 
 * Features:
 * - General section: report title, display toggles
 * - AI section: tone, persona, context, guidelines, solution type, files
 * - Validation with toast notifications for errors
 * - Configuration assembly for backend API
 * 
 * @example
 * ```tsx
 * const feedbackForm = useFeedbackForm('ai');
 * 
 * // Access state
 * console.log(feedbackForm.reportTitle);
 * 
 * // Update state
 * feedbackForm.setReportTitle('New Title');
 * feedbackForm.handleToggle('show_score');
 * 
 * // Save with validation
 * feedbackForm.handleSave(files, resources, onSaveCallback, triggerSave);
 * ```
 * 
 * @param feedbackMode - The feedback generation mode ('ai', 'static', or 'default')
 * @returns {UseFeedbackFormReturn} Object containing all state, setters, and methods
 */
const useFeedbackForm = (feedbackMode: FeedbackMode = 'ai'): UseFeedbackFormReturn => {
    // General section state
    const [reportTitle, setReportTitle] = useState<string>("");
    const [toggleStates, setToggleStates] = useState<ToggleStates>({
        show_score: true,
        show_passed_tests: true,
        add_report_summary: true
    });

    // AI section state
    const [feedbackTone, setFeedbackTone] = useState<string>("");
    const [feedbackPersona, setFeedbackPersona] = useState<string>("");
    const [activityContext, setActivityContext] = useState<string>("");
    const [extraGuidelines, setExtraGuidelines] = useState<string>("");
    const [solutionType, setSolutionType] = useState<SolutionType>("hint");

    // Toggle handler
    const handleToggle = (id: keyof ToggleStates): void => {
        setToggleStates(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Assemble configuration for backend
    const assembleConfiguration = (readingFiles: string[] = [], resources: OnlineResource[] = []): FeedbackConfig => {
        const config: FeedbackConfig = {};
        
        // General configuration
        const generalConfig: GeneralConfig = {};
        if (reportTitle && reportTitle.trim() !== '') {
            generalConfig.report_title = reportTitle;
        }
        if (toggleStates.show_passed_tests !== undefined) {
            generalConfig.show_passed_tests = toggleStates.show_passed_tests;
        }
        if (toggleStates.show_score !== undefined) {
            generalConfig.show_test_details = toggleStates.show_score;
        }
        if (toggleStates.add_report_summary !== undefined) {
            generalConfig.add_report_summary = toggleStates.add_report_summary;
        }
        
        if (Object.keys(generalConfig).length > 0) {
            config.general = generalConfig;
        }
        
        // AI configuration (only if feedback mode is 'ai')
        if (feedbackMode === 'ai') {
            const aiConfig: AIConfig = {};
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
        const defaultConfig: DefaultConfig = {};
        if (toggleStates.add_report_summary || Object.keys(defaultConfig).length > 0) {
            defaultConfig.category_headers = {
                base: "✅ Essential Requirements",
                bonus: "⭐ Extra Points and Best Practices",
                penalty: "🚨 Points of Attention and Bad Practices"
            };
            config.default = defaultConfig;
        }
        
        // Include online resources (optional)
        if (resources && resources.length > 0) {
            config.online_resources = resources;
        }
        
        return config;
    };

    // Validate configuration
    const validateConfiguration = (readingFiles: string[] = []): string[] => {
        const errors: string[] = [];
        
        // Validate General section
        if (!reportTitle || reportTitle.trim() === '') {
            errors.push('Título do Relatório é obrigatório');
        }
        
        // Validate AI section (only if feedback mode is 'ai')
        if (feedbackMode === 'ai') {
            if (!feedbackTone || feedbackTone.trim() === '') {
                errors.push('Tom do Feedback é obrigatório');
            }
            
            if (!feedbackPersona || feedbackPersona.trim() === '') {
                errors.push('Persona do Feedback é obrigatória');
            }
            
            if (!activityContext || activityContext.trim() === '') {
                errors.push('Contexto da Atividade é obrigatório');
            }
            
            if (!extraGuidelines || extraGuidelines.trim() === '') {
                errors.push('Orientações Extras são obrigatórias');
            }
            
            if (!solutionType || solutionType.trim() === '') {
                errors.push('Tipo de Fornecimento de Soluções é obrigatório');
            }
            
            if (!readingFiles || readingFiles.length === 0) {
                errors.push('Pelo menos um arquivo para leitura é obrigatório');
            }
        }
        
        return errors;
    };

    // Handle save with validation
    const handleSave = (
        readingFiles: string[],
        resources: OnlineResource[],
        onSave?: (config: FeedbackConfig) => void,
        triggerSave?: () => void
    ): boolean => {
        const validationErrors = validateConfiguration(readingFiles);
        
        if (validationErrors.length > 0) {
            validationErrors.forEach((err, idx) => {
                toast.error(`${idx + 1}. ${err}`);
            });
            return false;
        }
        
        const config = assembleConfiguration(readingFiles, resources);
        
        if (onSave) {
            onSave(config);
        }
        
        if (triggerSave) {
            triggerSave();
        }
        
        return true;
    };

    return {
        // General section
        reportTitle,
        setReportTitle,
        toggleStates,
        handleToggle,
        
        // AI section
        feedbackTone,
        setFeedbackTone,
        feedbackPersona,
        setFeedbackPersona,
        activityContext,
        setActivityContext,
        extraGuidelines,
        setExtraGuidelines,
        solutionType,
        setSolutionType,
        
        // Methods
        assembleConfiguration,
        validateConfiguration,
        handleSave
    };
};

export default useFeedbackForm;
