import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { Background } from "@/components/background";
import { HubCards } from "@/components/hub-cards";
import { CTA } from "@/components/cta";
import { NewsletterSection } from "@/components/newsletter-section";
import { BlogSection } from "@/components/blog-section";
import { getFeaturedBlogs } from "@/lib/blog";

export default function Home() {
  const featuredBlogs = getFeaturedBlogs(3);

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

        <NewsletterSection />
      </Container>

      {/* Blog Section */}
      <div className="relative">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Background />
        </div>
        <BlogSection blogs={featuredBlogs} />
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
