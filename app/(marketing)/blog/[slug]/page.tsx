import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Background } from "@/components/background";
import { Container } from "@/components/container";
import { BlogContentCentered } from "@/components/blog-content-centered";
import { getAllBlogSlugs, getBlogBySlug } from "@/lib/blog";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata(props: BlogPostPageProps): Promise<Metadata> {
  const params = await props.params;
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: `${blog.title} - SSI Automations`,
    description: blog.summary || blog.title,
    openGraph: {
      title: blog.title,
      description: blog.summary,
      images: [blog.thumbnail],
    },
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-black">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Background />
      </div>

      <Container className="py-20 md:py-32 relative z-10">
        <BlogContentCentered blog={blog} />
      </Container>
    </div>
  );
}
