"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GridPatternContainer } from "./grid-pattern";
import { BlurImage } from "./blur-image";
import type { BlogWithSlug } from "@/lib/blog";

interface BlogSectionProps {
  blogs: BlogWithSlug[];
}

export function BlogSection({ blogs }: BlogSectionProps) {
  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <div className="py-4 md:py-10 overflow-hidden relative px-4 md:px-8">
        <GridPatternContainer className="opacity-50" />
        <div className="relative z-20 py-10">
          <h1
            className={cn(
              "scroll-m-20 text-4xl font-bold text-center md:text-left tracking-tight text-black dark:text-white mb-6"
            )}
          >
            Latest from the Blog
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl !mb-6 text-center md:text-left">
            Discover insights, guides, and reviews about AI learning platforms
            and resources.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between pb-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full relative z-20">
          {blogs.map((blog, index) => (
            <BlogCard blog={blog} key={blog.slug + index} />
          ))}
        </div>

        {/* View All Blogs Link */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neutral-800 hover:border-neutral-600 bg-neutral-900/50 backdrop-blur transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg text-neutral-300 hover:text-white"
          >
            <span>View All Posts</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const BlogCard = ({ blog }: { blog: BlogWithSlug }) => {
  const truncate = (text: string, length: number) => {
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <Link
      className="shadow-derek rounded-3xl border dark:border-neutral-800 w-full bg-white dark:bg-neutral-900 overflow-hidden hover:scale-[1.02] transition duration-200"
      href={`/blog/${blog.slug}`}
    >
      {blog.thumbnail ? (
        <BlurImage
          src={blog.thumbnail}
          alt={blog.title}
          height={800}
          width={800}
          className="h-52 object-cover object-top w-full"
        />
      ) : (
        <div className="h-52 flex items-center justify-center bg-neutral-800">
          <span className="text-neutral-400 text-sm">No image</span>
        </div>
      )}
      <div className="p-4 md:p-8 bg-white dark:bg-neutral-900">
        <div className="flex space-x-2 items-center mb-2">
          <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-[8px] font-semibold text-white">
              {blog.author
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
          <p className="text-sm font-normal text-neutral-600 dark:text-neutral-400">
            {blog.author}
          </p>
        </div>

        {blog.category && (
          <span className="inline-block px-2 py-1 text-xs font-medium text-blue-400 bg-blue-500/10 rounded-md mb-3">
            {blog.category}
          </span>
        )}

        <p className="text-lg font-bold mb-4 text-neutral-800 dark:text-neutral-100">
          {blog.title}
        </p>
        {blog.summary && (
          <p className="text-left text-sm mt-2 text-neutral-600 dark:text-neutral-400">
            {truncate(blog.summary, 100)}
          </p>
        )}
      </div>
    </Link>
  );
};