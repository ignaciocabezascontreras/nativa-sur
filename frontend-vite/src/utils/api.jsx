import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = async ({ method, endpoint, data, headers = {}, withCredentials = false }) => {
  const response = await axios({
    method,
    url: `${API_URL}${endpoint}`,
    headers,
    data,
    withCredentials,
  });
  return response.data;
};

export default api;