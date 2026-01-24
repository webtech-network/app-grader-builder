import { useState } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing feedback form state and logic
 * @param {string} feedbackMode - 'ai' or 'static'
 * @returns {object} Form state and handlers
 */
const useFeedbackForm = (feedbackMode = 'ai') => {
    // General section state
    const [reportTitle, setReportTitle] = useState("");
    const [toggleStates, setToggleStates] = useState({
        show_score: true,
        show_passed_tests: true,
        add_report_summary: true
    });

    // AI section state
    const [feedbackTone, setFeedbackTone] = useState("");
    const [feedbackPersona, setFeedbackPersona] = useState("");
    const [activityContext, setActivityContext] = useState("");
    const [extraGuidelines, setExtraGuidelines] = useState("");
    const [solutionType, setSolutionType] = useState("hint");

    // Toggle handler
    const handleToggle = (id) => {
        setToggleStates(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Assemble configuration for backend
    const assembleConfiguration = (readingFiles = [], resources = []) => {
        const config = {};
        
        // General configuration
        const generalConfig = {};
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
        
        // Include online resources (optional)
        if (resources && resources.length > 0) {
            config.online_resources = resources;
        }
        
        return config;
    };

    // Validate configuration
    const validateConfiguration = (readingFiles = []) => {
        const errors = [];
        
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
    const handleSave = (readingFiles, resources, onSave, triggerSave) => {
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
