# Supabase Client Architecture

## Overview

This document explains the three-tier Supabase client architecture and when to use each client type.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        SSI AUTOMATIONS                           │
│                      Next.js 16 Application                      │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐      ┌────────────────┐      ┌─────────────────┐
│ BROWSER       │      │ SERVER         │      │ ADMIN           │
│ CLIENT        │      │ CLIENT         │      │ CLIENT          │
├───────────────┤      ├────────────────┤      ├─────────────────┤
│ client.ts     │      │ server.ts      │      │ admin.ts        │
│               │      │                │      │                 │
│ Uses:         │      │ Uses:          │      │ Uses:           │
│ - Anon Key    │      │ - Anon Key     │      │ - Service Key   │
│               │      │ - Cookies      │      │                 │
│               │      │                │      │                 │
│ Access:       │      │ Access:        │      │ Access:         │
│ - RLS Enabled │      │ - RLS Enabled  │      │ - RLS BYPASSED  │
│ - User Data   │      │ - User Context │      │ - ALL DATA      │
│               │      │                │      │                 │
│ Context:      │      │ Context:       │      │ Context:        │
│ - Browser     │      │ - Server-side  │      │ - Server-side   │
│ - Client      │      │ - Server       │      │ - API Routes    │
│   Components  │      │   Components   │      │ - Background    │
│               │      │ - Server       │      │   Jobs          │
│               │      │   Actions      │      │                 │
└───────────────┘      └────────────────┘      └─────────────────┘
        │                        │                        │
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────┐
                    │   SUPABASE DATABASE  │
                    │                      │
                    │  Tables with RLS:    │
                    │  - profiles          │
                    │  - posts             │
                    │  - user_data         │
                    │                      │
                    │  Tables without RLS: │
                    │  - newsletter_sub... │
                    │  - contact_sub...    │
                    └──────────────────────┘
```

## Client Characteristics

### Browser Client

```typescript
import { createBrowserClient } from "@/lib/supabase";
const supabase = createBrowserClient();
```

**Environment Variable:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Key Features:**

- ✅ Safe for browser exposure
- ✅ Respects RLS policies
- ✅ Inherits user session from cookies
- ✅ Perfect for interactive UI
- ❌ Limited by RLS policies

**Use Cases:**

- Real-time subscriptions
- User-initiated actions
- Client Components
- Forms and interactive UI

### Server Client

```typescript
import { createServerClient } from "@/lib/supabase";
const supabase = await createServerClient();
```

**Environment Variable:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` + Cookies

**Key Features:**

- ✅ Server-side rendering
- ✅ Respects RLS policies
- ✅ Has user authentication context
- ✅ Cookie-based session
- ❌ Limited by RLS policies

**Use Cases:**

- Server Components
- Server Actions
- Protected routes
- User-authenticated operations

### Admin Client

```typescript
import { createAdminClient } from "@/lib/supabase/admin";
const supabase = createAdminClient();
```

**Environment Variable:** `SUPABASE_SERVICE_ROLE_KEY` (NO `NEXT_PUBLIC_` prefix!)

**Key Features:**

- ⚠️ BYPASSES ALL RLS POLICIES
- ⚠️ Full database access
- ✅ Server-side only
- ✅ Browser protection built-in
- ❌ Should be used sparingly

**Use Cases:**

- Public API routes (newsletter, contact)
- Admin operations
- Background jobs
- Tables without RLS

## Decision Tree

```
┌─────────────────────────────────────┐
│  Need to access Supabase database?  │
└─────────────────┬───────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  Client-side   │
         │     (Browser)  │
         │      OR        │
         │  Server-side?  │
         └────────┬───────┘
                  │
       ┏━━━━━━━━━━┻━━━━━━━━━━┓
       ▼                      ▼
┌─────────────┐      ┌─────────────────┐
│ Client-side │      │   Server-side   │
└──────┬──────┘      └────────┬────────┘
       │                      │
       ▼                      ▼
┌─────────────┐      ┌─────────────────┐
│   Use:      │      │  Need to bypass │
│   BROWSER   │      │     RLS?        │
│   CLIENT    │      └────────┬────────┘
└─────────────┘               │
                    ┏━━━━━━━━━┻━━━━━━━━━┓
                    ▼                    ▼
            ┌───────────────┐    ┌──────────────┐
            │      NO       │    │     YES      │
            │               │    │              │
            │    Use:       │    │    Use:      │
            │   SERVER      │    │    ADMIN     │
            │   CLIENT      │    │   CLIENT     │
            └───────────────┘    └──────────────┘
```

