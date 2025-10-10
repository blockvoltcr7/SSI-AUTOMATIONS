// This file contains TypeScript types for your Supabase database.
// Generate these types using the Supabase CLI:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > lib/supabase/types.ts
//
// Or define them manually based on your database schema.

export type Database = {
  public: {
    Tables: {
      // Define your table types here
      // Example:
      // users: {
      //   Row: {
      //     id: string
      //     email: string
      //     created_at: string
      //   }
      //   Insert: {
      //     id?: string
      //     email: string
      //     created_at?: string
      //   }
      //   Update: {
      //     id?: string
      //     email?: string
      //     created_at?: string
      //   }
      // }
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
