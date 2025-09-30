import { Metadata } from "next";
import { Background } from "@/components/background";
import { Container } from "@/components/container";
import { getAllBlogs } from "@/lib/blog";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Blog - SSI Automations",
  description: "Insights, guides, and reviews about AI learning platforms, courses, and resources from SSI Automations.",
  openGraph: {
    images: ["/SSI-Automations-banner.png"],
  },
};

export default function BlogPage() {
  const blogs = getAllBlogs();

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Background />
      </div>

      <Container className="py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Blog
          </h1>
          <p className="text-lg md:text-xl text-neutral-400">
            Insights, guides, and reviews about AI learning platforms and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {blogs.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="group"
            >
              <article className="flex flex-col h-full rounded-xl border border-neutral-800 hover:border-neutral-600 bg-black/30 backdrop-blur-sm transition-all duration-300 overflow-hidden hover:translate-y-[-5px] hover:shadow-lg">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={blog.thumbnail}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center mb-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-semibold text-white">
                        {blog.author.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                    <span className="ml-2 text-sm text-neutral-400">{blog.author}</span>
                    <div className="mx-2 h-1 w-1 rounded-full bg-neutral-600" />
                    <span className="text-sm text-neutral-400">
                      {format(new Date(blog.date), "MMM d, yyyy")}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h2>

                  {blog.summary && (
                    <p className="text-neutral-400 text-sm flex-1 line-clamp-3">
                      {blog.summary}
                    </p>
                  )}

                  {blog.category && (
                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-neutral-300 bg-neutral-800/50 rounded-full">
                        {blog.category}
                      </span>
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </Container>
    </div>
  );
}