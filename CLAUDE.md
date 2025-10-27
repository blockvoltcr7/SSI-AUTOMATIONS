# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SSI Automations is a Next.js 16 marketing website for AI learning solutions and automation services for small businesses. The site features dual authentication (Supabase Email/OTP + Solana Web3), blog system, contact forms, newsletter signup, and protected routes.

**Tech Stack:**

- Next.js 16.0.0 (App Router with Turbopack)
- React 19.2.0
- TypeScript 5
- Tailwind CSS (forced dark theme)
- Supabase (Authentication & Database)
  - Email/OTP authentication
  - Solana Web3 wallet authentication
- MDX for blog content
- SendGrid for email
- Framer Motion for animations
- next-themes (forced dark mode)

## Development Commands

### Daily Development

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
npm run clear-cache  # Clear Next.js cache and build artifacts
```

### Testing

```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
npm run otp            # Test Supabase OTP authentication (interactive)
```

Tests are located in `tests/` directory and use Jest with React Testing Library. Test files should match pattern `*.test.ts` or `*.test.tsx`.

### Git Hooks

Husky is configured with a pre-commit hook that runs:

1. `clear-cache` - Clears Next.js build cache
2. `build` - Builds the project
3. `lint` - Runs ESLint
4. `format` - Formats code with Prettier
5. `type-check` - Runs TypeScript type checking

Pre-commit hook located at `.husky/pre-commit`.

## Next.js 16 Proxy & Authentication

### Proxy (Replaces Middleware)

**IMPORTANT**: Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`

**Current Implementation**:

```typescript
// proxy.ts (root directory)
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

The proxy runs on **every request** and:
1. Reads authentication cookies
2. Validates tokens with Supabase
3. Automatically refreshes expired tokens
4. Redirects unauthenticated users from protected routes
5. Updates cookies with fresh tokens

### Authentication Architecture

**Two-Layer Protection**:

1. **Proxy Layer** (`proxy.ts` → `lib/supabase/middleware.ts`):
   - Runs on every request at the edge
   - Validates authentication
   - Handles token refresh
   - Enforces route protection

2. **Page Layer** (Server Components):
   - Additional auth check in component
   - Retrieves user data
   - Handles role-based access
   - Provides user context

### Supported Authentication Methods

#### 1. Supabase Email/OTP
```typescript
// User structure
user = {
  id: "uuid",
  email: "user@example.com",
  app_metadata: { provider: "email" }
}
```

#### 2. Solana Web3 Wallet
```typescript
// User structure
user = {
  id: "uuid",
  email: null,
  app_metadata: { provider: "web3" },
  user_metadata: {
    custom_claims: {
      address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      chain: "solana",
      domain: "yourdomain.com",
      statement: "Sign in with Solana"
    }
  }
}
```

### Route Protection

**Public Routes** (defined in `lib/supabase/middleware.ts`):
```typescript
const publicRoutes = [
  "/", "/login", "/otp", "/about", "/blog", "/contact",
  "/pricing", "/learn", "/newsletter", "/privacy", "/terms"
];
```

**Protected Routes**: All routes NOT in `publicRoutes` require authentication

**Adding a Protected Page**:
```typescript
// app/premium/page.tsx
export default async function PremiumPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check auth provider
  const isWeb3 = user.app_metadata?.provider === "web3";
  const wallet = user.user_metadata?.custom_claims?.address;

  return <div>Protected Content</div>;
}
```

**Making a Route Public**:
Add it to the `publicRoutes` array in `lib/supabase/middleware.ts`

### Role-Based Access Control

```typescript
export default async function AdminPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const isAdmin = user.app_metadata?.role === "admin";
  if (!isAdmin) redirect("/dashboard");

  return <div>Admin Dashboard</div>;
}
```

## Architecture & Code Organization

### App Router Structure

Uses Next.js App Router with route groups for organization:

```
app/
├── (marketing)/          # Public marketing pages (shared layout)
│   ├── page.tsx         # Homepage
│   ├── about/
│   ├── blog/
│   │   ├── page.tsx    # Blog listing
│   │   └── [slug]/     # Dynamic blog post pages
│   ├── contact/
│   ├── pricing/
│   ├── newsletter/
│   └── ...
├── (auth)/              # Authentication pages (shared layout)
│   ├── login/
│   └── signup/
├── api/                 # API routes
│   └── contact/
│       └── route.ts    # Contact form handler
├── layout.tsx          # Root layout
└── globals.css         # Global styles
```

Route groups `(marketing)` and `(auth)` organize pages with shared layouts without affecting URL structure.

### Component Architecture

**Component Types:**

- **UI Components** (`components/ui/`) - Reusable primitives
- **Feature Components** (`components/`) - Business logic components
- **Layout Components** - `navbar/`, `footer.tsx`, `container.tsx`

**Key Components:**

- `components/navbar/` - Split into desktop/mobile variants
- `components/blog-section.tsx` - Homepage blog preview
- `components/newsletter-section.tsx` - Newsletter signup
- `components/contact.tsx` - Contact form with validation
- `components/background.tsx` - Solid black background (animations removed)
- `app/dashboard/` - Protected dashboard showing user auth info

### Blog System

Blog posts are MDX files stored in `content/blog/` with frontmatter metadata:

```typescript
// lib/blog.ts provides utilities:
getAllBlogSlugs(); // Get all post slugs
getBlogBySlug(slug); // Get single post with metadata
getAllBlogs(); // Get all posts sorted by date
getFeaturedBlogs(limit); // Get n most recent posts
```

**Blog Post Structure:**

```yaml
---
title: "Post Title"
summary: "Brief description"
date: "2024-01-01"
author: "Author Name"
authorImage: "/path/to/image.jpg"
thumbnail: "/path/to/thumbnail.jpg"
category: "Category Name"
tags: ["tag1", "tag2"]
---
# Blog content in MDX
```

Blog posts are rendered with syntax highlighting via Prism and support GitHub-flavored markdown via `remark-gfm`.

### API Routes

**Contact Form API** (`app/api/contact/route.ts`):

- Rate limited (3 requests/minute via LRU cache)
- Sends emails via SendGrid
- Requires env vars: `SENDGRID_API_KEY`, `ADMIN_EMAIL_ADDRESS`, `FROM_EMAIL_ADDRESS`
- Handles consent tracking for GDPR compliance

### Styling System

**Tailwind Configuration:**

- Custom theme in `tailwind.config.ts`
- Dark mode support via `next-themes`
- Typography plugin for blog content (`@tailwindcss/typography`)
- Utility function: `lib/utils.ts` exports `cn()` for className merging

**Fonts:**

- Uses Geist Sans via `geist/font/sans`
- Configured in root layout with `antialiased` class

### Supabase Integration

**Client Utilities** (`lib/supabase/`):

Supabase client utilities are organized for different execution contexts:

- `lib/supabase/client.ts` - Browser client using `@supabase/ssr` (use in Client Components)
- `lib/supabase/server.ts` - Server client with cookie handling (use in Server Components, Server Actions, Route Handlers)
- `lib/supabase/cookies.ts` - Cookie utilities for server-side operations
- `lib/supabase/types.ts` - TypeScript types for database schema (generate with Supabase CLI)
- `lib/supabase/index.ts` - Convenience exports

**Usage Pattern:**

```typescript
// Client Component
import { createBrowserClient } from "@/lib/supabase";
const supabase = createBrowserClient();

