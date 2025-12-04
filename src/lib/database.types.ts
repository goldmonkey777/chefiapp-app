export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string
          id: string
          name: string
          trigger_type: string
          trigger_value: number | null
          xp: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon: string
          id: string
          name: string
          trigger_type: string
          trigger_value?: number | null
          xp: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string
          id?: string
          name?: string
          trigger_type?: string
          trigger_value?: number | null
          xp?: number
        }
        Relationships: []
      }
      activities: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string
          id: string
          type: string
          user_id: string
          xp_change: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          type: string
          user_id: string
          xp_change?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          type?: string
          user_id?: string
          xp_change?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      check_ins: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          company_id: string | null
          created_at: string | null
          duration: number | null
          id: string
          location_lat: number | null
          location_lng: number | null
          user_id: string
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          company_id?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          user_id: string
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          company_id?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      checkins: {
        Row: {
          employee_name: string
          id: string
          latitude: number
          longitude: number
          timestamp: string | null
          user_email: string
        }
        Insert: {
          employee_name: string
          id?: string
          latitude: number
          longitude: number
          timestamp?: string | null
          user_email: string
        }
        Update: {
          employee_name?: string
          id?: string
          latitude?: number
          longitude?: number
          timestamp?: string | null
          user_email?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string
          address_number: string
          city: string
          closing_time: string | null
          cnpj_ein: string | null
          complement: string | null
          country: string
          created_at: string | null
          currency: string
          email: string
          employee_count_range: string | null
          id: string
          language: string
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          opening_time: string | null
          owner_id: string
          phone: string | null
          postal_code: string
          preset: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          address_number: string
          city: string
          closing_time?: string | null
          cnpj_ein?: string | null
          complement?: string | null
          country: string
          created_at?: string | null
          currency?: string
          email: string
          employee_count_range?: string | null
          id?: string
          language?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          opening_time?: string | null
          owner_id: string
          phone?: string | null
          postal_code: string
          preset?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          address_number?: string
          city?: string
          closing_time?: string | null
          cnpj_ein?: string | null
          complement?: string | null
          country?: string
          created_at?: string | null
          currency?: string
          email?: string
          employee_count_range?: string | null
          id?: string
          language?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          opening_time?: string | null
          owner_id?: string
          phone?: string | null
          postal_code?: string
          preset?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kv_store_0d9071e5: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_60c1dd3a: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      kv_store_7c3bf5a1: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      notifications: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          message: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price_cents: number
          product_id: string | null
          qty: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price_cents: number
          product_id?: string | null
          qty: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price_cents?: number
          product_id?: string | null
          qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          status: string
          table_id: string | null
          total_cents: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          status?: string
          table_id?: string | null
          total_cents?: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          status?: string
          table_id?: string | null
          total_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          category: string | null
          created_at: string | null
          id: string
          name: string
          price_cents: number
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
          price_cents: number
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
          price_cents?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auth_method: string | null
          avatar: string | null
          company_id: string | null
          created_at: string | null
          department: string | null
          email: string | null
          id: string
          last_check_in: string | null
          last_check_out: string | null
          level: number
          name: string
          next_level_xp: number | null
          profile_photo: string | null
          role: string
          sector: string | null
          shift_status: string | null
          status: string | null
          streak: number | null
          updated_at: string | null
          xp: number
        }
        Insert: {
          auth_method?: string | null
          avatar?: string | null
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          id: string
          last_check_in?: string | null
          last_check_out?: string | null
          level?: number
          name: string
          next_level_xp?: number | null
          profile_photo?: string | null
          role?: string
          sector?: string | null
          shift_status?: string | null
          status?: string | null
          streak?: number | null
          updated_at?: string | null
          xp?: number
        }
        Update: {
          auth_method?: string | null
          avatar?: string | null
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          last_check_in?: string | null
          last_check_out?: string | null
          level?: number
          name?: string
          next_level_xp?: number | null
          profile_photo?: string | null
          role?: string
          sector?: string | null
          shift_status?: string | null
          status?: string | null
          streak?: number | null
          updated_at?: string | null
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          active: boolean
          created_at: string | null
          id: string
          label: string
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          id?: string
          label: string
        }
        Update: {
          active?: boolean
          created_at?: string | null
          id?: string
          label?: string
        }
        Relationships: []
      }
      sectors: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sectors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_by: string | null
          assigned_to: string | null
          company_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          due_time: string | null
          estimated_time: string | null
          id: string
          priority: string
          started_at: string | null
          status: string
          title: string
          xp_reward: number
        }
        Insert: {
          assigned_by?: string | null
          assigned_to?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          estimated_time?: string | null
          id?: string
          priority?: string
          started_at?: string | null
          status?: string
          title: string
          xp_reward?: number
        }
        Update: {
          assigned_by?: string | null
          assigned_to?: string | null
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          estimated_time?: string | null
          id?: string
          priority?: string
          started_at?: string | null
          status?: string
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_company_id: { Args: { user_uuid: string }; Returns: string }
      increment_xp: {
        Args: { amount: number; user_id: string }
        Returns: undefined
      }
      sync_existing_users_to_profiles: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
