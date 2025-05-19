export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      freights: {
        Row: {
          created_at: string
          delivery_date: string
          description: string
          destination: string
          id: string
          origin: string
          pickup_date: string
          price: number
          status: string
          title: string
          user_id: string
          volume: number
          weight: number
        }
        Insert: {
          created_at?: string
          delivery_date: string
          description: string
          destination: string
          id?: string
          origin: string
          pickup_date: string
          price: number
          status?: string
          title: string
          user_id: string
          volume: number
          weight: number
        }
        Update: {
          created_at?: string
          delivery_date?: string
          description?: string
          destination?: string
          id?: string
          origin?: string
          pickup_date?: string
          price?: number
          status?: string
          title?: string
          user_id?: string
          volume?: number
          weight?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_latitude: number | null
          current_longitude: number | null
          first_name: string | null
          id: string
          is_available: boolean | null
          last_name: string | null
          phone: string | null
          rating: number | null
          rating_count: number | null
          return_destination: string | null
          return_origin: string | null
          updated_at: string | null
          user_type: string
          verification_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          first_name?: string | null
          id: string
          is_available?: boolean | null
          last_name?: string | null
          phone?: string | null
          rating?: number | null
          rating_count?: number | null
          return_destination?: string | null
          return_origin?: string | null
          updated_at?: string | null
          user_type: string
          verification_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          first_name?: string | null
          id?: string
          is_available?: boolean | null
          last_name?: string | null
          phone?: string | null
          rating?: number | null
          rating_count?: number | null
          return_destination?: string | null
          return_origin?: string | null
          updated_at?: string | null
          user_type?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      transport_offers: {
        Row: {
          created_at: string
          freight_id: string
          id: string
          price_offered: number
          status: string
          transporter_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          freight_id: string
          id?: string
          price_offered: number
          status?: string
          transporter_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          freight_id?: string
          id?: string
          price_offered?: number
          status?: string
          transporter_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_offers_freight_id_fkey"
            columns: ["freight_id"]
            isOneToOne: false
            referencedRelation: "freights"
            referencedColumns: ["id"]
          },
        ]
      }
      user_documents: {
        Row: {
          document_type: string
          document_url: string
          id: string
          uploaded_at: string
          user_id: string
          verification_status: string | null
        }
        Insert: {
          document_type: string
          document_url: string
          id?: string
          uploaded_at?: string
          user_id: string
          verification_status?: string | null
        }
        Update: {
          document_type?: string
          document_url?: string
          id?: string
          uploaded_at?: string
          user_id?: string
          verification_status?: string | null
        }
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
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
