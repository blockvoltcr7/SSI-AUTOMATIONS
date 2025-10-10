# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SSI Automations is a Next.js 14 marketing website for AI solutions and automation services for small businesses. The site features a blog system, contact forms, newsletter signup, and various marketing pages.

**Tech Stack:**
- Next.js 14.2.15 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS
- MDX for blog content
- SendGrid for email
- Framer Motion for animations

## Development Commands

### Daily Development
```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

Tests are located in `tests/` directory and use Jest with React Testing Library. Test files should match pattern `*.test.ts` or `*.test.tsx`.

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
- `components/background.tsx` - Animated gradient background

### Blog System

Blog posts are MDX files stored in `content/blog/` with frontmatter metadata:

```typescript
// lib/blog.ts provides utilities:
getAllBlogSlugs()           // Get all post slugs
getBlogBySlug(slug)         // Get single post with metadata
getAllBlogs()               // Get all posts sorted by date
getFeaturedBlogs(limit)     // Get n most recent posts
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

### State Management

**Theme Provider:**
- Located in `context/theme-provider.tsx`
- Wraps app in root layout
- Provides dark/light/system theme switching

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
SENDGRID_API_KEY=         # SendGrid email service
ADMIN_EMAIL_ADDRESS=      # Where contact forms are sent
FROM_EMAIL_ADDRESS=       # SendGrid verified sender
NODE_ENV=production       # Enables Meta verification tag
```

## Meta/Facebook Integration

- Meta Business Suite domain verification configured in `app/layout.tsx`
- Verification tag only appears in production environment
- Used for Facebook Pixel and business features

## Path Aliases

TypeScript configured with `@/*` alias mapping to root directory:
```typescript
import { Component } from "@/components/component"
import { utils } from "@/lib/utils"
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

Current branch: `update-home-page-text-animation`
Main branch: `main`

When creating PRs, target `main` branch.

## Performance Considerations

- View transitions enabled via `next-view-transitions`
- Blog posts sorted once on build, not per-request
- Rate limiting prevents API abuse
- MDX compiled at build time
- Static pages generated where possible

## Common Patterns

**Conditional Rendering:**
```typescript
const isProduction = process.env.NODE_ENV === 'production'
```

**Blog Queries:**
```typescript
// Homepage
const featuredBlogs = getFeaturedBlogs(3)

// Blog listing page
const allBlogs = getAllBlogs()
```

**Styling Pattern:**
```typescript
import { cn } from "@/lib/utils"

<div className={cn("base-classes", conditionalClass && "additional")} />
```