## Real-World Examples

### Example 1: Newsletter Signup (Public API Route)

**Requirement:** Public users can sign up without authentication

**Solution:** Admin Client (API Route)

```typescript
// app/api/newsletter/route.ts
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  // Use admin client - newsletter_subscribers has RLS disabled
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  return NextResponse.json({ success: !error });
}
```

**Why Admin Client?**

- No user authentication required
- Table has RLS disabled
- Public endpoint
- Admin-controlled data

### Example 2: User Profile Page (Protected Route)

**Requirement:** Show logged-in user their profile data

**Solution:** Server Client (Server Component)

```typescript
// app/profile/page.tsx
import { createServerClient } from "@/lib/supabase";

export default async function ProfilePage() {
  // Use server client - profiles table has RLS enabled
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // RLS ensures only user's profile is returned
  const { data: profile } = await supabase
    .from("profiles")
    .select("*");

  return <div>{profile?.name}</div>;
}
```

**Why Server Client?**

- User authentication required
- RLS protects data
- Server-side rendering
- User-specific data

### Example 3: Real-time Chat (Client Component)

**Requirement:** Users see messages in real-time

**Solution:** Browser Client (Client Component)

```typescript
"use client";

import { createBrowserClient } from "@/lib/supabase";

export function ChatMessages() {
  const supabase = createBrowserClient();

  useEffect(() => {
    // RLS ensures user only sees authorized messages
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        handleNewMessage,
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);
}
```

**Why Browser Client?**

- Real-time subscriptions
- Client Component
- Interactive UI
- RLS protects data

### Example 4: Admin Dashboard (Role-Based Access)

**Requirement:** Admin users can view all user data

**Solution:** Server Client + Admin Client

```typescript
// app/admin/page.tsx
import { createServerClient } from "@/lib/supabase";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  // Step 1: Authenticate and authorize user
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    redirect("/dashboard");
  }

  // Step 2: Use admin client for privileged operations
  const adminClient = createAdminClient();
  const { data: allUsers } = await adminClient
    .from("profiles")
    .select("*");  // Gets ALL profiles (bypasses RLS)

  return <AdminDashboard users={allUsers} />;
}
```

**Why Both Clients?**

- Server Client: Authenticate user
- Admin Client: Bypass RLS for admin view
- Two-step security: Auth first, then admin access

## Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                       REQUEST FLOW                           │
└─────────────────────────────────────────────────────────────┘

1. Browser Request
   └─> Next.js Proxy (proxy.ts)
       └─> Validates Session (Server Client)
           └─> Updates Cookies
               └─> Routes to Component/API

2. Component/API Chooses Client
   │
   ├─> Client Component
   │   └─> Browser Client
   │       └─> Anon Key + Cookies
   │           └─> RLS Applied
   │
   ├─> Server Component
   │   └─> Server Client
   │       └─> Anon Key + Cookies
   │           └─> RLS Applied
   │
   └─> Admin API Route
       └─> Admin Client
           └─> Service Role Key
               └─> RLS BYPASSED

3. Database Operation
   │
   ├─> With RLS
   │   └─> auth.uid() checked
   │       └─> Only authorized data returned
   │
   └─> Without RLS (Admin Client)
       └─> Full access to table
           └─> Application layer security required
```

## Environment Variables Security

```bash
# ✅ CORRECT Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...        # Browser + Server
SUPABASE_SERVICE_ROLE_KEY=eyJ...            # Server ONLY (no prefix!)

# ❌ WRONG Configuration
NEXT_PUBLIC_SERVICE_ROLE_KEY=eyJ...         # SECURITY VIOLATION!
# This exposes admin access to the browser!
```

## Best Practices Summary

### DO ✅

1. Use Browser Client in Client Components
2. Use Server Client for authenticated operations
3. Use Admin Client sparingly and only server-side
4. Enable RLS on all user-facing tables
5. Validate all user input before database operations
6. Keep service_role key server-side only

### DON'T ❌

1. Never expose service_role key to browser
2. Never use Admin Client in Client Components
3. Never disable RLS without good reason
4. Never trust user input without validation
5. Never commit .env.local to git
6. Never use Admin Client as default

## Additional Resources

- [Security Patterns Guide](./SECURITY_PATTERNS.md)
- [Supabase Library README](../../lib/supabase/README.md)
- [Supabase Official Docs](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
