import { useState, useEffect } from 'react';
import { TEMPLATES_API } from '../constants/api';

export interface UseTemplateListReturn {
  templates: string[];
  loading: boolean;
}

/**
 * Custom hook for fetching the list of available templates
 */
const useTemplateList = (): UseTemplateListReturn => {
  const [templates, setTemplates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch(TEMPLATES_API.LIST);
        const data = await response.json();
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setTemplates(data);
        } else if (data.templates && Array.isArray(data.templates)) {
          setTemplates(data.templates);
        } else {
          // Fallback if data structure is unexpected
          setTemplates(['webdev', 'api', 'essay', 'io']);
        }
      } catch (error) {
        // Fallback to default templates if API fails
        setTemplates(['webdev', 'api', 'essay', 'io']);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  return { templates, loading };
};

export default useTemplateList;
