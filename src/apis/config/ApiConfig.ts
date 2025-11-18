import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7139/api/v1/'

let api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response && [401, 403].includes(error.response.status)) {
      // handle error
    }
    return Promise.reject(error)
  },
)

export default api
