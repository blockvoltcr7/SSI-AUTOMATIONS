# Next.js 16 Suspense & Streaming Guide

## Table of Contents

1. [Overview](#overview)
2. [What is Suspense?](#what-is-suspense)
3. [What is Streaming?](#what-is-streaming)
4. [How It Works in Next.js 16](#how-it-works-in-nextjs-16)
5. [Performance Benefits](#performance-benefits)
6. [Implementation Patterns](#implementation-patterns)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)
9. [Gotchas & Troubleshooting](#gotchas--troubleshooting)

---

## Overview

Next.js 16 with React 19 provides first-class support for **Suspense** and **Streaming**, allowing you to progressively render and stream UI to the browser. This means users see content faster, even while data is still being fetched.

**Key Features:**
- ✅ Streaming is **enabled by default** in the App Router
- ✅ Suspense is **fully stable** in React 19 (no longer experimental)
- ✅ Works seamlessly with Server Components
- ✅ Supports both route-level and component-level loading states

---

## What is Suspense?

**Suspense** is a React feature that lets you display a fallback UI while a component is loading its data or code.

### Basic Concept

```tsx
import { Suspense } from 'react';

<Suspense fallback={<LoadingSpinner />}>
  <AsyncComponent />
</Suspense>
```

When `<AsyncComponent>` is loading (fetching data, lazy-loading code, etc.), React shows the `fallback` UI. Once ready, it swaps in the actual component.

### Why Use Suspense?

**Without Suspense:**
```
[Loading...................................] → [Full Page Appears]
User waits for everything before seeing anything
```

**With Suspense:**
```
[Header] → [Sidebar] → [Main Content] → [Comments]
User sees content progressively as it loads
```

---

## What is Streaming?

**Streaming** is the process of progressively sending HTML from the server to the client, so parts of the page can render before others are ready.

### How Streaming Works

1. **Server starts rendering** the React tree
2. **Server immediately sends** HTML for ready components
3. **Client displays** HTML as it arrives
4. **Server continues** rendering slower components
5. **Client hydrates** components as they arrive

### Visual Example

```
Time →
─────────────────────────────────────────────────
Server: [Header] ─→ [Nav] ─→ [Blog Posts...] ─→ [Comments...]
Client: [Header] ─→ [Nav] ─→ [Skeleton]      ─→ [Blog Posts] ─→ [Comments]
```

---

## How It Works in Next.js 16

Next.js 16 enables streaming by default in the App Router. You have two primary ways to implement loading states:

### 1. Route-Level Loading with `loading.tsx`

Create a `loading.tsx` file alongside your `page.tsx`:

```
app/
├── blog/
│   ├── page.tsx      ← Your blog page
│   └── loading.tsx   ← Shown while page.tsx loads
```

**Example: `app/blog/loading.tsx`**

```tsx
export default function Loading() {
  return (
    <div className="p-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 2. Component-Level Loading with `<Suspense>`

Wrap specific components with Suspense boundaries for granular control:

**Example: Streaming Blog Posts**

```tsx
import { Suspense } from 'react';

export default function BlogPage() {
  return (
    <div>
      <h1>Blog</h1>

      {/* This renders immediately */}
      <BlogHeader />

      {/* This streams in when ready */}
      <Suspense fallback={<BlogListSkeleton />}>
        <BlogList />
      </Suspense>

      {/* This streams in independently */}
      <Suspense fallback={<CommentsSkeleton />}>
        <RecentComments />
      </Suspense>
    </div>
  );
}
```

### Combining Both Approaches

You can use both `loading.tsx` AND component-level Suspense:

```tsx
// app/blog/page.tsx
import { Suspense } from 'react';

export default function BlogPage() {
  return (
    <>
      {/* Featured posts load first */}
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedPosts />
      </Suspense>

      {/* All posts load separately */}
      <Suspense fallback={<BlogGridSkeleton />}>
        <AllBlogPosts />
      </Suspense>
    </>
  );
}

// app/blog/loading.tsx
export default function Loading() {
  // Shown while entire page loads
  return <PageSkeleton />;
}
```

---

## Performance Benefits

### 1. **Faster Time to First Byte (TTFB)**

The server can start sending HTML immediately, without waiting for all data to load.

```
Without Streaming: 800ms TTFB
With Streaming:    120ms TTFB (85% faster!)
```

### 2. **Improved First Contentful Paint (FCP)**

Users see content faster because the browser receives HTML progressively.

```
Without Streaming: 1200ms FCP
With Streaming:    400ms FCP (66% faster!)
```

### 3. **Better Time to Interactive (TTI)**

Components hydrate progressively, so the page becomes interactive sooner.

### 4. **Reduced Perceived Loading Time**

Users see **something** immediately, making the app feel faster even if total load time is the same.

---

## Implementation Patterns

### Pattern 1: Fast Header, Slow Content

```tsx
export default function Page() {
  return (
    <>
      {/* Renders immediately - no async data */}
      <Header />
      <Navigation />

      {/* Streams in when data arrives */}
      <Suspense fallback={<ContentSkeleton />}>
        <SlowDataContent />
      </Suspense>
    </>
  );
}

async function SlowDataContent() {
  const data = await fetchSlowData();
  return <div>{data}</div>;
}
```

### Pattern 2: Independent Loading Sections

```tsx
export default function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Each section loads independently */}
      <Suspense fallback={<SkeletonCard />}>
        <UserStats />
      </Suspense>

      <Suspense fallback={<SkeletonCard />}>
        <RecentActivity />
      </Suspense>

      <Suspense fallback={<SkeletonCard />}>
        <Analytics />
      </Suspense>
    </div>
  );
}
```

### Pattern 3: Nested Suspense

```tsx
export default function BlogPost() {
  return (
    <Suspense fallback={<PostSkeleton />}>
      <Post>
        {/* Post content loads first */}
        <PostContent />

        {/* Comments load separately */}
        <Suspense fallback={<CommentsSkeleton />}>
          <Comments />
        </Suspense>
      </Post>
    </Suspense>
  );
}
```

### Pattern 4: Parallel Data Fetching

```tsx
// These fetch in parallel and stream in as ready
export default function Page() {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <UserProfile userId="123" />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <UserPosts userId="123" />
      </Suspense>

      <Suspense fallback={<Skeleton />}>
        <UserFollowers userId="123" />
      </Suspense>
    </>
  );
}

// Each component fetches independently
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId);
  return <div>{user.name}</div>;
}

async function UserPosts({ userId }: { userId: string }) {
  const posts = await fetchPosts(userId);
  return <PostList posts={posts} />;
}
```

---

## Best Practices

### ✅ DO: Place Suspense Boundaries Strategically

```tsx
// Good: Separate boundaries for independent content
<Suspense fallback={<HeaderSkeleton />}>
  <Header />
</Suspense>
<Suspense fallback={<ContentSkeleton />}>
  <Content />
</Suspense>

// Bad: Single boundary for everything
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Content />
</Suspense>
```

### ✅ DO: Create Matching Skeleton UIs

Your fallback should match the layout of the actual component:

```tsx
// Good: Skeleton matches actual layout
function BlogCardSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      <div className="h-48 bg-gray-200 rounded mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

function BlogCard({ post }) {
  return (
    <div className="border rounded-lg p-4">
      <img src={post.image} className="h-48 rounded mb-4" />
      <h2 className="text-xl mb-2">{post.title}</h2>
      <p className="text-sm">{post.summary}</p>
    </div>
  );
}
```

### ✅ DO: Use loading.tsx for Route-Level Loading

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <BlogPageSkeleton />;
}
```

This automatically wraps your page in a Suspense boundary.

### ✅ DO: Fetch Data in Server Components

```tsx
// Server Component - can use async/await
async function BlogPosts() {
  const posts = await getPosts();
  return <PostList posts={posts} />;
}

// Wrap in Suspense
<Suspense fallback={<Skeleton />}>
  <BlogPosts />
</Suspense>
```

### ❌ DON'T: Wrap Client Components with Suspense for Data Fetching

```tsx
// Bad: Client component with useEffect
"use client";
function BlogPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);
  return <div>{posts.map(...)}</div>;
}

// Suspense won't work here - no async boundary!
<Suspense fallback={<Skeleton />}>
  <BlogPosts />
</Suspense>
```

Instead, fetch in a Server Component and pass data to the Client Component:

```tsx
// Good: Server Component fetches
async function BlogPostsContainer() {
  const posts = await getPosts();
  return <BlogPostsClient posts={posts} />;
}

// Client Component receives data
"use client";
function BlogPostsClient({ posts }) {
  return <div>{posts.map(...)}</div>;
}

// Suspense works!
<Suspense fallback={<Skeleton />}>
  <BlogPostsContainer />
</Suspense>
```

### ❌ DON'T: Over-Segment with Too Many Boundaries

```tsx
// Bad: Too granular
<Suspense fallback={<Skeleton />}>
  <BlogTitle />
</Suspense>
<Suspense fallback={<Skeleton />}>
  <BlogAuthor />
</Suspense>
<Suspense fallback={<Skeleton />}>
  <BlogDate />
</Suspense>

// Good: Logical grouping
<Suspense fallback={<BlogMetaSkeleton />}>
  <BlogMeta />
</Suspense>
```

---

## Common Patterns

### Pattern: Blog Listing Page

```tsx
// app/blog/page.tsx
import { Suspense } from 'react';
import { getAllBlogs } from '@/lib/blog';

export default function BlogPage() {
  return (
    <div>
      <h1>Blog</h1>
      <Suspense fallback={<BlogGridSkeleton />}>
        <BlogGrid />
      </Suspense>
    </div>
  );
}

async function BlogGrid() {
  const blogs = await getAllBlogs();
  return (
    <div className="grid grid-cols-3 gap-4">
      {blogs.map(blog => (
        <BlogCard key={blog.slug} blog={blog} />
      ))}
    </div>
  );
}

function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

### Pattern: Individual Blog Post

```tsx
// app/blog/[slug]/page.tsx
import { Suspense } from 'react';
import { getBlogBySlug } from '@/lib/blog';

export default async function BlogPostPage({ params }) {
  return (
    <div>
      <Suspense fallback={<PostSkeleton />}>
        <BlogPost slug={params.slug} />
      </Suspense>

      <Suspense fallback={<CommentsSkeleton />}>
        <Comments slug={params.slug} />
      </Suspense>
    </div>
  );
}

async function BlogPost({ slug }: { slug: string }) {
  const post = await getBlogBySlug(slug);
  return <article>{post.content}</article>;
}
```

### Pattern: Homepage with Featured Content

```tsx
// app/page.tsx
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <>
      <Hero />

      <Suspense fallback={<FeaturedBlogsSkeleton />}>
        <FeaturedBlogs />
      </Suspense>

      <Suspense fallback={<NewsletterSkeleton />}>
        <Newsletter />
      </Suspense>
    </>
  );
}
```

---

## Gotchas & Troubleshooting

### Issue 1: Suspense Boundary Not Working

**Problem:** Component wrapped in Suspense doesn't show fallback.

**Cause:** Component isn't actually async (no data fetching or lazy loading).

**Solution:** Make sure the component is async:

```tsx
// Won't work - not async
function BlogPosts() {
  const posts = staticPosts;
  return <div>{posts.map(...)}</div>;
}

