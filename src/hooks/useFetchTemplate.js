import { useState, useEffect } from 'react';
import { TEMPLATES_API } from '../constants/api';

/**
 * Custom hook for fetching template details from the API
 * @param {string} templateName - The name of the template to fetch
 * @returns {Object} - { data, loading, error }
 */
const useFetchTemplate = (templateName) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (!templateName) {
        setError('No template name provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(TEMPLATES_API.DETAILS(templateName));
        if (!response.ok) {
          throw new Error(`Failed to fetch template: ${response.statusText}`);
        }
        const templateData = await response.json();
        setData(templateData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateData();
  }, [templateName]);

  return { data, loading, error };
};

export default useFetchTemplate;
