import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

/**
 * Updates the user's authentication session on every request.
 * This function automatically refreshes expired access tokens using refresh tokens.
 *
 * @param request - The incoming Next.js request object
 * @returns NextResponse with updated session cookies
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set cookies on the request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          // Create new response with updated request
          supabaseResponse = NextResponse.next({
            request,
          });

          // Set cookies on the response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  // This automatically refreshes the session if the access token is expired
  // It validates the token with the Supabase Auth server on every request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // List of public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/otp",
    "/about",
    "/blog",
    "/contact",
    "/pricing",
    "/learn",
    "/newsletter",
    "/privacy",
    "/terms",
  ];

  // Check if the current path is a public route or starts with a public route
  const isPublicRoute = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(`${route}/`),
  );

  // Redirect unauthenticated users trying to access protected routes
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
