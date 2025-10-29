# Supabase Utilities

This directory contains Supabase client utilities and authentication helpers for the SSI Automations application.

## Quick Reference

| Client Type | File        | Import                  | Use Case                          |
| ----------- | ----------- | ----------------------- | --------------------------------- |
| Browser     | `client.ts` | `createBrowserClient()` | Client Components, interactive UI |
| Server      | `server.ts` | `createServerClient()`  | Server Components, Server Actions |
| Admin       | `admin.ts`  | `createAdminClient()`   | API routes, admin operations      |

## Files

### `client.ts` - Browser Client

- For Client Components only
- Uses anon key (safe for browser)
- Respects RLS policies
- Inherits user session

```typescript
"use client";
import { createBrowserClient } from "@/lib/supabase";

const supabase = createBrowserClient();
```

### `server.ts` - Server Client

- For Server Components and Actions
- Uses anon key with cookie-based session
- Respects RLS policies
- Has user authentication context

```typescript
import { createServerClient } from "@/lib/supabase";

const supabase = await createServerClient();
```

### `admin.ts` - Admin Client

- For API routes and admin operations
- Uses service_role key (bypasses RLS)
- **Server-side only** - never use in Client Components
- Full database access

```typescript
import { createAdminClient } from "@/lib/supabase/admin";

const supabase = createAdminClient();
```

### Other Files

- `types.ts` - TypeScript types generated from database schema
- `cookies.ts` - Cookie utilities for server-side operations
- `middleware.ts` - Session management for proxy
- `web3.ts` - Web3 wallet authentication (Solana, Ethereum)
- `index.ts` - Convenience exports

## Environment Variables

```bash
# Public (safe for browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Private (server-only, NO NEXT_PUBLIC_ prefix!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## Usage Examples

### Client Component with Real-time

```typescript
"use client";

import { createBrowserClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function Messages() {
  const [messages, setMessages] = useState([]);
  const supabase = createBrowserClient();

  useEffect(() => {
    const channel = supabase
      .channel("messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return <div>{/* Render messages */}</div>;
}
```

### Server Component with Auth

```typescript
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: posts } = await supabase.from("posts").select("*");

  return <div>Dashboard</div>;
}
```

### API Route with Admin Access

```typescript
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

## Security Guidelines

### ✅ DO

- Use browser client in Client Components
- Use server client in Server Components/Actions
- Use admin client only when RLS bypass is required
- Validate all user input before database operations
- Keep service_role key server-side only
- Enable RLS on user-facing tables

### ❌ DON'T

- Use admin client in Client Components
- Expose service*role key with `NEXT_PUBLIC*` prefix
- Trust user input without validation
- Disable RLS without good reason
- Commit `.env.local` to git
- Use admin client as default

## Updating Database Types

When your database schema changes, regenerate TypeScript types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > lib/supabase/types.ts
```

Or get your project ID from the dashboard:

```bash
# Get project ID from Supabase dashboard URL
# https://supabase.com/dashboard/project/YOUR_PROJECT_ID

npx supabase gen types typescript --project-id nycwzpxobcjkvihhrpjf --schema public > lib/supabase/types.ts
```

## Troubleshooting

### "Missing SUPABASE_SERVICE_ROLE_KEY"

- Check `.env.local` exists
- Ensure key does NOT have `NEXT_PUBLIC_` prefix
- Restart dev server after adding env vars

### "Client cannot be used in browser"

- You're using admin client in Client Component
- Use `createBrowserClient()` instead

### Database write fails

- Check if RLS is enabled on table
- If RLS enabled: ensure proper policy exists
- If RLS disabled: use admin client in API route

### Session not persisting

- Verify cookies are being set
- Check proxy.ts is running
- Ensure NEXT_PUBLIC_SUPABASE_URL matches project

## Additional Documentation

- [Security Patterns](../../.docs/supabase/SECURITY_PATTERNS.md) - Comprehensive security guide
- [Supabase Docs](https://supabase.com/docs) - Official documentation
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

## Support

For questions about Supabase integration:

1. Check [Security Patterns](../../.docs/supabase/SECURITY_PATTERNS.md)
2. Review examples in this README
3. Check official [Supabase docs](https://supabase.com/docs)
4. Ask in team chat
