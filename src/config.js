// Configuration utility for accessing environment variables
const config = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  configApiUrl: process.env.REACT_APP_CONFIG_API_URL || 'http://localhost:8001',
};

export default config;
