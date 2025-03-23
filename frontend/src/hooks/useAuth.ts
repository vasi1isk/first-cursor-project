import { useState, useEffect } from 'react'
import axios from 'axios'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setState({ user: null, isLoading: false, error: null })
        return
      }

      const response = await axios.get('/api/auth/me')
      setState({ user: response.data, isLoading: false, error: null })
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      setState({ user: null, isLoading: false, error: 'Authentication failed' })
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setState({ user, isLoading: false, error: null })
      return user
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Login failed' }))
      throw error
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    role: string
  }) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setState({ user, isLoading: false, error: null })
      return user
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Registration failed' }))
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setState({ user: null, isLoading: false, error: null })
  }

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
  }
} 