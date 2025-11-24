import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7139/api/v1/'

let api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  paramsSerializer: {
    serialize: (params) => {
      const searchParams = new URLSearchParams()
      for (const key in params) {
        const value = params[key]
        if (Array.isArray(value)) {
          value.forEach((val) => searchParams.append(key, val))
        } else if (value !== null && value !== undefined) {
          searchParams.append(key, value)
        }
      }
      return searchParams.toString()
    },
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
