import axios from 'axios'
import { supabase } from './supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function injectAuth(config) {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
}

function extractError(error) {
  const message = error.response?.data?.message || error.message || 'An error occurred'
  return Promise.reject(new Error(message))
}

// REST API client for database operations
export const apiClient = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(injectAuth)
apiClient.interceptors.response.use(r => r, extractError)

// Storage client for image upload/delete
export const storageClient = axios.create({
  baseURL: `${SUPABASE_URL}/storage/v1`,
  headers: {
    apikey: SUPABASE_ANON_KEY,
  },
})

storageClient.interceptors.request.use(injectAuth)
storageClient.interceptors.response.use(r => r, extractError)
