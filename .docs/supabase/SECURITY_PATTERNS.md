# Supabase Security Patterns for SSI Automations

## Overview

This document defines the security patterns and best practices for using Supabase in our Next.js application. Following these patterns ensures data security, prevents unauthorized access, and maintains compliance with security standards.

## Three Client Types

### 1. Browser Client (Client Components)

**File:** `/lib/supabase/client.ts`

**Import:**

```typescript
import { createBrowserClient } from "@/lib/supabase";
```

**Usage:**

- Client Components only
- Interactive features (forms, realtime subscriptions)
- User-initiated actions in the browser

**Key Characteristics:**

- Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (safe for browser)
- Respects Row Level Security (RLS) policies
- Inherits user session from cookies
- Limited to authenticated user's data (via RLS)

**Example:**

```typescript
"use client";

import { createBrowserClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function UserProfile() {
  const [profile, setProfile] = useState(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .single();
      setProfile(data);
    }
    loadProfile();
  }, []);

  return <div>{profile?.name}</div>;
}
```

### 2. Server Client (Server Components, Server Actions)

**File:** `/lib/supabase/server.ts`

**Import:**

```typescript
import { createServerClient } from "@/lib/supabase";
```

**Usage:**

- Server Components
- Server Actions
- Middleware/Proxy
- Route Handlers (when user context needed)

**Key Characteristics:**

- Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` (same as browser)
- Respects Row Level Security (RLS) policies
- Reads session from server-side cookies
- Has access to user authentication context

**Example:**

```typescript
// app/dashboard/page.tsx
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Query respects RLS - only returns user's data
  const { data: posts } = await supabase
    .from("posts")
    .select("*");

  return <div>Dashboard</div>;
}
```

### 3. Admin Client (Server-Side Admin Operations)

**File:** `/lib/supabase/admin.ts`

**Import:**

```typescript
import { createAdminClient } from "@/lib/supabase/admin";
```

**Usage:**

- API Routes (for admin operations)
- Background jobs/cron tasks
- System-level operations
- Operations on tables without RLS

**Key Characteristics:**

- Uses `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- **BYPASSES all Row Level Security policies**
- Full database access (read/write/delete)
- No user authentication context
- Should only be used when RLS bypass is required

**CRITICAL SECURITY RULES:**

1. ❌ NEVER use in Client Components
2. ❌ NEVER expose service_role key to browser
3. ✅ Only use in server-side code
4. ✅ Validate all input before database operations
5. ✅ Log all admin operations for audit trail

**Example:**

```typescript
// app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate input
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Admin client can write to table without RLS
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.toLowerCase() });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

## Environment Variables

### Required Variables

```bash
# Public - Safe for browser
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...  # Public anon key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Private - Server-only (NO NEXT_PUBLIC_ prefix!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Service role key
```

### Security Rules for Environment Variables

1. **NEXT*PUBLIC*** prefix = Browser accessible
2. **No prefix** = Server-only
3. Service role key must NEVER have `NEXT_PUBLIC_` prefix
4. All keys should be in `.env.local` (gitignored)
5. Production keys should be in hosting platform env vars (Vercel, etc.)

### Checking Your Configuration

```bash
# ✅ CORRECT - Service role key has NO prefix
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# ❌ WRONG - This exposes admin access to browser!
NEXT_PUBLIC_SERVICE_ROLE_KEY=eyJhbGc...
```

## When to Use Each Client

### Use Browser Client When:

- ✅ Building interactive UI components
- ✅ Real-time subscriptions in Client Components
- ✅ User-triggered actions (forms, buttons)
- ✅ Need access to user's own data only

### Use Server Client When:

- ✅ Fetching data in Server Components
- ✅ Implementing Server Actions
- ✅ Need to check user authentication
- ✅ Working with RLS-protected data
- ✅ Building authenticated API routes

### Use Admin Client When:

- ✅ Public API routes (newsletter signup, contact forms)
- ✅ Background jobs (data cleanup, batch operations)
- ✅ Admin dashboards/operations
- ✅ Working with tables that have RLS disabled
- ✅ System-level operations that must bypass RLS

## Row Level Security (RLS) Best Practices

### Tables with RLS Enabled

**Recommended:** Use Server or Browser Client with proper RLS policies

```sql
-- Example: Users can only read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Example: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);
```

**Client Pattern:**

```typescript
// Server Component
const supabase = await createServerClient();
const { data } = await supabase.from("profiles").select("*"); // RLS ensures only user's data
```

### Tables without RLS

**Recommended:** Use Admin Client in server-side code only

```typescript
// API Route only
const supabase = createAdminClient();
const { data } = await supabase.from("public_content").select("*");
```

### When to Disable RLS

Only disable RLS when:

1. Table contains purely public data
2. Access is controlled at application layer
3. Table is only accessed via admin operations

**Tables that typically have RLS disabled:**

- `newsletter_subscribers` (admin-only writes)
- `contact_submissions` (admin-only writes)
- Public content that's not user-specific

## Common Patterns

### Newsletter Signup (Public API Route)

```typescript
// app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate input (CRITICAL)
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Check for duplicates
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Already subscribed" },
        { status: 409 },
      );
    }

    // Insert new subscriber
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

