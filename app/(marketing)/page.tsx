import { Suspense } from "react";
import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { Background } from "@/components/background";
import { HubCards } from "@/components/hub-cards";
import { CTA } from "@/components/cta";
import { NewsletterSection } from "@/components/newsletter-section";
import { BlogSection } from "@/components/blog-section";
import { BlogSectionSkeleton } from "@/components/loading/blog-section-skeleton";
import { getFeaturedBlogs } from "@/lib/blog";

export default function Home() {
  return (
    <div className="relative">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Background />
      </div>

      <Container className="flex flex-col items-center">
        <Hero />

        <div id="hubs" className="w-full max-w-6xl mx-auto px-4 pb-20">
          <HubCards />
        </div>

        <Suspense fallback={<div className="h-96" />}>
          <NewsletterSection />
        </Suspense>
      </Container>

      {/* Blog Section with Suspense for progressive loading */}
      <div className="relative">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Background />
        </div>
        <Suspense fallback={<BlogSectionSkeleton />}>
          <BlogSectionContainer />
        </Suspense>
      </div>

      <div className="relative">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Background />
        </div>
        <CTA />
      </div>
    </div>
  );
}

// Async container component for featured blogs
async function BlogSectionContainer() {
  const featuredBlogs = await getFeaturedBlogs(3);
  return <BlogSection blogs={featuredBlogs} />;
}
