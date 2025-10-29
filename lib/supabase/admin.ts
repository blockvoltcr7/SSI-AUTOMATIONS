/**
 * Supabase Admin Client
 *
 * SECURITY WARNING: This client uses the service_role key which bypasses ALL RLS policies.
 *
 * - Use ONLY in server-side code (API routes, Server Actions, Server Components)
 * - NEVER import or use in Client Components
 * - Has full admin access to all tables regardless of RLS
 * - Suitable for operations that require elevated privileges
 *
 * Usage:
 * ```typescript
 * import { createAdminClient } from "@/lib/supabase/admin";
 *
 * // In API route or Server Action
 * const supabase = createAdminClient();
 * const { data, error } = await supabase.from('table').insert(data);
 * ```
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Creates a Supabase client with service_role privileges.
 *
 * This client bypasses Row Level Security (RLS) and has full database access.
 * Should only be used for:
 * - Admin operations that need to bypass RLS
 * - Background jobs and cron tasks
 * - System-level operations
 * - Operations on tables without RLS enabled
 *
 * @returns Supabase admin client instance
 * @throws Error if service_role key is not configured
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. " +
        "This should be your Supabase project URL.",
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY environment variable. " +
        "CRITICAL: This key must NOT have NEXT_PUBLIC_ prefix. " +
        "The service_role key should only be accessible server-side.",
    );
  }

  // Validate that service_role key is not accidentally exposed
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY VIOLATION: Admin client cannot be used in browser. " +
        "This client has elevated privileges and must only run server-side.",
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      // Disable session persistence for admin client
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Type-safe admin client instance
 * Use this for better TypeScript inference
 */
export type AdminClient = ReturnType<typeof createAdminClient>;
