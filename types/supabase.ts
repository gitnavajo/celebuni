// Normally generated via:
// npx supabase gen types typescript --project-id <id> --schema public > types/supabase.ts
// This file matches the MVP schema in supabase/migrations/0001_init.sql.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      celebrities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          bio: string | null;
          image_url: string | null;
          official_url: string | null;
          tmdb_id: number | null;
          category: Database["public"]["Enums"]["celebrity_category"];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          bio?: string | null;
          image_url?: string | null;
          official_url?: string | null;
          tmdb_id?: number | null;
          category: Database["public"]["Enums"]["celebrity_category"];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          bio?: string | null;
          image_url?: string | null;
          official_url?: string | null;
          tmdb_id?: number | null;
          category?: Database["public"]["Enums"]["celebrity_category"];
          created_at?: string;
        };
        Relationships: [];
      };
      appearances: {
        Row: {
          id: string;
          celebrity_id: string;
          event_name: string;
          event_date: string | null; // date
          location: string | null;
          type: Database["public"]["Enums"]["appearance_type"];
          url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          celebrity_id: string;
          event_name: string;
          event_date?: string | null;
          location?: string | null;
          type: Database["public"]["Enums"]["appearance_type"];
          url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          celebrity_id?: string;
          event_name?: string;
          event_date?: string | null;
          location?: string | null;
          type?: Database["public"]["Enums"]["appearance_type"];
          url?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appearances_celebrity_id_fkey";
            columns: ["celebrity_id"];
            isOneToOne: false;
            referencedRelation: "celebrities";
            referencedColumns: ["id"];
          },
        ];
      };
      fan_mail_addresses: {
        Row: {
          id: string;
          celebrity_id: string;
          address: string;
          verified: boolean;
          source: string | null;
          last_updated: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          celebrity_id: string;
          address: string;
          verified?: boolean;
          source?: string | null;
          last_updated?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          celebrity_id?: string;
          address?: string;
          verified?: boolean;
          source?: string | null;
          last_updated?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fan_mail_addresses_celebrity_id_fkey";
            columns: ["celebrity_id"];
            isOneToOne: false;
            referencedRelation: "celebrities";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          published_at: string | null;
          author: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          published_at?: string | null;
          author?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          published_at?: string | null;
          author?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      celebrity_category: "actor" | "voice_actor" | "musician";
      appearance_type: "con" | "panel" | "photo_op";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

