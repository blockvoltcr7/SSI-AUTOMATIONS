export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      checkpoint_blobs: {
        Row: {
          blob: string | null;
          channel: string;
          checkpoint_ns: string;
          thread_id: string;
          type: string;
          version: string;
        };
        Insert: {
          blob?: string | null;
          channel: string;
          checkpoint_ns?: string;
          thread_id: string;
          type: string;
          version: string;
        };
        Update: {
          blob?: string | null;
          channel?: string;
          checkpoint_ns?: string;
          thread_id?: string;
          type?: string;
          version?: string;
        };
        Relationships: [];
      };
      checkpoint_migrations: {
        Row: {
          v: number;
        };
        Insert: {
          v: number;
        };
        Update: {
          v?: number;
        };
        Relationships: [];
      };
      checkpoint_writes: {
        Row: {
          blob: string;
          channel: string;
          checkpoint_id: string;
          checkpoint_ns: string;
          idx: number;
          task_id: string;
          task_path: string;
          thread_id: string;
          type: string | null;
        };
        Insert: {
          blob: string;
          channel: string;
          checkpoint_id: string;
          checkpoint_ns?: string;
          idx: number;
          task_id: string;
          task_path?: string;
          thread_id: string;
          type?: string | null;
        };
        Update: {
          blob?: string;
          channel?: string;
          checkpoint_id?: string;
          checkpoint_ns?: string;
          idx?: number;
          task_id?: string;
          task_path?: string;
          thread_id?: string;
          type?: string | null;
        };
        Relationships: [];
      };
      checkpoints: {
        Row: {
          checkpoint: Json;
          checkpoint_id: string;
          checkpoint_ns: string;
          metadata: Json;
          parent_checkpoint_id: string | null;
          thread_id: string;
          type: string | null;
        };
        Insert: {
          checkpoint: Json;
          checkpoint_id: string;
          checkpoint_ns?: string;
          metadata?: Json;
          parent_checkpoint_id?: string | null;
          thread_id: string;
          type?: string | null;
        };
        Update: {
          checkpoint?: Json;
          checkpoint_id?: string;
          checkpoint_ns?: string;
          metadata?: Json;
          parent_checkpoint_id?: string | null;
          thread_id?: string;
          type?: string | null;
        };
        Relationships: [];
      };
      langchain_pg_collection: {
        Row: {
          cmetadata: Json | null;
          name: string;
          uuid: string;
        };
        Insert: {
          cmetadata?: Json | null;
          name: string;
          uuid: string;
        };
        Update: {
          cmetadata?: Json | null;
          name?: string;
          uuid?: string;
        };
        Relationships: [];
      };
      langchain_pg_embedding: {
        Row: {
          cmetadata: Json | null;
          collection_id: string | null;
          document: string | null;
          embedding: string | null;
          id: string;
        };
        Insert: {
          cmetadata?: Json | null;
          collection_id?: string | null;
          document?: string | null;
          embedding?: string | null;
          id: string;
        };
        Update: {
          cmetadata?: Json | null;
          collection_id?: string | null;
          document?: string | null;
          embedding?: string | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "langchain_pg_embedding_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "langchain_pg_collection";
            referencedColumns: ["uuid"];
          },
        ];
      };
      newsletter_subscribers: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          status: string;
          subscribed_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          status?: string;
          subscribed_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          status?: string;
          subscribed_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
