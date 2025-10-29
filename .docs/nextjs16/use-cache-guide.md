# Next.js 16 "use cache" Directive Guide

## Table of Contents

1. [Overview](#overview)
2. [What is "use cache"?](#what-is-use-cache)
3. [Configuration](#configuration)
4. [Usage Levels](#usage-levels)
5. [Cache Lifetime Control](#cache-lifetime-control)
6. [Cache Tagging & Revalidation](#cache-tagging--revalidation)
7. [Blog-Specific Examples](#blog-specific-examples)
8. [Best Practices](#best-practices)
9. [Migration Guide](#migration-guide)
10. [Advanced Patterns](#advanced-patterns)

---

## Overview

Next.js 16 introduces the **"use cache"** directive, a revolutionary approach to caching that makes it **explicit and opt-in**, replacing the confusing implicit caching behavior from earlier versions.

**Key Features:**

- ✅ **Opt-in caching** - Nothing is cached unless you explicitly add "use cache"
- ✅ **Multiple levels** - Cache entire pages, components, or individual functions
- ✅ **Automatic cache keys** - Compiler generates keys based on inputs
- ✅ **Fine-grained control** - Different cache lifetimes for different parts of your app
- ✅ **Works with all Server I/O** - Not just fetch(), but databases, APIs, computations

---

## What is "use cache"?

The `"use cache"` directive is a compiler hint that tells Next.js to cache the output of a page, component, or function.

### The Problem It Solves

**Before Next.js 16 (Implicit Caching):**

```tsx
// This was automatically cached... maybe? 🤷
async function BlogPosts() {
  const posts = await fetch('/api/posts');
  return <div>{posts.map(...)}</div>;
}
```

**With Next.js 16 (Explicit Caching):**

```tsx
"use cache"; // ✅ Clearly indicates this is cached

async function BlogPosts() {
  const posts = await fetch('/api/posts');
  return <div>{posts.map(...)}</div>;
}
```

### How It Works

1. **First request:** Function executes, result is cached with an auto-generated key
2. **Subsequent requests:** Cached result is returned instantly (no execution)
3. **Cache expiration:** After the specified lifetime, cache is invalidated
4. **Revalidation:** Manual cache invalidation using tags

---

## Configuration

### Enable "use cache" in Next.js Config

```typescript
// next.config.ts (or next.config.mjs)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true, // ← Enable "use cache" directive
  },
};

export default nextConfig;
```

For `.mjs` config:

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cacheComponents: true,
  },
};

export default nextConfig;
```

---

## Usage Levels

The `"use cache"` directive can be used at three different levels:

### 1. File-Level Caching

Cache **everything** exported from a file.

```tsx
// app/blog/page.tsx
"use cache";

import { getAllBlogs } from "@/lib/blog";

export default async function BlogPage() {
  const blogs = await getAllBlogs();
  return (
    <div>
      {blogs.map((blog) => (
        <BlogCard key={blog.slug} blog={blog} />
      ))}
    </div>
  );
}

// ✅ Entire page output is cached
```

**When to use:**

- Static pages that change infrequently
- Blog listing pages
- Marketing pages
- Documentation pages

### 2. Component-Level Caching

Cache **specific components** within a page.

```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      {/* Not cached - shows real-time data */}
      <UserGreeting />

      {/* Cached - stats change hourly */}
      <CachedStats />

      {/* Not cached - shows current notifications */}
      <Notifications />
    </div>
  );
}

// Separate file: components/cached-stats.tsx
("use cache");

async function CachedStats() {
  const stats = await fetchStats();
  return <div>{stats}</div>;
}
```

**When to use:**

- Mixed dynamic/static pages
- Expensive computations
- Third-party API calls with rate limits
- User-specific content that changes infrequently

### 3. Function-Level Caching

Cache **utility functions** used across multiple pages.

```tsx
// lib/blog.ts
"use cache";

export async function getAllBlogs() {
  const files = fs.readdirSync("./content/blog");
  const blogs = files.map((file) => parseBlogFile(file));
  return blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Used in multiple pages
// app/blog/page.tsx
const blogs = await getAllBlogs();

// app/page.tsx
const featuredBlogs = (await getAllBlogs()).slice(0, 3);
```

**When to use:**

- Shared data fetching functions
- Expensive computations used in multiple places
- Database queries
- External API calls

---

## Cache Lifetime Control

Control how long data stays cached using `cacheLife()`.

### Available Profiles

```typescript
import { cacheLife } from "next/cache";

// Predefined profiles:
cacheLife("seconds"); // Cache for 1 second
cacheLife("minutes"); // Cache for 5 minutes (default)
cacheLife("hours"); // Cache for 1 hour
cacheLife("days"); // Cache for 1 day
cacheLife("weeks"); // Cache for 1 week
cacheLife("max"); // Cache indefinitely
```

### Usage Examples

**Page-Level Cache Lifetime:**

```tsx
// app/blog/page.tsx
"use cache";

import { cacheLife } from 'next/cache';

export default async function BlogPage() {
  cacheLife('hours'); // ← Cache for 1 hour

  const blogs = await getAllBlogs();
  return <div>{blogs.map(...)}</div>;
}
```

**Component-Level Cache Lifetime:**

```tsx
"use cache";

import { cacheLife } from 'next/cache';

async function FeaturedPosts() {
  cacheLife('days'); // ← Cache for 1 day

  const posts = await fetchFeaturedPosts();
  return <div>{posts.map(...)}</div>;
}
```

**Function-Level Cache Lifetime:**

```tsx
"use cache";

import { cacheLife } from "next/cache";

export async function getRecommendations(userId: string) {
  cacheLife("hours"); // ← Cache for 1 hour

  const prefs = await fetchUserPreferences(userId);
  const recs = await computeRecommendations(prefs);
  return recs;
}
```

### Custom Cache Lifetimes

Define custom profiles for specific needs:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
    cacheLife: {
      blog: {
        stale: 60, // 60 seconds
        revalidate: 3600, // 1 hour
        expire: 86400, // 1 day
      },
      userContent: {
        stale: 0,
        revalidate: 300, // 5 minutes
        expire: 3600, // 1 hour
      },
    },
  },
};
```

Usage:

```tsx
"use cache";

import { cacheLife } from "next/cache";

export default async function BlogPage() {
  cacheLife("blog"); // ← Use custom profile
  // ...
}
```

---

## Cache Tagging & Revalidation

Invalidate cached content on-demand using cache tags.

### Tagging Cached Content

```tsx
"use cache";

import { cacheTag } from "next/cache";

export async function getAllBlogs() {
  cacheTag("blog-posts"); // ← Tag this cached data

  const blogs = await fetchBlogs();
  return blogs;
}
```

### Revalidating Tagged Cache

**In Server Actions:**

```tsx
// app/actions.ts
"use server";

import { revalidateTag } from "next/cache";

export async function publishBlogPost(post: BlogPost) {
  await saveBlogPost(post);

  // Invalidate blog-posts cache
  revalidateTag("blog-posts");
}
```

**In API Routes:**

```tsx
// app/api/revalidate/route.ts
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const { tag } = await request.json();

  revalidateTag(tag);

  return Response.json({ revalidated: true, now: Date.now() });
}
```

### Multiple Tags

```tsx
"use cache";

import { cacheTag } from "next/cache";

export async function getBlogBySlug(slug: string) {
  cacheTag("blog-posts");
  cacheTag(`blog-${slug}`);

  const blog = await fetchBlog(slug);
  return blog;
}

// Revalidate specific post
revalidateTag("blog-my-post-slug");

// Revalidate all posts
revalidateTag("blog-posts");
```

---

## Blog-Specific Examples

### Example 1: Caching Blog Listing Page

```tsx
// app/blog/page.tsx
"use cache";

import { cacheLife } from "next/cache";
import { getAllBlogs } from "@/lib/blog";

export default async function BlogPage() {
  cacheLife("hours"); // Cache for 1 hour

  const blogs = await getAllBlogs();

  return (
    <div>
      <h1>Blog</h1>
      <div className="grid grid-cols-3 gap-4">
        {blogs.map((blog) => (
          <BlogCard key={blog.slug} blog={blog} />
        ))}
      </div>
    </div>
  );
}
```

**Result:** Page is cached for 1 hour. After 1 hour, next request regenerates the page.

### Example 2: Caching Individual Blog Posts

```tsx
// app/blog/[slug]/page.tsx
"use cache";

import { cacheLife } from "next/cache";
import { getBlogBySlug } from "@/lib/blog";

export default async function BlogPostPage({ params }) {
  cacheLife("weeks"); // Blog posts rarely change

  const blog = await getBlogBySlug(params.slug);

  return (
    <article>
      <h1>{blog.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>
  );
}
```

**Result:** Each blog post is cached for 1 week.

### Example 3: Caching Blog Utility Functions

```tsx
// lib/blog.ts
"use cache";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cacheLife, cacheTag } from "next/cache";

export async function getAllBlogs() {
  cacheLife("hours");
  cacheTag("blog-posts");

  const files = fs.readdirSync(path.join(process.cwd(), "content/blog"));
  const blogs = files.map((file) => {
    const content = fs.readFileSync(
      path.join(process.cwd(), "content/blog", file),
      "utf8",
    );
    const { data } = matter(content);
    return data;
  });

  return blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getBlogBySlug(slug: string) {
  cacheLife("weeks");
  cacheTag("blog-posts");
  cacheTag(`blog-${slug}`);

  const content = fs.readFileSync(
    path.join(process.cwd(), "content/blog", `${slug}.mdx`),
    "utf8",
  );
  const { data, content: markdown } = matter(content);

  return { ...data, content: markdown, slug };
}

export async function getFeaturedBlogs(limit: number = 3) {
  cacheLife("hours");
  cacheTag("blog-posts");

  const allBlogs = await getAllBlogs();
  return allBlogs.slice(0, limit);
}
```

**Result:** All blog functions are cached with tags for easy invalidation.

### Example 4: Homepage with Featured Blogs

```tsx
// app/page.tsx
import { getFeaturedBlogs } from "@/lib/blog";

export default async function HomePage() {
  // This is cached because getFeaturedBlogs has "use cache"
  const featuredBlogs = await getFeaturedBlogs(3);

  return (
    <div>
      <Hero />
      <FeaturedBlogsSection blogs={featuredBlogs} />
    </div>
  );
}
```

**Result:** Featured blogs are cached (via `getFeaturedBlogs` function cache).

---

## Best Practices

### ✅ DO: Cache Static or Slowly-Changing Content

```tsx
// Good: Blog posts change infrequently
"use cache";

export async function getAllBlogs() {
  cacheLife("hours");
  // ...
}
```

### ✅ DO: Use Appropriate Cache Lifetimes

```tsx
// Static content - cache for weeks
"use cache";
export async function getAboutPage() {
  cacheLife("weeks");
  // ...
}

// Dynamic content - cache for minutes
("use cache");
export async function getUserStats() {
  cacheLife("minutes");
  // ...
}
```

### ✅ DO: Tag Cached Content for Easy Invalidation

```tsx
"use cache";

import { cacheTag } from "next/cache";

export async function getAllBlogs() {
  cacheTag("blog-posts"); // ← Easy to invalidate later
  // ...
}
```

### ✅ DO: Cache Expensive Computations

```tsx
"use cache";

export async function analyzeUserBehavior(userId: string) {
  cacheLife("hours");

  // Expensive computation
  const data = await fetchLargeDataset(userId);
  const analysis = performComplexAnalysis(data);

  return analysis;
}
```

### ❌ DON'T: Cache User-Specific Real-Time Data

```tsx
// Bad: Current user session shouldn't be cached
"use cache";

export async function getCurrentUser() {
  const user = await getSession();
  return user; // ❌ Will serve stale user data
}
```

### ❌ DON'T: Cache Highly Dynamic Data

```tsx
// Bad: Live data shouldn't be cached
"use cache";

export async function getLiveStockPrices() {
  const prices = await fetchStockPrices();
  return prices; // ❌ Prices change every second
}
```

### ❌ DON'T: Over-Cache Everything

```tsx
// Bad: Unnecessary caching
"use cache";

export function getStaticConfig() {
  return { apiUrl: "https://api.example.com" }; // ❌ Already static
}
```

---

## Migration Guide

### From Next.js 14/15 (Implicit Caching)

**Before (Next.js 14/15):**

```tsx
// Automatically cached (confusing!)
export async function BlogPage() {
  const blogs = await fetch('/api/blogs');
  return <div>{blogs.map(...)}</div>;
}
```

**After (Next.js 16):**

```tsx
// Explicitly cached (clear!)
"use cache";

export async function BlogPage() {
  const blogs = await fetch('/api/blogs');
  return <div>{blogs.map(...)}</div>;
}
```

### Replacing `revalidate`

**Before:**

```tsx
export const revalidate = 3600; // Revalidate every hour

export async function BlogPage() {
  // ...
}
```

**After:**

```tsx
"use cache";

import { cacheLife } from "next/cache";

export async function BlogPage() {
  cacheLife("hours"); // Cache for 1 hour
  // ...
}
```

### Replacing `fetch()` Cache Options

**Before:**

```tsx
const data = await fetch("/api/data", {
  next: { revalidate: 3600 },
});
```

**After:**

```tsx
"use cache";

async function getData() {
  cacheLife("hours");
  const data = await fetch("/api/data");
  return data;
}
```

---

## Advanced Patterns

### Pattern 1: Conditional Caching

```tsx
"use cache";

import { cacheLife } from "next/cache";

export async function getContent(isDynamic: boolean) {
  if (isDynamic) {
    cacheLife("minutes"); // Short cache for dynamic
  } else {
    cacheLife("weeks"); // Long cache for static
  }

  const content = await fetchContent();
  return content;
}
```

### Pattern 2: Cascade Caching

```tsx
"use cache";

// Function 1: Cache user data
export async function getUser(id: string) {
  cacheLife("hours");
  cacheTag(`user-${id}`);

  return await fetchUser(id);
}

// Function 2: Cache user posts (depends on user)
export async function getUserPosts(userId: string) {
  cacheLife("hours");
  cacheTag(`posts-${userId}`);

  const user = await getUser(userId); // Uses cached user
  const posts = await fetchPosts(user.id);
  return posts;
}
```

### Pattern 3: Cache Warming

```tsx
// Warm cache on build
export async function generateStaticParams() {
  const blogs = await getAllBlogs(); // ← Warms cache

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}
```

### Pattern 4: Per-User Caching

```tsx
"use cache";

import { cacheLife } from "next/cache";

export async function getUserDashboard(userId: string) {
  cacheLife("minutes");
  cacheTag(`dashboard-${userId}`);

  const data = await fetchDashboardData(userId);
  return data;
}

// Invalidate specific user's cache
revalidateTag(`dashboard-${userId}`);
```

---

## Comparison: "use cache" vs. Suspense

| Feature                 | "use cache"                            | Suspense                       |
| ----------------------- | -------------------------------------- | ------------------------------ |
| **Purpose**             | Cache computed results                 | Stream UI progressively        |
| **When to use**         | Expensive computations, slow APIs      | Long-running data fetches      |
| **Performance benefit** | Skip re-execution on repeated requests | Show content faster (TTFB/FCP) |
| **User experience**     | Faster page loads                      | Progressive rendering          |
| **Use together?**       | ✅ Yes! Complementary features         | ✅ Yes! Use both for best UX   |

**Example: Using Both Together**

```tsx
// Cached function
"use cache";
export async function getAllBlogs() {
  cacheLife('hours');
  const blogs = await fetchBlogs(); // Slow operation
  return blogs;
}

// Streamed component
import { Suspense } from 'react';

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogList />
    </Suspense>
  );
}

async function BlogList() {
  const blogs = await getAllBlogs(); // ← Cached!
  return <div>{blogs.map(...)}</div>;
}
```

**Result:**

- First request: Slow (fetches + caches)
- Subsequent requests: Fast (reads from cache)
- All requests: Progressive rendering via Suspense

---

## Debugging Cache Behavior

### Check if Content is Cached

```tsx
"use cache";

import { cacheLife } from "next/cache";

export async function getBlogs() {
  cacheLife("hours");

  console.log("[CACHE] Fetching blogs...", new Date().toISOString());

  const blogs = await fetchBlogs();
  return blogs;
}
```

**In logs:**

- First request: `[CACHE] Fetching blogs... 2025-10-26T12:00:00.000Z`
- Second request: (no log - served from cache)
- After 1 hour: `[CACHE] Fetching blogs... 2025-10-26T13:00:05.000Z`

### View Cache Status in DevTools

Next.js 16 includes cache headers in development:

```
X-Next-Cache: HIT   ← Served from cache
X-Next-Cache: MISS  ← Executed fresh
```

---

## Next Steps

- Read the [Suspense Guide](./suspense-guide.md) to learn about streaming
- Check [Implementation Recommendations](./implementation-recommendations.md) for this project
- Review [Next.js Caching Documentation](https://nextjs.org/docs/app/guides/caching)

---

**Last Updated:** October 2025
**Next.js Version:** 16.0.0
**Feature Status:** Experimental (requires `cacheComponents: true`)
