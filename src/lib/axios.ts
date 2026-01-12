import axios from 'axios'

// Флаг для использования моков (для разработки без бэкенда)
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

export const productApi = axios.create({
  baseURL: '/api/products',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const brainApi = axios.create({
  baseURL: '/api/brain',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor для добавления токена
const addAuthToken = (config: any) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

productApi.interceptors.request.use(addAuthToken)
brainApi.interceptors.request.use(addAuthToken)

// Response interceptor для обработки ошибок
const handleError = (error: any) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  }
  return Promise.reject(error)
}

productApi.interceptors.response.use((res) => res, handleError)
brainApi.interceptors.response.use((res) => res, handleError)
