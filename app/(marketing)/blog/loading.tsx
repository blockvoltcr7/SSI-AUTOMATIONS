import { Background } from "@/components/background";
import { Container } from "@/components/container";
import { BlogGridSkeleton } from "@/components/loading/blog-grid-skeleton";

export default function Loading() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Background />
      </div>

      <Container className="py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="h-12 md:h-16 bg-neutral-700/50 rounded w-1/3 mx-auto mb-6 animate-pulse" />
          <div className="h-6 md:h-8 bg-neutral-700/50 rounded w-2/3 mx-auto animate-pulse" />
        </div>

        <BlogGridSkeleton />
      </Container>
    </div>
  );
}
