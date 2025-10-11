import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js Middleware - runs on every request matching the config below.
 * Automatically refreshes Supabase auth sessions to prevent unexpected logouts.
 */
export async function middleware(request: NextRequest) {
  // Update user's auth session (refreshes tokens if needed)
  return await updateSession(request);
}

/**
 * Matcher configuration - defines which routes this middleware runs on.
 * Excludes static files, images, and Next.js internal routes for performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with common image/static file extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
