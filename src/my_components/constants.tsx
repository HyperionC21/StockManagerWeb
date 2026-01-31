// In Docker production, nginx proxies /api to the backend.
// In development, set REACT_APP_API_URL=http://localhost:5001 in .env
export const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';