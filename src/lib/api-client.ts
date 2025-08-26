const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    })
  }

  async getProfile() {
    return this.request('/auth/me')
  }

  // Pond endpoints
  async getPonds() {
    return this.request('/ponds')
  }

  async getPond(id: string) {
    return this.request(`/ponds/${id}`)
  }

  async createPond(pondData: { name: string; location?: string; notes?: string }) {
    return this.request('/ponds', {
      method: 'POST',
      body: JSON.stringify(pondData),
    })
  }

  // Readings endpoints
  async getReadings(pondId: string, params: { from?: string; to?: string; limit?: number }) {
    const queryString = new URLSearchParams(params as Record<string, string>).toString()
    return this.request(`/ponds/${pondId}/readings?${queryString}`)
  }

  // History endpoints
  async getHistory(pondId: string, params: { cursor?: string; limit?: number }) {
    const queryString = new URLSearchParams(params as Record<string, string>).toString()
    return this.request(`/ponds/${pondId}/history?${queryString}`)
  }

  // Media endpoints
  async getMedia(pondId: string, params: { type?: string; limit?: number }) {
    const queryString = new URLSearchParams(params as Record<string, string>).toString()
    return this.request(`/ponds/${pondId}/media?${queryString}`)
  }

  // Control endpoints
  async sendControl(pondId: string, controlData: { control_type: string; value: any }) {
    return this.request(`/ponds/${pondId}/control`, {
      method: 'POST',
      body: JSON.stringify(controlData),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
