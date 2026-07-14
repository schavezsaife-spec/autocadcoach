export function RouteLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="route-progress-bar" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="skeleton-shimmer h-8 w-1/3 rounded-md" />
        <div className="skeleton-shimmer mt-3 h-4 w-1/2 rounded-md" />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-3">
              <div className="skeleton-shimmer aspect-video w-full rounded-md" />
              <div className="skeleton-shimmer mt-3 h-4 w-3/4 rounded-md" />
              <div className="skeleton-shimmer mt-2 h-3 w-1/2 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}