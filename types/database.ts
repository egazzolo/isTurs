export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          plan: "free" | "pro";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          plan?: "free" | "pro";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          plan?: "free" | "pro";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          type: "quiz" | "match_up" | "whack_a_mole" | "spin_wheel";
          title: string;
          slug: string;
          content: Json;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "quiz" | "match_up" | "whack_a_mole" | "spin_wheel";
          title: string;
          slug: string;
          content?: Json;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: Json;
          is_public?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      results: {
        Row: {
          id: string;
          activity_id: string;
          score: number | null;
          max_score: number | null;
          completion_time_seconds: number | null;
          payload: Json;
          played_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          score?: number | null;
          max_score?: number | null;
          completion_time_seconds?: number | null;
          payload?: Json;
          played_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience row types for use in components
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Activity = Database["public"]["Tables"]["activities"]["Row"];
export type Result = Database["public"]["Tables"]["results"]["Row"];
