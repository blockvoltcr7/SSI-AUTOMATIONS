"use client";
import { format } from "date-fns";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { BlogWithSlug } from "@/lib/blog";
import { SummarizeWithAI } from "./summarize-with-ai";
import { TracingBeam } from "./ui/tracing-beam";

interface BlogContentCenteredProps {
  blog: BlogWithSlug;
}

export function BlogContentCentered({ blog }: BlogContentCenteredProps) {
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    // Use production URL with current path
    const pathname = window.location.pathname;
    setPageUrl(`https://www.ssiautomations.com${pathname}`);
  }, []);

  return (
    <TracingBeam className="px-6">
      <div className="mx-auto w-full max-w-3xl antialiased pt-4 relative">
        <Image
          src={blog.thumbnail}
          alt={blog.title}
          className="h-60 w-full rounded-3xl object-cover md:h-[30rem]"
          height={720}
          width={1024}
        />

        {blog.category && (
          <h2 className="bg-blue-500 text-white rounded-full text-sm w-fit px-4 py-1 mt-6 mb-4">
            {blog.category}
          </h2>
        )}

        <h2 className="mb-2 text-2xl md:text-3xl font-bold tracking-tight text-black dark:text-white">
          {blog.title}
        </h2>

        <div className="flex items-center mb-6">
          <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-[8px] font-semibold text-white">
              {blog.author.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </span>
          </div>
          <p className="pl-2 text-sm text-neutral-600 dark:text-neutral-400">
            {blog.author}
          </p>
          <div className="mx-2 h-1 w-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <p className="pl-1 text-sm text-neutral-600 dark:text-neutral-400">
            {format(new Date(blog.date), "LLLL d, yyyy")}
          </p>
        </div>

        {/* Summarize with AI Section */}
        {pageUrl && (
          <SummarizeWithAI pageUrl={pageUrl} pageTitle={blog.title} />
        )}

        <div className="prose prose-sm mt-10 dark:prose-invert">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </div>
    </TracingBeam>
  );
}