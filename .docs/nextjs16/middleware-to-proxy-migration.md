# Middleware to Proxy Migration (Next.js 16)

**Date:** 2025-10-26
**Next.js Version:** 16.0.0

## Overview

Next.js 16 deprecated the `middleware` file convention in favor of `proxy` to better clarify its purpose and prevent confusion with Express.js middleware patterns.

## What Changed

### File Rename
- **Before:** `middleware.ts`
- **After:** `proxy.ts`

### Function Rename
- **Before:** `export async function middleware(request: NextRequest)`
- **After:** `export async function proxy(request: NextRequest)`

### Comments Updated
- Updated documentation comments to reference "Proxy" instead of "Middleware"
- Added note about Node.js runtime requirement

## Key Differences: Middleware vs Proxy

| Feature | Middleware (Deprecated) | Proxy (New) |
|---------|-------------------------|-------------|
| **Runtime** | Edge or Node.js | Node.js only |
| **File Location** | `middleware.ts` | `proxy.ts` |
| **Function Name** | `middleware()` | `proxy()` |
| **Configuration** | `config` export | Same `config` export |
| **Matcher** | Same syntax | Same syntax |
| **API** | NextRequest/NextResponse | Same API |

## Why "Proxy"?

The term "proxy" better describes the feature's actual behavior:
- Acts as a **network boundary** in front of your application
- Intercepts requests before they reach your routes
- Can modify, redirect, or respond to requests
- Runs closer to users (distributed Edge network)

The term "middleware" was misleading because:
- It suggested Express.js-style middleware chains
- It encouraged overuse as a catch-all solution
- It didn't clarify the network boundary concept

## Migration Steps Taken

1. ✅ Renamed `middleware.ts` to `proxy.ts`
2. ✅ Changed function name from `middleware` to `proxy`
3. ✅ Updated comments to reflect new naming
4. ✅ Verified dev server starts without deprecation warning
5. ✅ Confirmed type check passes

## What Stayed the Same

- **Matcher configuration** - No changes needed
- **Request handling logic** - All Supabase auth logic unchanged
- **Public/protected route logic** - Same behavior
- **Cookie handling** - `lib/supabase/middleware.ts` unchanged (internal utility)
- **Export structure** - Still exports `config` object

## Current Implementation

### `proxy.ts`
```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js Proxy - runs on every request matching the config below.
 * Automatically refreshes Supabase auth sessions to prevent unexpected logouts.
 * Note: Runs in Node.js runtime (not Edge) as of Next.js 16.
 */
export async function proxy(request: NextRequest) {
  // Update user's auth session (refreshes tokens if needed)
  return await updateSession(request);
}

/**
 * Matcher configuration - defines which routes this proxy runs on.
 * Excludes static files, images, and Next.js internal routes for performance.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### Proxy Behavior
- **Intercepts:** All requests except static files, images, and Next.js internals
- **Authenticates:** Refreshes Supabase auth tokens on every request
- **Protects:** Redirects unauthenticated users to `/login` for protected routes
- **Public Routes:** `/`, `/login`, `/otp`, `/about`, `/blog`, `/contact`, `/pricing`, `/learn`, `/newsletter`, `/privacy`, `/terms`

## Testing Verification

### ✅ Dev Server Test
```bash
pnpm run dev
```
**Result:** No deprecation warnings, server starts in ~1350ms

### ✅ Type Check
```bash
pnpm run type-check
```
**Result:** All types valid, no errors

### ✅ Expected Behavior
- Auth session refresh works correctly
- Protected routes redirect to login
- Public routes accessible without auth
- Cookies properly set/read

## Official Documentation

- **Migration Guide:** https://nextjs.org/docs/messages/middleware-to-proxy
- **Proxy API Reference:** https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- **Upgrading to Next.js 16:** https://nextjs.org/docs/app/guides/upgrading/version-16

## Automated Migration (Alternative)

Next.js provides a codemod for automatic migration:
```bash
npx @next/codemod@canary middleware-to-proxy .
```

This command handles file renaming and function name updates automatically.

## Future Considerations

- Next.js is moving toward better-designed APIs with improved ergonomics
- Proxy/Middleware should be used as a last resort
- Consider moving logic to Server Components or Route Handlers where possible
- The `middleware` convention may be fully removed in a future major version

## Notes

- The `lib/supabase/middleware.ts` file remains unchanged - it's an internal utility function, not a Next.js middleware file
- No runtime behavior changes - the proxy works exactly like the old middleware
- All existing auth logic, route protection, and session management continues to work identically
