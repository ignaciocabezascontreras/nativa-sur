import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = async ({ method, endpoint, data, headers = {}, withCredentials = false }) => {
  const token = localStorage.getItem('ns_token')
  const response = await axios({
    method,
    url: `${API_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    data,
    withCredentials,
  })
  return response.data
}

export default api