// Server Component / Server Action
import { createServerClient } from "@/lib/supabase";
const supabase = createServerClient();
```

**Authentication:**

- OTP-based email authentication configured
- Auth pages in `app/(auth)/login` and `app/(auth)/signup`
- Test OTP flow with `npm run otp` script

**Environment Variables:**

```bash
NEXT_PUBLIC_SUPABASE_URL=          # Supabase project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=  # Supabase anon/public key
```

**Generating TypeScript Types:**

When your database schema changes, regenerate types with:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > lib/supabase/types.ts
```

### State Management

**Theme Provider:**

- Located in `context/theme-provider.tsx`
- Wraps app in root layout
- **FORCED dark theme** (no toggle, system theme disabled)
- `<html className="dark">` + `forcedTheme="dark"` in ThemeProvider
- Prevents theme flash and ensures consistent dark UI

**Why Forced Dark Theme:**
- Eliminates light mode flash during initial load
- Prevents navbar/footer theme inconsistencies
- Simplifies theme management
- Better performance (no theme detection needed)

### Image Handling

Remote images configured in `next.config.mjs`:

- `i.pravatar.cc` - Avatar placeholders
- `images.unsplash.com` - Stock imagery

Use Next.js `<Image>` component for all images.

## Common Development Tasks

### Adding a New Blog Post

1. Create MDX file in `content/blog/your-post-slug.mdx`
2. Add frontmatter with required fields (title, date, author, etc.)
3. Write content using MDX (supports JSX in markdown)
4. Post automatically appears on blog page and homepage (if recent)

### Creating a New Marketing Page

