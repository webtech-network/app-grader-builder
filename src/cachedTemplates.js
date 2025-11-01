// Cached template data - used instead of API calls for now
import webDevData from '../cached-web-dev.json';
import apiTestingData from '../cached-api-testing.json';
import inputOutputData from '../cached-input-output.json';

export const cachedTemplates = {
  webdev: webDevData,
  api: apiTestingData,
  io: inputOutputData,
  essay: {
    template_name: "Redações",
    template_description: "Um modelo para avaliar redações e trabalhos escritos.",
    tests: []
  }
};

// Template list for the landing page
export const templatesList = ['webdev', 'api', 'io', 'essay'];

// Function to get template details (simulates API call)
export const getTemplateDetails = async (templateName) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (cachedTemplates[templateName]) {
    return cachedTemplates[templateName];
  }
  
  throw new Error(`Template ${templateName} not found`);
};
