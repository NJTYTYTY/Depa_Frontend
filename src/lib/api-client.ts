// Use production URLs
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use localhost for local development
    return 'http://localhost:8000'
  }
  // Server-side: use localhost
  return 'http://localhost:8000'
}

// Get API URL with proper fallback
const getApiUrl = () => {
  // If NEXT_PUBLIC_API_URL is set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  
  // For production (Vercel), use the production backend URL
  if (process.env.NODE_ENV === 'production') {
    // ใช้ Railway backend URL โดยตรง
    return 'https://web-production-7909d.up.railway.app'
  }
  
  // For development, use localhost
  return getApiBaseUrl()
}

const API_BASE_URL = getApiUrl()
const BACKEND_MIDDLE_URL = process.env.NEXT_PUBLIC_BACKEND_MIDDLE_URL || null
const RSPI_SERVER_YOKYOR = process.env.NEXT_PUBLIC_RSPI_SERVER_YOKYOR || null

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

// Push Notification interfaces
export interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
  user_agent?: string
}

export interface PushMessageData {
  user_id: number
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  url?: string
  tag?: string
  data?: Record<string, any>
  require_interaction?: boolean
  silent?: boolean
  vibrate?: number[]
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

export interface ShrimpAlertRequest {
  user_id: number
  body?: string
  image?: string
  url?: string
  data?: {
    pond_id?: string
    timestamp?: string
    [key: string]: any
  }
}

export interface PushNotificationSettings {
  user_id: number
  sensor_alerts: boolean
  pond_updates: boolean
  system_notifications: boolean
  maintenance_alerts: boolean
  created_at?: string
  updated_at?: string
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
  }

