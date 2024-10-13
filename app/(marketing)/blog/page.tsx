import { type Metadata } from "next";
import { getAllBlogs } from "@/lib/blog";
import { Background } from "@/components/background";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { BlogCard } from "@/components/blog-card";

/**
 * Metadata for the blog page
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: "Blogs - Every AI",
  description:
    "Everything AI is a platform that provides a wide range of AI tools and services to help you stay on top of your business. Generate images, text and everything else that you need to get your business off the ground.",
  openGraph: {
    images: ["/SSI-Automations-banner.png"],
  },
};

/**
 * ArticlesIndex component - Renders the main blog page
 * @returns {Promise<JSX.Element>} The rendered blog page
 */
export default async function ArticlesIndex() {
  // Fetch all blog posts
  let blogs = await getAllBlogs();

  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      {/* Background component for visual effect */}
      <Background />
      <Container className="flex flex-col items-center justify-between pb-20">
        {/* Header section */}
        <div className="relative z-20 py-10 md:pt-40">
          <Heading as="h1">Blog</Heading>
          <Subheading className="text-center">
            Explore cutting-edge AI insights and automation strategies from SSI
            Automations to empower your small business and boost productivity.
          </Subheading>
        </div>

        {/* Featured blog posts (first two) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-20 w-full mb-10">
          {blogs.slice(0, 2).map((blog, index) => (
            <BlogCard blog={blog} key={blog.title + index} />
          ))}
        </div>

        {/* Remaining blog posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full relative z-20">
          {blogs.slice(2).map((blog, index) => (
            <BlogCard blog={blog} key={blog.title + index} />
          ))}
        </div>
      </Container>
    </div>
  );
}
