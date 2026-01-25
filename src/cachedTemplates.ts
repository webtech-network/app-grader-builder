// Cached template data - used instead of API calls for now
import webDevData from './cached-web-dev.json';
import apiTestingData from './cached-api-testing.json';
import inputOutputData from './cached-input-output.json';

interface TestParameter {
  name: string;
  type: string;
  description: string;
}

interface Test {
  name: string;
  description: string;
  required_file?: string;
  parameters?: TestParameter[];
}

interface TemplateData {
  template_name: string;
  template_description: string;
  tests: Test[];
  availableSoon?: boolean;
}

type TemplateName = 'webdev' | 'api' | 'io' | 'essay';

export const cachedTemplates: Record<TemplateName, TemplateData> = {
  webdev: webDevData as TemplateData,
  api: apiTestingData as TemplateData,
  io: inputOutputData as TemplateData,
  essay: {
    template_name: "Redações",
    template_description: "Um modelo para avaliar redações e trabalhos escritos. Em breve disponível.",
    tests: [],
    availableSoon: true
  }
};

// Template list for the landing page
export const templatesList: TemplateName[] = ['webdev', 'api', 'io', 'essay'];

// Function to get template details (simulates API call)
export const getTemplateDetails = async (templateName: string): Promise<TemplateData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (templateName in cachedTemplates) {
    return cachedTemplates[templateName as TemplateName];
  }
  
  throw new Error(`Template ${templateName} not found`);
};

export type { TemplateData, Test, TestParameter, TemplateName };
