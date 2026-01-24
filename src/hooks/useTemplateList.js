import { useState, useEffect } from 'react';
import { TEMPLATES_API } from '../constants/api';

/**
 * Custom hook for fetching the list of available templates
 * @returns {Object} - { templates, loading }
 */
const useTemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

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
