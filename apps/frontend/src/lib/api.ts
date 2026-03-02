// Use Next.js API routes (same origin, no CORS issues)
const API_BASE = '/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    })
    const data = await res.json()
    return { success: res.ok, data, error: !res.ok ? data.error : undefined }
  } catch (error) {
    return { success: false, error: 'Network error' }
  }
}

// Apps API
export const appsApi = {
  list: (params?: { category?: string; search?: string; sort?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    return request<any[]>(`/plugins${query ? `?${query}` : ''}`)
  },
  get: (id: string) => request<any>(`/plugins/${id}`),
  getReviews: (id: string) => request<any[]>(`/plugins/${id}/reviews`),
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request<any>('/auth/me'),
}

// User API
export const userApi = {
  getProfile: () => request<any>('/user/profile'),
  updateProfile: (data: any) =>
    request<any>('/user/profile', { method: 'PUT', body: JSON.stringify(data) }),
  getInstallations: () => request<any[]>('/user/installations'),
  installApp: (appId: string) =>
    request('/user/installations', { method: 'POST', body: JSON.stringify({ appId }) }),
  uninstallApp: (appId: string) =>
    request(`/user/installations/${appId}`, { method: 'DELETE' }),
  getWishlist: () => request<any[]>('/user/wishlist'),
  addToWishlist: (appId: string) =>
    request('/user/wishlist', { method: 'POST', body: JSON.stringify({ appId }) }),
  removeFromWishlist: (appId: string) =>
    request(`/user/wishlist/${appId}`, { method: 'DELETE' }),
}

// Categories API
export const categoriesApi = {
  list: () => request<any[]>('/categories'),
}