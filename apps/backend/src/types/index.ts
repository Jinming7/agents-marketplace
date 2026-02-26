// App types
export interface App {
  id: string
  name: string
  description: string
  category: string
  installs: number
  rating: number
}

export interface AppDetail extends App {
  version: string
  developer: string
  lastUpdated: string
}

// User types
export interface User {
  email: string
}

export interface UserProfile {
  email: string
  name: string
  avatar?: string
  bio?: string
  notifications: boolean
}

export interface UserInstallation {
  appId: string
  installedAt: string
}

// Auth types
export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface AppsListResponse {
  apps: App[]
  total: number
}

export interface CategoriesResponse {
  categories: string[]
}

// Error types
export interface ErrorResponse {
  error: string
  message: string
  details?: Record<string, string[]>
}
