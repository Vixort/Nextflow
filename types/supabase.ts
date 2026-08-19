export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/** Role hierarchy: owner > admin > moderator > user */
export type UserRole = 'owner' | 'admin' | 'moderator' | 'user'

/** Numeric weight for role comparison — higher = more authority */
export const ROLE_WEIGHT: Record<UserRole, number> = {
  owner: 100,
  admin: 75,
  moderator: 50,
  user: 10,
}

/** Check if roleA outranks roleB */
export function outranks(roleA: UserRole, roleB: UserRole): boolean {
  return ROLE_WEIGHT[roleA] > ROLE_WEIGHT[roleB]
}

/** Check if a role has admin-level access (owner or admin) */
export function isAdminLevel(role: UserRole): boolean {
  return role === 'owner' || role === 'admin'
}

export type ActivityLog = {
  id: string
  user_id: string | null
  username: string | null
  user_role: string | null
  event_type: 'auth.login' | 'auth.logout' | 'page_view' | 'user.action' | 'admin.action'
  action: string
  description: string
  path: string | null
  from_path: string | null
  to_path: string | null
  metadata: Json
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export type SystemSetting = {
  key: string
  value: Json
  updated_at: string
  updated_by: string | null
}

export type HomeSection = {
  id: string
  name: string
  type: string
  section_order: number
  visible: boolean
  is_builtin: boolean
  custom_data: Json
  created_at: string
  updated_at: string
  updated_by: string | null
}

export type TemplateRenderMode = 'puck' | 'static'

export type WebsiteTemplate = {
  id: string
  name: string
  description: string | null
  category: string | null
  tags: string[] | null
  thumbnail_url: string | null
  puck_data: Json
  puck_layout: Json | null
  puck_texts: Json | null
  global_css: string | null
  render_mode?: TemplateRenderMode
  storage_path?: string | null
  file_name?: string | null
  storage_size_bytes?: number | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

export type Inquiry = {
  id: string
  name: string
  email: string
  service_type: string
  phone: string | null
  business_type: string | null
  budget: string | null
  channel: string | null
  message: string | null
  source: string | null
  status: string
  created_at: string
}

export type AiApiKey = {
  id: string
  provider: 'gemini' | 'openrouter' | 'openai' | 'groq' | 'custom'
  label: string
  key_value: string
  position: number
  enabled: boolean
  model: string | null
  base_url: string | null
  created_at: string
  updated_at: string
}

export type AiChatLog = {
  id: string
  user_id: string | null
  username: string | null
  path: string | null
  provider: string
  model: string
  mode: string | null
  prompt: string | null
  response: string | null
  prompt_tokens: number | null
  completion_tokens: number | null
  ip_address: string | null
  user_agent: string | null
  duration_ms: number | null
  error: string | null
  created_at: string
}

export type AuthLockout = {
  lock_key: string
  failed_count: number
  locked_until: string | null
  last_fail_at: string
}

export type RateLimit = {
  fingerprint: string
  endpoint: string
  window_start: string
  count: number
}

type ContactSessionEvent = {
  t: number
  k: string
  v: string
}

export type Service = {
  id: string
  title: string
  slug: string
  icon: string
  color: string
  description: string
  features: string[]
  outcome: string
  deliverables: string[]
  best_for: string[]
  timeline: string
  contact_service: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ContactSession = {
  id: string
  session_key: string
  inquiry_id: string | null
  events: ContactSessionEvent[]
  name: string | null
  email: string | null
  phone: string | null
  service_type: string | null
  business_type: string | null
  budget: string | null
  channel: string | null
  message: string | null
  started_at: string
  updated_at: string
  submitted_at: string | null
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          password_hash: string
          full_name: string | null
          avatar_url: string | null
          role: UserRole
          token_version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          password_hash: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          token_version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          password_hash?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          token_version?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          full_name: string | null
          avatar_url: string | null
          role: UserRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: ActivityLog
        Insert: Omit<ActivityLog, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<ActivityLog>
        Relationships: []
      }
      system_settings: {
        Row: SystemSetting
        Insert: SystemSetting
        Update: Partial<SystemSetting>
        Relationships: []
      }
      home_sections: {
        Row: HomeSection
        Insert: Omit<HomeSection, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string }
        Update: Partial<HomeSection>
        Relationships: []
      }
      website_templates: {
        Row: WebsiteTemplate
        Insert: Omit<WebsiteTemplate, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<WebsiteTemplate>
        Relationships: []
      }
      inquiries: {
        Row: Inquiry
        Insert: Omit<Inquiry, 'id' | 'created_at' | 'status'> & { id?: string; created_at?: string; status?: string }
        Update: Partial<Inquiry>
        Relationships: []
      }
      ai_api_keys: {
        Row: AiApiKey
        Insert: Omit<AiApiKey, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<AiApiKey>
        Relationships: []
      }
      ai_chat_logs: {
        Row: AiChatLog
        Insert: Omit<AiChatLog, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<AiChatLog>
        Relationships: []
      }
      contact_sessions: {
        Row: ContactSession
        Insert: Pick<ContactSession, 'session_key'> & Partial<Omit<ContactSession, 'session_key'>>
        Update: Partial<ContactSession>
        Relationships: [
          {
            foreignKeyName: 'contact_sessions_inquiry_id_fkey'
            columns: ['inquiry_id']
            isOneToOne: false
            referencedRelation: 'inquiries'
            referencedColumns: ['id']
          },
        ]
      }
      services: {
        Row: Service
        Insert: Omit<Service, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Service>
        Relationships: []
      }
      auth_lockouts: {
        Row: AuthLockout
        Insert: AuthLockout
        Update: Partial<AuthLockout>
        Relationships: []
      }
      rate_limits: {
        Row: RateLimit
        Insert: Pick<RateLimit, 'fingerprint' | 'endpoint' | 'window_start'> & Partial<Pick<RateLimit, 'count'>>
        Update: Partial<RateLimit>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      rate_limit_tick: {
        Args: {
          p_fingerprint: string
          p_endpoint: string
          p_window_start: string
          p_max: number
        }
        Returns: number
      }
      bump_token_versions: {
        Args: Record<string, never>
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_Sep in never]: never
    }
  }
}
