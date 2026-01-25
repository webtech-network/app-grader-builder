import { useState, useEffect } from 'react';
import { TEMPLATES_API } from '../constants/api';

export interface TestLibrary {
  name: string;
  tests: TestTemplate[];
}

export interface TestTemplate {
  name: string;
  displayName: string;
  description: string;
  parameters: TestParameter[];
  required_file?: string;
}

export interface TestParameter {
  name: string;
  type: string;
  description?: string;
  defaultValue?: unknown;
  required?: boolean;
}

export interface UseFetchTemplateReturn {
  data: TestLibrary | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching template details from the API
 * @param templateName - The name of the template to fetch
 */
const useFetchTemplate = (templateName: string | null): UseFetchTemplateReturn => {
  const [data, setData] = useState<TestLibrary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateData();
  }, [templateName]);

  return { data, loading, error };
};

export default useFetchTemplate;
