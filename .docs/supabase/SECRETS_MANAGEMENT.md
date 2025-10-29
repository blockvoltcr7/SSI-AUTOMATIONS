# Supabase Secrets Management Guide

> **Official Documentation Reference**: https://supabase.com/docs/guides/functions/secrets

This guide explains how to securely manage secrets (API keys, service role keys, database credentials) in your Next.js + Supabase application.

---

## Table of Contents

1. [Understanding Supabase Keys](#understanding-supabase-keys)
2. [Environment Variable Setup](#environment-variable-setup)
3. [Security Best Practices](#security-best-practices)
4. [Development vs Production](#development-vs-production)
5. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
6. [Testing Configuration](#testing-configuration)

---

## Understanding Supabase Keys

### Default Secrets Provided by Supabase

Supabase automatically provides four default secrets:

| Secret                      | Description                  | Safe for Browser? | Use Case                     |
| --------------------------- | ---------------------------- | ----------------- | ---------------------------- |
| `SUPABASE_URL`              | API gateway for your project | ✅ Yes            | All client/server operations |
| `SUPABASE_ANON_KEY`         | Anonymous key with RLS       | ✅ Yes (with RLS) | Browser, authenticated users |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key bypassing RLS      | ❌ **NEVER**      | Server-only admin operations |
| `SUPABASE_DB_URL`           | Direct Postgres connection   | ❌ **NEVER**      | Server-only database access  |

### Key Differences

**Anon Key:**

- Respects Row Level Security (RLS) policies
- Safe to expose in browser when RLS is enabled
- Limited to operations allowed by database policies
- Used for client-side authentication and queries

**Service Role Key:**

- **Bypasses ALL Row Level Security policies**
- Full administrative access to database
- **MUST NEVER be exposed to browser or client-side code**
- Used for admin operations, migrations, system tasks

---

## Environment Variable Setup

### Current Project Structure

```
SSI-AUTOMATIONS/
├── .env.local          # Local development (git-ignored)
├── .env.example        # Template for developers
├── .env                # Base environment (optional)
└── .gitignore          # Must include .env.local
```

### Proper Environment File (`.env.local`)

```bash
# =============================================================================
# SUPABASE CONFIGURATION
# =============================================================================

# Public - Safe for browser (via NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Private - SERVER ONLY (no NEXT_PUBLIC_ prefix)
# ⚠️ CRITICAL: This key bypasses ALL Row Level Security
# ⚠️ NEVER expose to browser or commit to git
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# =============================================================================
# EMAIL CONFIGURATION (SendGrid)
# =============================================================================
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=noreply@yourdomain.com

# =============================================================================
# OPTIONAL: Other service credentials
# =============================================================================
# LOG_LEVEL=DEBUG
```

### Environment Variable Naming Convention

| Prefix          | Exposure            | Usage                                    |
| --------------- | ------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_*` | ✅ Browser + Server | Public configuration (URLs, anon keys)   |
| No prefix       | ❌ Server ONLY      | Private secrets (service role, API keys) |

**Next.js Behavior:**

- Variables with `NEXT_PUBLIC_` are embedded in the browser bundle
- Variables without prefix are only available server-side (API routes, server components)

---

## Security Best Practices

### ✅ DO: Secure Patterns

#### 1. Use Service Role Key Server-Side Only

```typescript
// ✅ CORRECT: API Route (server-side)
// app/api/admin/route.ts
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  // Service role key is accessed server-side
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: "user@example.com" });

  // This operation bypasses RLS (intentional for admin)
  return Response.json({ data });
}
```

#### 2. Use Anon Key in Browser with RLS

```typescript
// ✅ CORRECT: Client Component (browser)
// app/components/UserProfile.tsx
"use client";
import { createBrowserClient } from "@/lib/supabase/client";

export function UserProfile() {
  const supabase = createBrowserClient();

  // Uses anon key, respects RLS policies
  // User can only access their own data (enforced by RLS)
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId);
}
```

#### 3. Environment Variable Validation

```typescript
// ✅ CORRECT: Validate at startup
// lib/supabase/admin.ts
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. " +
        "This is required for admin operations.",
    );
  }

  // Browser protection
  if (typeof window !== "undefined") {
    throw new Error(
      "Admin client cannot be used in browser. " +
        "Use createBrowserClient() instead.",
    );
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
```

### ❌ DON'T: Insecure Anti-Patterns

#### 1. Never Prefix Service Role with NEXT*PUBLIC*

```bash
# ❌ WRONG: Exposes service role to browser
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# ✅ CORRECT: Server-only access
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

#### 2. Never Use Service Role in Client Components

```typescript
// ❌ WRONG: Service role in browser
"use client";
export function MyComponent() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY!, // 🔥 EXPOSED TO BROWSER
  );
}
```

#### 3. Never Commit `.env.local` to Git

```bash
# ✅ CORRECT: .gitignore
.env.local
.env*.local
*.env
!.env.example
```

#### 4. Never Hardcode Secrets in Source Code

```typescript
// ❌ WRONG: Hardcoded secret in code
const ADMIN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

// ✅ CORRECT: Read from environment
const ADMIN_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

---

## Development vs Production

### Development Setup

**Local Development (`.env.local`):**

```bash
# Your local Supabase project
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...local-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...local-service-key
```

**Running locally:**

```bash
npm run dev
# Next.js automatically loads .env.local
```

### Production Deployment

**Vercel Environment Variables:**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add secrets individually:

| Variable Name                   | Value                      | Exposure                 |
| ------------------------------- | -------------------------- | ------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://prod.supabase.co` | ✅ All (Client & Server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...prod-anon`     | ✅ All (Client & Server) |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJhbGci...prod-service`  | ❌ Server-side only      |
| `SENDGRID_API_KEY`              | `SG.xxxxx`                 | ❌ Server-side only      |

**Important:**

- Vercel automatically separates `NEXT_PUBLIC_` variables (bundled) from private variables (server-only)
- Use different Supabase projects for dev/staging/production
- **Never copy production secrets to local `.env.local`**

### Supabase Edge Functions

If using Supabase Edge Functions, set secrets via CLI:

```bash
# Set secrets for Edge Functions
supabase secrets set SENDGRID_API_KEY=SG.xxxxx
supabase secrets set EXTERNAL_API_KEY=abc123

# List current secrets
supabase secrets list

# Secrets are available immediately (no redeployment needed)
```

---

## Common Mistakes to Avoid

### Mistake 1: Disabling RLS Without Using Service Role

```typescript
// ❌ PROBLEM: RLS disabled, using anon key
// Table has no RLS policies
const supabase = createBrowserClient(); // Uses anon key

await supabase.from("newsletter_subscribers").insert({ email });
// ❌ FAILS: Anon key can't write without RLS or policies
```

**Solution:**

- **Option A**: Enable RLS and create proper policies
- **Option B**: Use service role key server-side (current approach)

### Mistake 2: Using Admin Client in Server Components

```typescript
// ⚠️ CAREFUL: Server Component (not API route)
// app/dashboard/page.tsx
import { createAdminClient } from '@/lib/supabase/admin';

export default async function DashboardPage() {
  const supabase = createAdminClient(); // Uses service role

  // This bypasses RLS - user sees ALL data
  const { data } = await supabase.from('profiles').select('*');

  return <div>{/* All users' profiles exposed */}</div>;
}
```

**Solution:**
Use `createServerClient()` in Server Components for user-scoped data:

```typescript
// ✅ CORRECT: Server Component
import { createServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerClient(); // Uses anon key + auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RLS enforces user can only see their own profile
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user?.id);
}
```

### Mistake 3: Not Validating Environment Variables

```typescript
// ❌ WRONG: Silent failure
const apiKey = process.env.SENDGRID_API_KEY;
await sendEmail(apiKey); // Undefined, fails silently

// ✅ CORRECT: Fail fast with clear error
if (!process.env.SENDGRID_API_KEY) {
  throw new Error(
    "SENDGRID_API_KEY is not configured. " +
      "Add it to .env.local and restart server.",
  );
}
```

---

## Testing Configuration

### Verify Environment Loading

```typescript
// app/api/test/env/route.ts
export async function GET() {
  return Response.json({
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasSendGrid: !!process.env.SENDGRID_API_KEY,

    // Never log actual values!
    urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20),
  });
}
```

### Test Admin Client (Server-Side)

```typescript
// app/api/test/admin/route.ts
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Test query
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("count")
      .limit(1);

    if (error) throw error;

    return Response.json({
      success: true,
      message: "Admin client works correctly",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
```

### Test Browser Client

```typescript
// app/test/page.tsx
'use client';
import { createBrowserClient } from '@/lib/supabase/client';

export default function TestPage() {
  const supabase = createBrowserClient();

  const testConnection = async () => {
    const { data, error } = await supabase.from('profiles').select('count');
    console.log('Connection test:', { data, error });
  };

  return <button onClick={testConnection}>Test Browser Client</button>;
}
```

---

## Quick Reference

### When to Use Each Client

| Scenario                     | Client                  | Key Used     | RLS Applied? |
| ---------------------------- | ----------------------- | ------------ | ------------ |
| User browsing website        | `createBrowserClient()` | Anon         | ✅ Yes       |
| Server Component (user data) | `createServerClient()`  | Anon + Auth  | ✅ Yes       |
| API route (admin operation)  | `createAdminClient()`   | Service Role | ❌ No        |
| Newsletter signup (no auth)  | `createAdminClient()`   | Service Role | ❌ No        |
| User profile update          | `createServerClient()`  | Anon + Auth  | ✅ Yes       |

### Environment Variable Checklist

- [ ] `.env.local` created with all required variables
- [ ] `SUPABASE_SERVICE_ROLE_KEY` has NO `NEXT_PUBLIC_` prefix
- [ ] `.env.local` added to `.gitignore`
- [ ] `.env.example` created as template (no actual secrets)
- [ ] Production secrets added to Vercel dashboard
- [ ] Different Supabase projects for dev/prod environments

### Security Checklist

- [ ] Service role key never exposed to browser
- [ ] Admin client includes browser detection check
- [ ] Environment variables validated at startup
- [ ] Error messages don't leak sensitive information
- [ ] RLS enabled on all user-facing tables (or admin client used correctly)
- [ ] Secrets never hardcoded in source files
- [ ] Secrets never logged to console

---

## Related Documentation

- [Supabase Official Secrets Guide](https://supabase.com/docs/guides/functions/secrets)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- Project: `SECURITY_PATTERNS.md` - Comprehensive security guide
- Project: `ARCHITECTURE.md` - Client architecture diagrams

---

**Last Updated**: 2025-10-29
**Project**: SSI Automations Newsletter Feature
