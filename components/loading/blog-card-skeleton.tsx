export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-xl border border-neutral-800 bg-black/30 backdrop-blur-sm overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-48 w-full bg-neutral-700/50" />

      {/* Content skeleton */}
      <div className="p-6 flex flex-col flex-1">
        {/* Author row */}
        <div className="flex items-center mb-3">
          <div className="h-6 w-6 rounded-full bg-neutral-700/50" />
          <div className="ml-2 h-4 w-20 bg-neutral-700/50 rounded" />
          <div className="mx-2 h-1 w-1 rounded-full bg-neutral-600" />
          <div className="h-4 w-24 bg-neutral-700/50 rounded" />
        </div>

        {/* Title skeleton */}
        <div className="h-6 bg-neutral-700/50 rounded w-3/4 mb-3" />
        <div className="h-6 bg-neutral-700/50 rounded w-1/2 mb-3" />

        {/* Summary skeleton */}
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-neutral-700/50 rounded w-full" />
          <div className="h-4 bg-neutral-700/50 rounded w-5/6" />
          <div className="h-4 bg-neutral-700/50 rounded w-4/6" />
        </div>

        {/* Category skeleton */}
        <div className="mt-4">
          <div className="h-6 w-20 bg-neutral-700/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}
