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

export type WebsiteTemplate = {
  id: string
  name: string
  description: string | null
  category: string | null
  thumbnail_url: string | null
  grapesjs_data: Json
  html_code: string | null
  css_code: string | null
  global_css: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_Sep in never]: never
    }
  }
}
