// Auto-detect API URL based on environment
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: always use 127.0.0.1 for local development
    return 'http://127.0.0.1:8000'
  }
  // Server-side: use 127.0.0.1
  return 'http://127.0.0.1:8000'
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || getApiBaseUrl()

interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface LoginCredentials {
  phone_number: string
  password: string
}

export interface User {
  id: string
  email: string
  role: 'owner' | 'operator' | 'viewer'
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface Pond {
  id: string
  name: string
  location?: string
  notes?: string
  date?: string
  size?: number
  dimensions?: string
  depth?: number
  shrimp_count?: number
  owner_user_id: string
  external_id?: string
  created_at: string
  updated_at: string
}

export interface SensorReading {
  id: string
  pond_id: string
  timestamp: string
  metrics: {
    temperature?: number
    ph?: number
    salinity?: number
    dissolved_oxygen?: number
    ammonia?: number
    turbidity?: number
    [key: string]: any
  }
  source: string
  received_at: string
}

export interface MediaAsset {
  id: string
  pond_id: string
  type: 'image' | 'video'
  url: string
  thumbnail_url?: string
  mime_type: string
  captured_at: string
  meta: Record<string, any>
}

export interface Insight {
  id: string
  pond_id: string
  title: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  tags: string[]
  created_at: string
  source: string
}

export interface ControlLog {
  id: string
  pond_id: string
  control_type: string
  value: any
  actor: string
  created_at: string
}

export interface Event {
  id: string
  pond_id: string
  type: 'sensor_reading' | 'control_action' | 'alert' | 'media_capture' | 'maintenance'
  title?: string
  message?: string
  timestamp?: string
  created_at: string
  source?: string
  metrics?: Record<string, any>
}

export interface PondStatus {
  pond_id: string
  status: 'good' | 'warning' | 'critical'
  last_reading: SensorReading
  alerts: Insight[]
}

export interface TimeRange {
  from: string
  to: string
}

export interface PaginationParams {
  cursor?: string
  limit?: number
}

export interface CreatePondRequest {
  name: string
  location?: string
  notes?: string
  date?: string
  size?: number
  dimensions?: string
  depth?: number
  shrimp_count?: number
  external_id?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    console.log('🔍 apiClient initialized with base URL:', this.baseUrl)
    console.log('🔍 apiClient - getApiBaseUrl result:', getApiBaseUrl())
    console.log('🔍 apiClient - process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
    console.log('🔍 apiClient - window.location:', typeof window !== 'undefined' ? window.location.href : 'server-side')
    console.log('🔍 apiClient - window.location.hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side')
    console.log('🔍 apiClient - window.location.port:', typeof window !== 'undefined' ? window.location.port : 'server-side')
    console.log('🔍 apiClient - window.location.protocol:', typeof window !== 'undefined' ? window.location.protocol : 'server-side')
    console.log('🔍 apiClient - window.location.origin:', typeof window !== 'undefined' ? window.location.origin : 'server-side')
    console.log('🔍 apiClient - window.location.search:', typeof window !== 'undefined' ? window.location.search : 'server-side')
    console.log('🔍 apiClient - window.location.hash:', typeof window !== 'undefined' ? window.location.hash : 'server-side')
  }

