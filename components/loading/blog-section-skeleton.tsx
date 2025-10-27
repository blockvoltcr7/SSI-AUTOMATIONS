export function BlogSectionSkeleton() {
  return (
    <div className="relative overflow-hidden py-20 md:py-0">
      <div className="py-4 md:py-10 overflow-hidden relative px-4 md:px-8">
        <div className="relative z-20 py-10">
          {/* Title skeleton */}
          <div className="h-10 bg-neutral-700/50 rounded w-1/4 mb-6 animate-pulse" />

          {/* Description skeleton */}
          <div className="h-6 bg-neutral-700/50 rounded w-1/2 mb-6 animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-between pb-20 max-w-7xl mx-auto px-4 md:px-8">
        {/* Blog cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full relative z-20">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-96 bg-neutral-700/50 rounded-3xl animate-pulse"
            />
          ))}
        </div>

        {/* View all button skeleton */}
        <div className="mt-12">
          <div className="h-12 w-40 bg-neutral-700/50 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