  private getMockResponse<T>(path: string, config?: RequestInit): T | null {
    const method = config?.method || 'GET';
    const cleanPath = path.split('?')[0];

    // Helpers to extract pond ID
    const getPondId = () => {
      const match = path.match(/\/(?:ponds|sensors|alerts)\/([^\/]+)/);
      return match ? match[1] : '1';
    };

    const pondId = getPondId();

    // 1. Auth check
    if (cleanPath.includes('/api/v1/auth/me')) {
      return {
        id: '1',
        email: 'mock@example.com',
        role: 'owner',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any;
    }

    if (cleanPath.includes('/api/v1/auth/login')) {
      return {
        access_token: 'mock_token',
        refresh_token: 'mock_refresh',
        token_type: 'bearer',
        expires_in: 3600
      } as any;
    }

    if (cleanPath.includes('/api/v1/auth/refresh')) {
      return {
        access_token: 'mock_token',
        refresh_token: 'mock_refresh',
        token_type: 'bearer',
        expires_in: 3600
      } as any;
    }

    // 2. Alert endpoints
    if (cleanPath.includes('/badge-count')) {
      return { count: 1 } as any;
    }
    if (cleanPath.includes('/unread')) {
      return [
        {
          id: 'a1',
          pond_id: pondId,
          title: 'ค่า DO ต่ำกว่าเกณฑ์',
          severity: 'warning',
          message: 'พบระดับออกซิเจนในน้ำ (DO) ลดลงต่ำกว่า 4.0 mg/L ควรเปิดเครื่องกังหันน้ำเพิ่มเติม',
          tags: ['DO', 'water'],
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          source: 'system'
        }
      ] as any;
    }
    if (cleanPath.includes('/stats')) {
      return { total: 1, unread: 1, info: 0, warning: 1, critical: 0 } as any;
    }
    if (cleanPath.includes('/alerts/pond/')) {
      return [
        {
          id: 'a1',
          pond_id: pondId,
          title: 'ค่า DO ต่ำกว่าเกณฑ์',
          severity: 'warning',
          message: 'พบระดับออกซิเจนในน้ำ (DO) ลดลงต่ำกว่า 4.0 mg/L ควรเปิดเครื่องกังหันน้ำเพิ่มเติม',
          tags: ['DO', 'water'],
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          source: 'system'
        }
      ] as any;
    }
    if (cleanPath.includes('/alerts/user/')) {
      return [
        {
          id: 'a1',
          pond_id: '1',
          title: 'ค่า DO ต่ำกว่าเกณฑ์',
          severity: 'warning',
          message: 'พบระดับออกซิเจนในน้ำ (DO) ลดลงต่ำกว่า 4.0 mg/L ควรเปิดเครื่องกังหันน้ำเพิ่มเติม',
          tags: ['DO', 'water'],
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          source: 'system'
        }
      ] as any;
    }

    // 3. Sensor latest data
    if (cleanPath.startsWith('/api/v1/sensors/latest/')) {
      return {
        success: true,
        pondId: parseInt(pondId),
        source: 'individual',
        timestamp: new Date().toISOString(),
        sensors: {
          DO: { value: 6.2, type: 'numeric', status: 'green', timestamp: new Date().toISOString() },
          pH: { value: 7.8, type: 'numeric', status: 'green', timestamp: new Date().toISOString() },
          temperature: { value: 28.5, type: 'numeric', status: 'green', timestamp: new Date().toISOString() },
          waterColor: { value: 'สีเขียวขุ่น', type: 'string', status: 'green', timestamp: new Date().toISOString() },
          minerals_1: { value: 12.5, type: 'numeric', status: 'green', timestamp: new Date().toISOString() },
          minerals_2: { value: 8.3, type: 'numeric', status: 'green', timestamp: new Date().toISOString() },
          minerals_3: { value: 45.0, type: 'numeric', status: 'green', timestamp: new Date().toISOString() },
          minerals_4: { value: 20.0, type: 'numeric', status: 'green', timestamp: new Date().toISOString() },
          waterColorPicture: { value: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500', type: 'url', status: 'info', timestamp: new Date().toISOString() },
          PicColorwater: { value: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500', type: 'url', status: 'info', timestamp: new Date().toISOString() },
          PicKungOnWater: { value: 'https://images.unsplash.com/photo-1518467166-367ec940371a?w=500', type: 'url', status: 'info', timestamp: new Date().toISOString() },
          kungOnWaterPicture: { value: 'https://images.unsplash.com/photo-1518467166-367ec940371a?w=500', type: 'url', status: 'info', timestamp: new Date().toISOString() }
        }
      } as any;
    }

    // 4. Batch data
    if (cleanPath.startsWith('/api/v1/sensors/yorrkung-batches/') || cleanPath.startsWith('/api/v1/sensors/batches/')) {
      return {
        success: true,
        message: 'ดึงข้อมูลสำเร็จ',
        timestamp: new Date().toISOString(),
        data: {
          pondId: parseInt(pondId),
          count: 2,
          batches: [
            {
              id: 'b1',
              pond_id: parseInt(pondId),
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              source: 'raspi',
              sensors: {
                size_cm: { value: 7.2, type: 'numeric', status: 'green' },
                size_gram: { value: 11.5, type: 'numeric', status: 'green' },
                sizePicture: { value: 'https://images.unsplash.com/photo-1559737633-8b5d55977a91?w=500', type: 'url', status: 'info' },
                foodPicture: { value: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500', type: 'url', status: 'info' },
                kungDinPicture: { value: 'https://images.unsplash.com/photo-1518467166-367ec940371a?w=500', type: 'url', status: 'info' }
              }
            },
            {
              id: 'b2',
              pond_id: parseInt(pondId),
              timestamp: new Date().toISOString(),
              created_at: new Date().toISOString(),
              source: 'raspi',
              sensors: {
                size_cm: { value: 7.5, type: 'numeric', status: 'green' },
                size_gram: { value: 12.0, type: 'numeric', status: 'green' },
                sizePicture: { value: 'https://images.unsplash.com/photo-1559737633-8b5d55977a91?w=500', type: 'url', status: 'info' },
                foodPicture: { value: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500', type: 'url', status: 'info' },
                kungDinPicture: { value: 'https://images.unsplash.com/photo-1518467166-367ec940371a?w=500', type: 'url', status: 'info' }
              }
            }
          ]
        }
      } as any;
    }

    // 5. Sensor graphs
    if (cleanPath.startsWith('/api/v1/sensors/graph-simple/')) {
      const urlParams = new URLSearchParams(path.split('?')[1] || '');
      const sensorType = urlParams.get('sensor_types') || 'DO';
      const actualHours = parseInt(urlParams.get('hours') || '24');
      return {
        success: true,
        pond_id: parseInt(pondId),
        time_range: {
          start_time: new Date(Date.now() - actualHours * 60 * 60 * 1000).toISOString(),
          end_time: new Date().toISOString()
        },
        total_points: 10,
        sensors: {
          [sensorType]: {
            sensor_type: sensorType,
            unit: sensorType === 'DO' ? 'mg/L' : sensorType === 'pH' ? '' : sensorType === 'temperature' ? '°C' : '',
            data_points: Array.from({ length: 12 }).map((_, i) => ({
              timestamp: new Date(Date.now() - (12 - i) * (actualHours / 12) * 60 * 60 * 1000).toISOString(),
              value: sensorType === 'DO' ? 5.5 + Math.random() : sensorType === 'pH' ? 7.2 + Math.random() * 0.8 : sensorType === 'temperature' ? 27.5 + Math.random() * 2 : 10 + Math.random() * 5,
              status: 'green'
            }))
          }
        }
      } as any;
    }

    if (cleanPath.startsWith('/api/v1/sensors/graph-shrimpsize/')) {
      return {
        success: true,
        data: {
          pondId: parseInt(pondId),
          sensor_type: 'shrimpSize',
          data_points: Array.from({ length: 10 }).map((_, i) => ({
            timestamp: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000).toISOString(),
            value: 5.0 + i * 0.25 + Math.random() * 0.2
          }))
        }
      } as any;
    }

    // 6. Media endpoints
    if (cleanPath.endsWith('/media')) {
      return [
        {
          id: 'm1',
          pond_id: pondId,
          type: 'image',
          url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
          mime_type: 'image/jpeg',
          captured_at: new Date().toISOString(),
          meta: {}
        }
      ] as any;
    }

    // 7. History endpoints
    if (cleanPath.endsWith('/history')) {
      return [
        {
          id: 'h1',
          pond_id: pondId,
          type: 'sensor_reading',
          title: 'บันทึกค่าเซ็นเซอร์',
          message: 'ระดับออกซิเจน DO อยู่ที่ 6.2 mg/L',
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
          source: 'system'
        }
      ] as any;
    }

    // 8. Routine settings and timer endpoints
    if (cleanPath.includes('/routines') || cleanPath.includes('/schedules') || cleanPath.includes('/routine')) {
      return {
        enabled: true,
        routines: {
          enabled: true,
          schedules: [
            { id: 's1', time: '08:00', days: ['จันทร์', 'พุธ', 'ศุกร์'] },
            { id: 's2', time: '16:00', days: ['จันทร์', 'พุธ', 'ศุกร์'] }
          ]
        },
        schedules: [
          { id: 's1', time: '08:00', days: ['จันทร์', 'พุธ', 'ศุกร์'] },
          { id: 's2', time: '16:00', days: ['จันทร์', 'พุธ', 'ศุกร์'] }
        ]
      } as any;
    }

    // 9. Ponds endpoint
    if (cleanPath === '/api/v1/ponds/') {
      if (method === 'POST') {
        // Return created pond
        return {
          id: String(Math.floor(Math.random() * 1000)),
          name: 'บ่อใหม่จำลอง',
          location: 'โซนทดสอบ',
          notes: 'บ่อจำลองฝั่ง Frontend',
          date: new Date().toISOString().split('T')[0],
          size: 5,
          dimensions: '50x50',
          depth: 2.0,
          shrimp_count: 20000,
          owner_user_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as any;
      }

      // Return list
      return [
        {
          id: '1',
          name: 'บ่อกุ้ง 1 Yokyor',
          location: 'โซน A',
          notes: 'เลี้ยงกุ้งขาวแวนนาไม บ่อทดสอบระบบยกยออัตโนมัติ',
          date: '2026-05-01',
          size: 10,
          dimensions: '100x100',
          depth: 3.0,
          shrimp_count: 50000,
          owner_user_id: '1',
          created_at: '2026-05-01T00:00:00Z',
          updated_at: '2026-05-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'บ่อกุ้ง 2 Anemone',
          location: 'โซน B',
          notes: 'บ่อกุ้งดำคุณภาพสูง',
          date: '2026-05-15',
          size: 8,
          dimensions: '80x80',
          depth: 2.5,
          shrimp_count: 40000,
          owner_user_id: '1',
          created_at: '2026-05-15T00:00:00Z',
          updated_at: '2026-05-15T00:00:00Z'
        }
      ] as any;
    }

    if (cleanPath.startsWith('/api/v1/ponds/')) {
      const id = pondId;
      if (method === 'DELETE') {
        return { success: true } as any;
      }
      if (method === 'PUT') {
        return {
          id,
          name: 'แก้ไขบ่อกุ้งจำลอง',
          location: 'โซน A',
          notes: 'แก้ไขสำเร็จ',
          date: '2026-05-01',
          size: 10,
          dimensions: '100x100',
          depth: 3.0,
          shrimp_count: 50000,
          owner_user_id: '1',
          created_at: '2026-05-01T00:00:00Z',
          updated_at: '2026-05-01T00:00:00Z'
        } as any;
      }

      // getPond
      return {
        id,
        name: id === '2' ? 'บ่อกุ้ง 2 Anemone' : 'บ่อกุ้ง 1 Yokyor',
        location: id === '2' ? 'โซน B' : 'โซน A',
        notes: id === '2' ? 'บ่อกุ้งดำคุณภาพสูง' : 'เลี้ยงกุ้งขาวแวนนาไม บ่อทดสอบระบบยกยออัตโนมัติ',
        date: id === '2' ? '2026-05-15' : '2026-05-01',
        size: id === '2' ? 8 : 10,
        dimensions: id === '2' ? '80x80' : '100x100',
        depth: id === '2' ? 2.5 : 3.0,
        shrimp_count: id === '2' ? 40000 : 50000,
        owner_user_id: '1',
        created_at: '2026-05-01T00:00:00Z',
        updated_at: '2026-05-01T00:00:00Z'
      } as any;
    }

    // 10. Push settings
    if (cleanPath.includes('/push/settings')) {
      return {
        user_id: 1,
        sensor_alerts: true,
        pond_updates: true,
        system_notifications: true,
        maintenance_alerts: true
      } as any;
    }

    if (cleanPath.includes('/push/vapid-keys')) {
      return {
        public_key: 'mock_key',
        private_key: 'mock_key',
        email: 'mock@example.com'
      } as any;
    }

    // 11. Health
    if (cleanPath.includes('/health')) {
      return { status: 'ok' } as any;
    }

    // Fallback for post actions
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      return { success: true } as any;
    }

    return null;
  }

  private async request<T>(path: string, config?: RequestInit): Promise<ApiResponse<T>> {
    // Intercept with mock data
    const mockData = this.getMockResponse<T>(path, config);
    if (mockData !== null) {
      console.log(`[Mock API] Path: ${path}, Returning mock data`);
      return { data: mockData };
    }

    const url = `${this.baseUrl}${path}`
    const defaultConfig: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const finalConfig = { ...defaultConfig, ...config }

    try {
      const response = await fetch(url, finalConfig)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
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

        return {
          data: null as T,
          error: errorMessage,
        }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        return {
          data: null as T,
          error: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
        }
      }

      if (errorMessage.includes('Unexpected token') || errorMessage.includes('JSON')) {
        return {
          data: null as T,
          error: 'เกิดข้อผิดพลาดในการประมวลผลข้อมูลจากเซิร์ฟเวอร์',
        }
      }

      return {
        data: null as T,
        error: errorMessage,
      }
    }
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const formData = new URLSearchParams()
    formData.append('username', credentials.phone_number)
    formData.append('password', credentials.password)

    return this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })
  }

  async getCurrentUser(token: string): Promise<ApiResponse<User>> {
    return this.request<User>('/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
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
    
    // Send to main backend
    const mainResponse = await this.request<Pond>('/api/v1/ponds/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    // Also send to RSPI server if configured
    if (RSPI_SERVER_YOKYOR) {
      try {
        const rspiResponse = await fetch(`${RSPI_SERVER_YOKYOR}/example_info_pond`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      } catch (error) {
        // Don't fail the main request if RSPI fails
      }
    }
    
    // Also send to backend middle if configured
    if (BACKEND_MIDDLE_URL) {
      try {
        const middleResponse = await fetch(`${BACKEND_MIDDLE_URL}/example_info_pond`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      } catch (error) {
        // Don't fail the main request if middle fails
      }
    }
    
    return mainResponse
  }

  async getPonds(token: string): Promise<ApiResponse<Pond[]>> {
    return this.request<Pond[]>('/api/v1/ponds/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async getPond(id: string, token: string): Promise<ApiResponse<Pond>> {
    return this.request<Pond>(`/api/v1/ponds/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async updatePond(id: string, data: Partial<CreatePondRequest>, token: string): Promise<ApiResponse<Pond>> {
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
    return this.request<void>(`/api/v1/ponds/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  // Sensor readings endpoints
  async getSensorReadings(pondId: string, token: string, params?: PaginationParams): Promise<ApiResponse<SensorReading[]>> {
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

  // Latest sensor data (optimized batch storage)
  async getLatestSensorData(pondId: string, token?: string): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return this.request<any>(`/api/v1/sensors/latest/${pondId}`, {
      method: 'GET',
      headers,
    })
  }

  // Sensor batch history
  async getSensorBatchHistory(pondId: string, limit?: number): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    if (limit) queryParams.append('limit', limit.toString())
    
    const queryString = queryParams.toString()
    const url = `/api/v1/sensors/batches/${pondId}${queryString ? `?${queryString}` : ''}`
    
    return this.request<any>(url, {
      method: 'GET',
    })
  }

  // Send batch sensor data
  async sendBatchSensorData(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/api/v1/sensors/batch-sensor-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  // Media endpoints
  async getMedia(pondId: string, token: string, params?: PaginationParams): Promise<ApiResponse<MediaAsset[]>> {
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
    return this.request<ControlLog>(`/api/v1/ponds/${pondId}/control`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ control_type: controlType, value }),
    })
  }

  // Push Notification endpoints
  async getVapidKeys(): Promise<ApiResponse<{ public_key: string; private_key: string; email: string }>> {
    return this.request<{ public_key: string; private_key: string; email: string }>('/api/v1/push/vapid-keys', {
      method: 'GET',
    })
  }

  async subscribeToPush(subscriptionData: PushSubscriptionData, token: string): Promise<ApiResponse<{ id: string; user_id: number; endpoint: string; keys: any; created_at: string; is_active: boolean }>> {
    return this.request<{ id: string; user_id: number; endpoint: string; keys: any; created_at: string; is_active: boolean }>('/api/v1/push/subscribe', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData),
    })
  }

  async getPushSubscriptions(token: string): Promise<ApiResponse<Array<{ id: string; user_id: number; endpoint: string; keys: any; created_at: string; is_active: boolean }>>> {
    return this.request<Array<{ id: string; user_id: number; endpoint: string; keys: any; created_at: string; is_active: boolean }>>('/api/v1/push/subscriptions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async unsubscribeFromPush(subscriptionId: string, token: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/api/v1/push/unsubscribe/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async sendPushMessage(messageData: PushMessageData, token: string): Promise<ApiResponse<{ success: boolean; message: string; sent_count: number; failed_count: number; errors?: string[] }>> {
    return this.request<{ success: boolean; message: string; sent_count: number; failed_count: number; errors?: string[] }>('/api/v1/push/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    })
  }

  async sendShrimpAlert(alertData: ShrimpAlertRequest, token: string): Promise<ApiResponse<{ success: boolean; message: string; sent_count: number; failed_count: number; errors?: string[] }>> {
    // สร้าง message data สำหรับ shrimp alert
    const messageData: PushMessageData = {
      user_id: alertData.user_id,
      title: "พบกุ้งลอยบนผิวน้ำ!!!", // หัวข้อจะถูก override ใน backend
      body: alertData.body || "ตรวจพบกุ้งลอยบนผิวน้ำ ควรตรวจสอบทันที",
      image: alertData.image,
      url: alertData.url,
      tag: "shrimp-alert", // ใช้ tag นี้เพื่อให้ backend รู้ว่าเป็น shrimp alert
      data: alertData.data,
      require_interaction: true,
      silent: false,
      vibrate: [200, 100, 200, 100, 200]
    }

    return this.sendPushMessage(messageData, token)
  }

  async getPushSettings(token: string): Promise<ApiResponse<PushNotificationSettings>> {
    return this.request<PushNotificationSettings>('/api/v1/push/settings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async updatePushSettings(settings: Partial<PushNotificationSettings>, token: string): Promise<ApiResponse<PushNotificationSettings>> {
    return this.request<PushNotificationSettings>('/api/v1/push/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    })
  }

  // History endpoints
  async getHistory(pondId: string, token: string, timeRange?: TimeRange): Promise<ApiResponse<Event[]>> {
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

  async getBatchData(pondId: string, token?: string): Promise<ApiResponse<any>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const url = `/api/v1/sensors/yorrkung-batches/${pondId}`
    
    const response = await this.request<any>(url, {
      method: 'GET',
      headers,
    })
    
    return response
  }

  // Shrimp size graph data
  async getShrimpSizeGraphData(pondId: number, timeframe: string = '1D', hours: number = 24): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams()
    queryParams.append('timeframe', timeframe)
    queryParams.append('hours', hours.toString())
    
    const url = `/api/v1/sensors/graph-shrimpsize/${pondId}?${queryParams.toString()}`
    
    return this.request<any>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/api/v1/health', {
      method: 'GET',
    })
  }

  // Alert methods
  async createAlert(alertData: any, token: string): Promise<ApiResponse<any>> {
    return this.request<any>('/api/v1/alerts/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData),
    })
  }

  async getUserAlerts(userId: number, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/v1/alerts/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async getPondAlerts(pondId: number, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/v1/alerts/pond/${pondId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async getUserUnreadAlerts(userId: number, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/v1/alerts/user/${userId}/unread`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async getPondUnreadAlerts(pondId: number, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/v1/alerts/pond/${pondId}/unread`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async markAlertAsRead(alertId: string, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/v1/alerts/${alertId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async markAlertAsUnread(alertId: string, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/v1/alerts/${alertId}/unread`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async getUserAlertStats(userId: number, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/v1/alerts/user/${userId}/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async getPondBadgeCount(pondId: number, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/v1/alerts/pond/${pondId}/badge-count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async deleteAlert(alertId: string, token: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/v1/alerts/${alertId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  async sendAlertNotification(alertData: any, token: string): Promise<ApiResponse<any>> {
    return this.request<any>('/api/v1/push/send-alert', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData),
    })
  }

  async sendPondAlertNotification(alertData: any, token: string): Promise<ApiResponse<any>> {
    return this.request<any>('/api/v1/push/send-pond-alert', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData),
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