// Will work - async component
async function BlogPosts() {
  const posts = await fetchPosts();
  return <div>{posts.map(...)}</div>;
}
```

### Issue 2: Client Component with useEffect

**Problem:** Suspense doesn't work with Client Components using `useEffect` for data fetching.

**Solution:** Move data fetching to a Server Component wrapper:

```tsx
// Server Component (async)
async function BlogPostsServer() {
  const posts = await fetchPosts();
  return <BlogPostsClient posts={posts} />;
}

// Client Component (receives data)
"use client";
function BlogPostsClient({ posts }) {
  return <div>{posts.map(...)}</div>;
}
```

### Issue 3: Flashing Loading State

**Problem:** Loading state flashes briefly, causing layout shift.

**Solution:** Match skeleton layout exactly to content layout.

```tsx
// Skeleton should have identical structure
function Skeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1,2,3].map(i => (
        <div key={i} className="h-64 bg-gray-200 rounded"></div>
      ))}
    </div>
  );
}

function Content() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {posts.map(post => (
        <div key={post.id} className="h-64 rounded">...</div>
      ))}
    </div>
  );
}
```

### Issue 4: Nested Suspense Not Streaming

**Problem:** Outer Suspense prevents inner Suspense from streaming.

**Solution:** Ensure outer component doesn't block:

```tsx
// Bad: Outer waits for everything
async function Outer() {
  const data = await fetchEverything(); // Blocks inner Suspense
  return (
    <div>
      <Suspense><Inner /></Suspense>
    </div>
  );
}

// Good: Outer doesn't block
function Outer() {
  return (
    <div>
      <Suspense><Inner /></Suspense>
    </div>
  );
}
```

### Issue 5: Loading State Never Appears

**Problem:** Content loads so fast the loading state is never shown.

**This is actually good!** It means your data is fast. Consider removing the Suspense boundary if loading is consistently instant.

---

## React 19 Improvements

React 19 brings several improvements to Suspense:

1. **Stable API** - No longer experimental
2. **Better Error Handling** - Error boundaries work better with Suspense
3. **Improved Hydration** - Progressive hydration is more reliable
4. **Activity Components** - New primitives for better loading states

---

## Next Steps

- Read the [Use Cache Guide](./use-cache-guide.md) to optimize data fetching
- Check [Implementation Recommendations](./implementation-recommendations.md) for specific guidance on this project
- Review the [Next.js Streaming Documentation](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)

---

**Last Updated:** October 2025
**Next.js Version:** 16.0.0
**React Version:** 19.2.0