1. Create folder in `app/(marketing)/page-name/`
2. Add `page.tsx` with page component
3. Page inherits layout from `app/(marketing)/layout.tsx`
4. Add navigation link in `components/navbar/` if needed

### Adding API Routes

1. Create folder in `app/api/route-name/`
2. Add `route.ts` with HTTP method handlers (GET, POST, etc.)
3. Use `NextResponse` for responses
4. Consider adding rate limiting for public endpoints

### Modifying Forms

Forms use `react-hook-form` with `zod` validation:

- Define schema with Zod
- Use `@hookform/resolvers/zod` for integration
- See `components/contact.tsx` for reference implementation

## Environment Variables

Required for production:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=                  # Supabase project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=      # Supabase anon/public key

# Email
SENDGRID_API_KEY=                          # SendGrid email service
ADMIN_EMAIL_ADDRESS=                       # Where contact forms are sent
FROM_EMAIL_ADDRESS=                        # SendGrid verified sender

# Environment
NODE_ENV=production                        # Enables Meta verification tag
```

## Meta/Facebook Integration

- Meta Business Suite domain verification configured in `app/layout.tsx`
- Verification tag only appears in production environment
- Used for Facebook Pixel and business features

## Path Aliases

TypeScript configured with `@/*` alias mapping to root directory:

```typescript
import { Component } from "@/components/component";
import { utils } from "@/lib/utils";
```

## MDX Configuration

MDX support configured in `next.config.mjs`:

- `remarkPlugins`: `remark-gfm` for GitHub-flavored markdown
- `rehypePlugins`: `rehype-prism` for code syntax highlighting
- Supports `.md` and `.mdx` extensions

Syntax highlighting styles in `app/prism.css`.

## Testing Strategy

**Coverage Requirements:**

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

**Test Exclusions:**

- Type definitions (`.d.ts`)
- Private files (`_*.{js,jsx,ts,tsx}`)
- API routes
- Layout/page files (test business logic separately)

## Git Workflow

Main branch: `main`

When creating PRs, target `main` branch.

Pre-commit hooks automatically run build, lint, format, and type-check before commits.

## Performance Considerations

- View transitions enabled via `next-view-transitions`
- Blog posts sorted once on build, not per-request
- Rate limiting prevents API abuse
- MDX compiled at build time
- Static pages generated where possible

## Common Patterns

**Conditional Rendering:**

```typescript
const isProduction = process.env.NODE_ENV === "production";
```

**Blog Queries:**

```typescript
// Homepage
const featuredBlogs = getFeaturedBlogs(3);

// Blog listing page
const allBlogs = getAllBlogs();
```

**Styling Pattern:**

```typescript
import { cn } from "@/lib/utils"

<div className={cn("base-classes", conditionalClass && "additional")} />
```

## Next.js 16 Upgrade Notes

### What Changed

**✅ Completed**:
- Upgraded from Next.js 14.2.15 → 16.0.0
- React 18 → 19.2.0
- `middleware.ts` → `proxy.ts` migration
- Enabled Turbopack for faster builds
- Forced dark theme for consistency

**Current Configuration**:
```javascript
// next.config.mjs
{
  // cacheComponents disabled due to next-themes conflict
  output: 'standalone',
  // Turbopack enabled by default
}
```

### Trade-offs Made

**1. cacheComponents Disabled**
- **Why**: Conflicts with next-themes ThemeProvider cookie access
- **Impact**: Can't use "use cache" directive
- **Future**: Re-enable when next-themes is updated
- **Status**: All "use cache" directives commented out

**2. Forced Dark Theme**
- **Why**: Prevents theme flash and inconsistencies
- **Impact**: No light mode or system theme detection
- **Benefit**: Better performance, consistent UX
- **Status**: Permanent (by design)

### Known Issues

1. **Lockfile Warning**: Multiple lockfiles detected - can be ignored
2. **ESLint Config**: Pre-commit hook may fail, use `--no-verify` if needed
3. **Dashboard Route**: Now fully dynamic (not prerendered)

### Breaking Changes from v14

- ~~`middleware.ts`~~ → `proxy.ts` (function name also changed)
- ~~`enableSystem`~~ → Forced dark theme instead
- ~~`cacheComponents`~~ → Disabled for compatibility

### Migration Guide Reference

See `.docs/nextjs16/` for detailed migration documentation:
- `middleware-to-proxy-migration.md` - Proxy migration guide
- `use-cache-guide.md` - Cache directive usage
- `implementation-recommendations.md` - Best practices
