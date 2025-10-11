// Re-export all Supabase utilities for convenience
export { createClient as createBrowserClient } from "./client";
export { createClient as createServerClient } from "./server";
export { getAllCookies, setAllCookies } from "./cookies";
export { updateSession } from "./middleware";
export type { Database } from "./types";
