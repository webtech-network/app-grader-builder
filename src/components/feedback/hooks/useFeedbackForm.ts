import { useState, Dispatch, SetStateAction } from 'react';
import { toast } from 'react-toastify';

type FeedbackMode = 'ai' | 'static';
type SolutionType = 'hint' | 'yes' | 'no';

interface ToggleStates {
    show_score: boolean;
    show_passed_tests: boolean;
    add_report_summary: boolean;
}

interface GeneralConfig {
    report_title?: string;
    show_passed_tests?: boolean;
    show_test_details?: boolean;
    add_report_summary?: boolean;
}

interface AIConfig {
    feedback_tone?: string;
    feedback_persona?: string;
    assignment_context?: string;
    extra_orientations?: string;
    solution_type?: SolutionType;
    submission_files_to_read?: string[];
}

interface DefaultConfig {
    category_headers?: {
        base: string;
        bonus: string;
        penalty: string;
    };
}

export interface OnlineResource {
    title: string;
    url: string;
    tags: string[];
}

export interface FeedbackConfig {
    general?: GeneralConfig;
    ai?: AIConfig;
    default?: DefaultConfig;
    online_resources?: OnlineResource[];
}

export interface UseFeedbackFormReturn {
    // General section
    reportTitle: string;
    setReportTitle: Dispatch<SetStateAction<string>>;
    toggleStates: ToggleStates;
    handleToggle: (id: keyof ToggleStates) => void;
    
    // AI section
    feedbackTone: string;
    setFeedbackTone: Dispatch<SetStateAction<string>>;
    feedbackPersona: string;
    setFeedbackPersona: Dispatch<SetStateAction<string>>;
    activityContext: string;
    setActivityContext: Dispatch<SetStateAction<string>>;
    extraGuidelines: string;
    setExtraGuidelines: Dispatch<SetStateAction<string>>;
    solutionType: SolutionType;
    setSolutionType: Dispatch<SetStateAction<SolutionType>>;
    
    // Methods
    assembleConfiguration: (readingFiles?: string[], resources?: OnlineResource[]) => FeedbackConfig;
    validateConfiguration: (readingFiles?: string[]) => string[];
    handleSave: (
        readingFiles: string[],
        resources: OnlineResource[],
        onSave?: (config: FeedbackConfig) => void,
        triggerSave?: () => void
    ) => boolean;
}

/**
 * Custom hook for managing feedback form state and logic
 * @param feedbackMode - 'ai' or 'static'
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
