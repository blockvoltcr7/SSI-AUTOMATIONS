# Supabase Quick Reference Card

## Three Client Types - When to Use

| Scenario                          | Client Type | Import                                                     |
| --------------------------------- | ----------- | ---------------------------------------------------------- |
| Client Component (Interactive UI) | Browser     | `import { createBrowserClient } from "@/lib/supabase"`     |
| Server Component (SSR)            | Server      | `import { createServerClient } from "@/lib/supabase"`      |
| Server Action (Form submission)   | Server      | `import { createServerClient } from "@/lib/supabase"`      |
| API Route (User context needed)   | Server      | `import { createServerClient } from "@/lib/supabase"`      |
| API Route (Admin operation)       | Admin       | `import { createAdminClient } from "@/lib/supabase/admin"` |
| Background Job                    | Admin       | `import { createAdminClient } from "@/lib/supabase/admin"` |
| Real-time Subscription            | Browser     | `import { createBrowserClient } from "@/lib/supabase"`     |

## Environment Variables

```bash
# Public - Safe for browser
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Private - Server ONLY (NO NEXT_PUBLIC_ prefix!)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Quick Setup Check

```bash
# 1. Check your .env.local
cat .env.local | grep SUPABASE

# Should see:
# ✅ NEXT_PUBLIC_SUPABASE_URL
# ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
# ✅ SUPABASE_SERVICE_ROLE_KEY (no NEXT_PUBLIC_ prefix!)

# 2. Restart dev server
npm run dev

# 3. Test
# - Client Components should connect
# - Server Components should authenticate
# - Admin operations should work
```

## Code Snippets

### Client Component (Browser Client)

```typescript
"use client";

import { createBrowserClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function MyComponent() {
  const [data, setData] = useState([]);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("table").select("*");
      setData(data || []);
    }
    fetchData();
  }, []);

  return <div>{/* Render data */}</div>;
}
```

### Server Component (Server Client)

```typescript
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase.from("table").select("*");

  return <div>{/* Render data */}</div>;
}
```

### API Route (Admin Client)

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

    // Use admin client for tables without RLS
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

### Server Action (Server Client)

```typescript
"use server";

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ name: formData.get("name") })
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  return { success: true };
}
```

### Real-time Subscription (Browser Client)

```typescript
"use client";

import { createBrowserClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function RealtimeComponent() {
  const [items, setItems] = useState([]);
  const supabase = createBrowserClient();

  useEffect(() => {
    // Fetch initial data
    async function fetchInitial() {
      const { data } = await supabase.from("table").select("*");
      setItems(data || []);
    }
    fetchInitial();

    // Subscribe to changes
    const channel = supabase
      .channel("table-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // or "INSERT", "UPDATE", "DELETE"
          schema: "public",
          table: "table"
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setItems((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setItems((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setItems((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return <div>{/* Render items */}</div>;
}
```

## Authentication Patterns

### Check if User is Logged In (Server)

```typescript
import { createServerClient } from "@/lib/supabase";

const supabase = await createServerClient();
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  // Not logged in
}
```

### Get User Profile (Server)

```typescript
import { createServerClient } from "@/lib/supabase";

const supabase = await createServerClient();
const {
  data: { user },
} = await supabase.auth.getUser();

const { data: profile } = await supabase
  .from("profiles")
  .select("*")
  .eq("user_id", user.id)
  .single();
```

### Protected Route (Server Component)

```typescript
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <div>Protected Content</div>;
}
```

## Common Errors & Fixes

### Error: "Missing SUPABASE_SERVICE_ROLE_KEY"

**Fix:** Check `.env.local` - service*role key should NOT have `NEXT_PUBLIC*` prefix

```bash
# ❌ WRONG
NEXT_PUBLIC_SERVICE_ROLE_KEY=eyJ...

# ✅ CORRECT
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Error: "Client cannot be used in browser"

**Fix:** You're using admin client in Client Component

```typescript
// ❌ WRONG - Client Component
"use client";
import { createAdminClient } from "@/lib/supabase/admin";

// ✅ CORRECT - Client Component
("use client");
import { createBrowserClient } from "@/lib/supabase";
```

### Error: Database write fails

**Fix:** Check if table has RLS enabled

```typescript
// If RLS enabled - use Server or Browser Client
const supabase = await createServerClient();

// If RLS disabled - use Admin Client (API route only)
const supabase = createAdminClient();
```

### Error: "Row Level Security policy violation"

**Fix:** Create proper RLS policy or use Admin Client (server-side only)

```sql
-- Enable RLS
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can read own data"
ON my_table FOR SELECT
USING (auth.uid() = user_id);
```

## Security Checklist

Before deploying:

- [ ] Service*role key has NO `NEXT_PUBLIC*` prefix
- [ ] `.env.local` is in `.gitignore`
- [ ] Admin client only used in server-side code
- [ ] All user input is validated
- [ ] RLS enabled on user-facing tables
- [ ] Error messages don't leak sensitive info
- [ ] Production env vars configured in hosting platform

## Resources

- [Security Patterns Guide](./.docs/supabase/SECURITY_PATTERNS.md)
- [Architecture Diagram](./.docs/supabase/ARCHITECTURE.md)
- [Supabase Library README](./lib/supabase/README.md)
- [Official Supabase Docs](https://supabase.com/docs)

## Need Help?

1. Check this quick reference
2. Review [Security Patterns](./.docs/supabase/SECURITY_PATTERNS.md)
3. Check [Supabase docs](https://supabase.com/docs)
4. Ask in team chat
