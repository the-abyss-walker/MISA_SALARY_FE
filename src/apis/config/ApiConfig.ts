import axios from 'axios'

const baseURL = import.meta.env.BASE_URL

let api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
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
