import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/Project_WebProgrammingCO3050/backend/api/', 
});

export default api;