### User Profile (Protected Route)

```typescript
// app/profile/page.tsx
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // RLS ensures only user's profile is returned
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return <div>{profile?.name}</div>;
}
```

### Admin Dashboard (Role-Based Access)

```typescript
// app/admin/page.tsx
import { createServerClient } from "@/lib/supabase";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  // First: Authenticate user
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Second: Check admin role
  const isAdmin = user.app_metadata?.role === "admin";
  if (!isAdmin) redirect("/dashboard");

  // Third: Use admin client for privileged operations
  const adminClient = createAdminClient();
  const { data: allUsers } = await adminClient
    .from("profiles")
    .select("*");

  return <div>Admin Dashboard</div>;
}
```

### Real-time Subscription (Client Component)

```typescript
"use client";

import { createBrowserClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function RealtimeMessages() {
  const [messages, setMessages] = useState([]);
  const supabase = createBrowserClient();

  useEffect(() => {
    // RLS ensures user only sees their messages
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return <div>{/* Render messages */}</div>;
}
```

## Security Checklist

### Before Deploying

- [ ] All service*role keys use `SUPABASE_SERVICE_ROLE_KEY` (no `NEXT_PUBLIC*` prefix)
- [ ] `.env.local` is in `.gitignore`
- [ ] Admin client is only imported in server-side files
- [ ] All user input is validated before database operations
- [ ] RLS policies are enabled on user-facing tables
- [ ] Error messages don't expose sensitive information
- [ ] Database operations have proper error handling
- [ ] Admin operations are logged for audit trail

### Code Review Questions

1. Does this component need admin access? (Use sparingly)
2. Is user input validated before database operations?
3. Are error messages safe to expose to users?
4. Does this operation respect user permissions?
5. Is the Supabase client appropriate for the context?

## Troubleshooting

### Problem: Database writes fail

**Solution:** Check if table has RLS enabled. If yes, ensure proper RLS policy exists. If no, use admin client.

### Problem: "Missing SUPABASE_SERVICE_ROLE_KEY"

**Solution:** Check `.env.local` - service role key should NOT have `NEXT_PUBLIC_` prefix.

### Problem: User can see other users' data

**Solution:** Enable RLS on the table and create proper policies. Never rely solely on application logic.

### Problem: "Client cannot be used in browser"

**Solution:** You're trying to use admin client in a Client Component. Use browser client instead.

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- Project-specific: `/lib/supabase/README.md`

## Questions?

When in doubt:

1. Use Server Client by default for server-side operations
2. Only use Admin Client when RLS bypass is absolutely necessary
3. Always validate user input
4. Log admin operations
5. Ask for code review before using admin client
