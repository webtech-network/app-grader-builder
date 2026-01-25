/**
 * API Configuration Constants
 * 
 * These values can be overridden by environment variables:
 * - REACT_APP_TEMPLATES_API_BASE_URL
 * - REACT_APP_CONFIG_API_BASE_URL
 */

export const TEMPLATES_API_BASE_URL: string = process.env.REACT_APP_TEMPLATES_API_BASE_URL || 'http://localhost:8000';
export const CONFIG_API_BASE_URL: string = process.env.REACT_APP_CONFIG_API_BASE_URL || 'http://localhost:8001';

// Template endpoints
export const TEMPLATES_API = {
  LIST: `${TEMPLATES_API_BASE_URL}/templates/`,
  DETAILS: (templateName: string): string => `${TEMPLATES_API_BASE_URL}/templates/${templateName}`,
} as const;

// Configuration endpoints
export const CONFIG_API = {
  GENERATE: `${CONFIG_API_BASE_URL}/api/generate-config`,
} as const;