  private async request<T>(path: string, config?: RequestInit): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`
    const defaultConfig: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const finalConfig = { ...defaultConfig, ...config }

    try {
      console.log(`🌐 API Request: ${config?.method || 'GET'} ${url}`)
      console.log(`🌐 API Request Headers:`, finalConfig.headers)
      console.log(`🌐 API Request Body:`, finalConfig.body)
      console.log(`🌐 API Base URL:`, this.baseUrl)
      console.log(`🌐 Full URL:`, url)

      const response = await fetch(url, finalConfig)
      console.log(`📡 API Response: ${response.status} ${response.statusText}`)
      console.log(`📡 API Response Headers:`, Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.log('🔍 Error response data:', errorData)
        console.log('🔍 Error response status:', response.status)
        console.log('🔍 Error response statusText:', response.statusText)

        let errorMessage = `HTTP error! status: ${response.status}`
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) =>
              `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg || err.message || err}`
            ).join(', ')
          } else {
            errorMessage = errorData.detail
          }
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        }

        console.error(`❌ API Error: ${errorMessage}`)
        return {
          data: null as T,
          error: errorMessage,
        }
      }

      const data = await response.json()
      console.log(`✅ API Success:`, data)
      console.log(`✅ API Success - data type:`, typeof data)
      console.log(`✅ API Success - data keys:`, Object.keys(data))
      return { data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`💥 API Request Failed:`, errorMessage)
      console.error(`💥 API Request Failed - error type:`, typeof error)
      console.error(`💥 API Request Failed - error stack:`, error instanceof Error ? error.stack : 'No stack')

      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        console.log('🔍 Network error detected')
        return {
          data: null as T,
          error: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
        }
      }

      if (errorMessage.includes('Unexpected token') || errorMessage.includes('JSON')) {
        console.log('🔍 JSON parsing error detected')
        return {
          data: null as T,
          error: 'เกิดข้อผิดพลาดในการประมวลผลข้อมูลจากเซิร์ฟเวอร์',
        }
      }

      console.log('🔍 Returning generic error')
      return {
        data: null as T,
        error: errorMessage,
      }
    }
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    console.log('🔍 Login request:', credentials)
    console.log('🔍 Login - API Base URL:', this.baseUrl)
    console.log('🔍 Login - Full URL:', `${this.baseUrl}/api/v1/auth/login`)
    
    const formData = new URLSearchParams()
    formData.append('username', credentials.phone_number)
    formData.append('password', credentials.password)
    console.log('🔍 Login - Form data:', formData.toString())

    return this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })
  }

  async getCurrentUser(token: string): Promise<ApiResponse<User>> {
    console.log('🔍 Get current user with token:', !!token)
    return this.request<User>('/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    console.log('🔍 Refresh token request')
    return this.request<AuthResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
  }

  // Pond endpoints
  async createPond(data: CreatePondRequest, token: string): Promise<ApiResponse<Pond>> {
    console.log('🔍 Create pond request:', data)
    console.log('🔍 Create pond token:', !!token)
    return this.request<Pond>('/api/v1/ponds/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  async getPonds(token: string): Promise<ApiResponse<Pond[]>> {
    console.log('🔍 Get ponds request with token:', !!token)
    return this.request<Pond[]>('/api/v1/ponds/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async getPond(id: string, token: string): Promise<ApiResponse<Pond>> {
    console.log('🔍 Get pond request:', id)
    return this.request<Pond>(`/api/v1/ponds/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async updatePond(id: string, data: Partial<CreatePondRequest>, token: string): Promise<ApiResponse<Pond>> {
    console.log('🔍 Update pond request:', id, data)
    return this.request<Pond>(`/api/v1/ponds/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  async deletePond(id: string, token: string): Promise<ApiResponse<void>> {
    console.log('🔍 Delete pond request:', id)
    return this.request<void>(`/api/v1/ponds/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  // Sensor readings endpoints
  async getSensorReadings(pondId: string, token: string, params?: PaginationParams): Promise<ApiResponse<SensorReading[]>> {
    console.log('🔍 Get sensor readings request:', pondId)
    const queryParams = new URLSearchParams()
    if (params?.cursor) queryParams.append('cursor', params.cursor)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    const queryString = queryParams.toString()
    const url = `/api/v1/ponds/${pondId}/readings${queryString ? `?${queryString}` : ''}`
    
    return this.request<SensorReading[]>(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  // Media endpoints
  async getMedia(pondId: string, token: string, params?: PaginationParams): Promise<ApiResponse<MediaAsset[]>> {
    console.log('🔍 Get media request:', pondId)
    const queryParams = new URLSearchParams()
    if (params?.cursor) queryParams.append('cursor', params.cursor)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    const queryString = queryParams.toString()
    const url = `/api/v1/ponds/${pondId}/media${queryString ? `?${queryString}` : ''}`
    
    return this.request<MediaAsset[]>(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  // Control endpoints
  async sendControl(pondId: string, controlType: string, value: any, token: string): Promise<ApiResponse<ControlLog>> {
    console.log('🔍 Send control request:', pondId, controlType, value)
    return this.request<ControlLog>(`/api/v1/ponds/${pondId}/control`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ control_type: controlType, value }),
    })
  }

  // History endpoints
  async getHistory(pondId: string, token: string, timeRange?: TimeRange): Promise<ApiResponse<Event[]>> {
    console.log('🔍 Get history request:', pondId, timeRange)
    const queryParams = new URLSearchParams()
    if (timeRange?.from) queryParams.append('from', timeRange.from)
    if (timeRange?.to) queryParams.append('to', timeRange.to)
    
    const queryString = queryParams.toString()
    const url = `/api/v1/ponds/${pondId}/history${queryString ? `?${queryString}` : ''}`
    
    return this.request<Event[]>(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    console.log('🔍 Health check request')
    return this.request<{ status: string }>('/api/v1/health', {
      method: 'GET',
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
