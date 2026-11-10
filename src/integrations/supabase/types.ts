export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          body_en: string
          body_fa: string
          cover_url: string | null
          created_at: string
          excerpt_en: string
          excerpt_fa: string
          id: string
          published: boolean
          published_at: string | null
          slug: string
          title_en: string
          title_fa: string
          updated_at: string
        }
        Insert: {
          body_en?: string
          body_fa?: string
          cover_url?: string | null
          created_at?: string
          excerpt_en?: string
          excerpt_fa?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title_en?: string
          title_fa?: string
          updated_at?: string
        }
        Update: {
          body_en?: string
          body_fa?: string
          cover_url?: string | null
          created_at?: string
          excerpt_en?: string
          excerpt_fa?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title_en?: string
          title_fa?: string
          updated_at?: string
        }
        Relationships: []
      }
      bots: {
        Row: {
          category: string
          created_at: string
          features_en: string[]
          features_fa: string[]
          id: string
          image_url: string
          link: string
          platform: string
          price_1: number | null
          price_12: number | null
          price_3: number | null
          price_6: number | null
          published: boolean
          short_en: string
          short_fa: string
          slug: string
          sort_order: number
          title_en: string
          title_fa: string
        }
        Insert: {
          category?: string
          created_at?: string
          features_en?: string[]
          features_fa?: string[]
          id?: string
          image_url?: string
          link?: string
          platform?: string
          price_1?: number | null
          price_12?: number | null
          price_3?: number | null
          price_6?: number | null
          published?: boolean
          short_en?: string
          short_fa?: string
          slug?: string
          sort_order?: number
          title_en?: string
          title_fa?: string
        }
        Update: {
          category?: string
          created_at?: string
          features_en?: string[]
          features_fa?: string[]
          id?: string
          image_url?: string
          link?: string
          platform?: string
          price_1?: number | null
          price_12?: number | null
          price_3?: number | null
          price_6?: number | null
          published?: boolean
          short_en?: string
          short_fa?: string
          slug?: string
          sort_order?: number
          title_en?: string
          title_fa?: string
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          amount_off: number
          coupon_id: string
          created_at: string
          id: string
          payment_id: string
          user_id: string
        }
        Insert: {
          amount_off?: number
          coupon_id?: string
          created_at?: string
          id?: string
          payment_id?: string
          user_id?: string
        }
        Update: {
          amount_off?: number
          coupon_id?: string
          created_at?: string
          id?: string
          payment_id?: string
          user_id?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          bot_ids: string[] | null
          code: string
          created_at: string
          expires_at: string | null
          id: string
          kind: Database["public"]["Enums"]["coupon_kind"]
          max_uses: number | null
          min_amount: number
          note: string | null
          owner_id: string | null
          per_user_limit: number
          starts_at: string | null
          used_count: number
          value: number
        }
        Insert: {
          active?: boolean
          bot_ids?: string[] | null
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["coupon_kind"]
          max_uses?: number | null
          min_amount?: number
          note?: string | null
          owner_id?: string | null
          per_user_limit?: number
          starts_at?: string | null
          used_count?: number
          value?: number
        }
        Update: {
          active?: boolean
          bot_ids?: string[] | null
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["coupon_kind"]
          max_uses?: number | null
          min_amount?: number
          note?: string | null
          owner_id?: string | null
          per_user_limit?: number
          starts_at?: string | null
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      design_styles: {
        Row: {
          created_at: string
          desc_en: string
          desc_fa: string
          id: string
          preview_url: string | null
          published: boolean
          slug: string
          sort_order: number
          title_en: string
          title_fa: string
        }
        Insert: {
          created_at?: string
          desc_en?: string
          desc_fa?: string
          id?: string
          preview_url?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          title_en?: string
          title_fa?: string
        }
        Update: {
          created_at?: string
          desc_en?: string
          desc_fa?: string
          id?: string
          preview_url?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          title_en?: string
          title_fa?: string
        }
        Relationships: []
      }
      licenses: {
        Row: {
          bot_id: string | null
          created_at: string
          expires_at: string
          id: string
          install_url: string | null
          license_key: string
          order_id: string | null
          plan_months: number
          starts_at: string
          status: Database["public"]["Enums"]["license_status"]
          user_id: string
        }
        Insert: {
          bot_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          install_url?: string | null
          license_key?: string
          order_id?: string | null
          plan_months?: number
          starts_at?: string
          status?: Database["public"]["Enums"]["license_status"]
          user_id?: string
        }
        Update: {
          bot_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          install_url?: string | null
          license_key?: string
          order_id?: string | null
          plan_months?: number
          starts_at?: string
          status?: Database["public"]["Enums"]["license_status"]
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          contact: string
          created_at: string
          id: string
          is_read: boolean
          name: string
        }
        Insert: {
          body?: string
          contact?: string
          created_at?: string
          id?: string
          is_read?: boolean
          name?: string
        }
        Update: {
          body?: string
          contact?: string
          created_at?: string
          id?: string
          is_read?: boolean
          name?: string
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          created_at: string
          error: string | null
          id: string
          kind: string
          ref_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          kind?: string
          ref_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          kind?: string
          ref_id?: string | null
          status?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_note: string | null
          bot_id: string | null
          created_at: string
          details: Json
          discount_amount: number
          id: string
          payment_id: string | null
          plan_months: number | null
          status: Database["public"]["Enums"]["order_status"]
          type: Database["public"]["Enums"]["order_type"]
          unit_price: number | null
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          bot_id?: string | null
          created_at?: string
          details?: Json
          discount_amount?: number
          id?: string
          payment_id?: string | null
          plan_months?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          type?: Database["public"]["Enums"]["order_type"]
          unit_price?: number | null
          user_id?: string
        }
        Update: {
          admin_note?: string | null
          bot_id?: string | null
          created_at?: string
          details?: Json
          discount_amount?: number
          id?: string
          payment_id?: string | null
          plan_months?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          type?: Database["public"]["Enums"]["order_type"]
          unit_price?: number | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          admin_note: string | null
          amount: number
          coupon_id: string | null
          created_at: string
          discount_amount: number
          gateway_authority: string | null
          gateway_provider: string | null
          gateway_ref: string | null
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          paid_at: string | null
          payer_note: string | null
          receipt_path: string | null
          receipt_reference: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["payment_status"]
          subtotal: number
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          amount?: number
          coupon_id?: string | null
          created_at?: string
          discount_amount?: number
          gateway_authority?: string | null
          gateway_provider?: string | null
          gateway_ref?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          paid_at?: string | null
          payer_note?: string | null
          receipt_path?: string | null
          receipt_reference?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subtotal?: number
          user_id?: string
        }
        Update: {
          admin_note?: string | null
          amount?: number
          coupon_id?: string | null
          created_at?: string
          discount_amount?: number
          gateway_authority?: string | null
          gateway_provider?: string | null
          gateway_ref?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          paid_at?: string | null
          payer_note?: string | null
          receipt_path?: string | null
          receipt_reference?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subtotal?: number
          user_id?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          created_at: string
          desc_en: string
          desc_fa: string
          id: string
          image_url: string | null
          kind: string
          link: string | null
          published: boolean
          slug: string
          sort_order: number
          title_en: string
          title_fa: string
        }
        Insert: {
          created_at?: string
          desc_en?: string
          desc_fa?: string
          id?: string
          image_url?: string | null
          kind?: string
          link?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          title_en?: string
          title_fa?: string
        }
        Update: {
          created_at?: string
          desc_en?: string
          desc_fa?: string
          id?: string
          image_url?: string | null
          kind?: string
          link?: string | null
          published?: boolean
          slug?: string
          sort_order?: number
          title_en?: string
          title_fa?: string
        }
        Relationships: []
      }
      private_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      product_delivery: {
        Row: {
          bot_id: string
          install_url: string | null
          note_en: string | null
          note_fa: string | null
          updated_at: string
        }
        Insert: {
          bot_id?: string
          install_url?: string | null
          note_en?: string | null
          note_fa?: string | null
          updated_at?: string
        }
        Update: {
          bot_id?: string
          install_url?: string | null
          note_en?: string | null
          note_fa?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          referral_code: string
          referred_by: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          referral_code?: string
          referred_by?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          referral_code?: string
          referred_by?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_id: string
          referrer_id: string
          reward_coupon_id: string | null
          rewarded_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
          reward_coupon_id?: string | null
          rewarded_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
          reward_coupon_id?: string | null
          rewarded_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string
          bot_id: string
          created_at: string
          id: string
          rating: number
          status: Database["public"]["Enums"]["moderation_status"]
          user_id: string
        }
        Insert: {
          body?: string
          bot_id?: string
          created_at?: string
          id?: string
          rating?: number
          status?: Database["public"]["Enums"]["moderation_status"]
          user_id?: string
        }
        Update: {
          body?: string
          bot_id?: string
          created_at?: string
          id?: string
          rating?: number
          status?: Database["public"]["Enums"]["moderation_status"]
          user_id?: string
        }
        Relationships: []
      }
      secret_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key?: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      service_heartbeats: {
        Row: {
          last_seen: string
          message: string | null
          meta: Json
          name: string
          status: string
        }
        Insert: {
          last_seen?: string
          message?: string | null
          meta?: Json
          name?: string
          status?: string
        }
        Update: {
          last_seen?: string
          message?: string | null
          meta?: Json
          name?: string
          status?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          desc_en: string
          desc_fa: string
          icon: string
          id: string
          sort_order: number
          title_en: string
          title_fa: string
        }
        Insert: {
          created_at?: string
          desc_en?: string
          desc_fa?: string
          icon?: string
          id?: string
          sort_order?: number
          title_en?: string
          title_fa?: string
        }
        Update: {
          created_at?: string
          desc_en?: string
          desc_fa?: string
          icon?: string
          id?: string
          sort_order?: number
          title_en?: string
          title_fa?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          is_staff: boolean
          ticket_id: string
        }
        Insert: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          is_staff?: boolean
          ticket_id?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          is_staff?: boolean
          ticket_id?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_list_customers: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string | null
          display_name: string | null
          created_at: string
          last_sign_in_at: string | null
          orders_count: number
          active_licenses_count: number
        }[]
      }
      admin_review_payment: {
        Args: {
          p_payment: string
          p_approve: boolean
          p_note?: string | null
        }
        Returns: undefined
      }
      admin_sales_summary: {
        Args: {
          p_from: string
          p_to: string
          p_bucket?: string | null
        }
        Returns: {
          bucket: string
          payments_count: number
          revenue: number
        }[]
      }
      admin_secret_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          key: string
          is_set: boolean
          hint: string | null
          updated_at: string | null
        }[]
      }
      admin_set_secret: {
        Args: {
          p_key: string
          p_value: string
        }
        Returns: undefined
      }
      admin_set_user_role: {
        Args: {
          p_user: string
          p_role: Database["public"]["Enums"]["app_role"]
          p_grant: boolean
        }
        Returns: undefined
      }
      admin_system_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      bot_rating_summary: {
        Args: {
          p_bot: string
        }
        Returns: {
          review_count: number
          average_rating: number
        }[]
      }
      cancel_payment: {
        Args: {
          p_payment: string
        }
        Returns: undefined
      }
      claim_referral: {
        Args: {
          p_code: string
        }
        Returns: boolean
      }
      create_checkout: {
        Args: {
          items: Json
          coupon_code?: string | null
          method?: Database["public"]["Enums"]["payment_method"] | null
        }
        Returns: Json
      }
      gateway_mark_failed: {
        Args: {
          p_payment: string
        }
        Returns: undefined
      }
      gateway_mark_paid: {
        Args: {
          p_payment: string
          p_authority: string
          p_ref: string
        }
        Returns: undefined
      }
      get_checkout_options: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_public_reviews: {
        Args: {
          p_bot: string
          p_limit?: number | null
        }
        Returns: {
          id: string
          rating: number
          body: string
          author_name: string
          created_at: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_public_site_setting: {
        Args: {
          setting_key: string
          setting_value: Json
        }
        Returns: boolean
      }
      my_referral_summary: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      quote_cart: {
        Args: {
          items: Json
          coupon_code?: string | null
        }
        Returns: Json
      }
      submit_card_receipt: {
        Args: {
          p_payment: string
          p_path: string
          p_reference?: string | null
          p_note?: string | null
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      coupon_kind: "percent" | "fixed"
      license_status: "active" | "expired" | "revoked"
      moderation_status: "pending" | "approved" | "rejected"
      order_status:
        | "pending"
        | "paid"
        | "reviewing"
        | "building"
        | "delivered"
        | "cancelled"
      order_type: "subscription" | "custom_site" | "custom_bot"
      payment_method: "gateway" | "card_to_card"
      payment_status:
        | "initiated"
        | "awaiting_review"
        | "paid"
        | "failed"
        | "rejected"
        | "refunded"
      ticket_status: "open" | "answered" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof DatabaseWithoutInternals, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      coupon_kind: ["percent", "fixed"],
      license_status: ["active", "expired", "revoked"],
      moderation_status: ["pending", "approved", "rejected"],
      order_status: [
        "pending",
        "paid",
        "reviewing",
        "building",
        "delivered",
        "cancelled",
      ],
      order_type: ["subscription", "custom_site", "custom_bot"],
      payment_method: ["gateway", "card_to_card"],
      payment_status: [
        "initiated",
        "awaiting_review",
        "paid",
        "failed",
        "rejected",
        "refunded",
      ],
      ticket_status: ["open", "answered", "closed"],
    },
  },
} as const
