/**
 * BlogLayout Component
 *
 * This component renders the layout for individual blog posts.
 * It includes a header with navigation, author information, and date,
 * followed by the blog content and an optional featured image.
 *
 * @component
 * @param {Object} props - The component props
 * @param {BlogWithSlug} props.blog - The blog post data
 * @param {React.ReactNode} props.children - The blog post content
 * @returns {JSX.Element} The rendered blog layout
 */

"use client";

import { useRouter } from "next/navigation";
import { BlogWithSlug } from "@/lib/blog";
import { IconArrowLeft } from "@tabler/icons-react";
import { Container } from "./container";
import Image from "next/image";
import { Logo } from "./Logo";
import Link from "next/link";
import { format } from "date-fns";

export function BlogLayout({
  blog,
  children,
}: {
  blog: BlogWithSlug;
  children: React.ReactNode;
}) {
  return (
    <Container className="mt-16 lg:mt-32">
      {/* Header with back navigation, author info, and date */}
      <div className="flex justify-between items-center px-2 py-8">
        <Link href="/blog" className="flex space-x-2 items-center">
          <IconArrowLeft className="w-4 h-4 text-muted dark:text-muted-dark" />
          <span className="text-sm text-muted dark:text-muted-dark">Back</span>
        </Link>
        <div className="flex space-x-2 items-center">
          <div className="flex space-x-2 items-center ">
            <Image
              src={blog.author.src}
              alt={blog.author.name}
              width={20}
              height={20}
              className="rounded-full h-5 w-5"
            />
            <p className="text-sm font-normal text-muted dark:text-muted-dark">
              {blog.author.name}
            </p>
          </div>
          <div className="h-5 rounded-lg w-0.5 bg-neutral-200 dark:bg-neutral-700" />
          <time dateTime={blog.date} className="flex items-center text-base ">
            <span className="text-muted dark:text-muted-dark text-sm">
              {format(new Date(blog.date), "MMMM dd, yyyy")}
            </span>
          </time>
        </div>
      </div>

      {/* Featured image or logo placeholder */}
      <div className="max-w-4xl mx-auto">
        {blog.image ? (
          <Image
            src={blog.image}
            height="800"
            width="800"
            className="h-40 md:h-96 w-full aspect-square object-cover rounded-3xl"
            alt={blog.title}
          />
        ) : (
          <div className="h-40 md:h-96 w-full aspect-squace rounded-3xl shadow-derek dark:bg-neutral-900 flex items-center justify-center">
            <Logo />
          </div>
        )}
      </div>

      {/* Blog content */}
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <article className="pb-8">
            <header className="flex flex-col">
              <h1 className="mt-8 text-4xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200 sm:text-5xl ">
                {blog.title}
              </h1>
            </header>
            <div
              className="mt-8 prose prose-lg dark:prose-invert"
              data-mdx-content
            >
              {children}
            </div>
          </article>
        </div>
      </div>
    </Container>
  );
}
