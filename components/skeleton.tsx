// Fallbacks shown while a page's data streams in.
export function PageSkeleton() {
  return (
    <div
      className="animate-pulse space-y-6"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="h-48 rounded-[28px] bg-line" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-28 rounded-2xl bg-line" />
        <div className="h-28 rounded-2xl bg-line" />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div
      className="animate-pulse space-y-3"
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-20 rounded-2xl bg-line" />
      ))}
    </div>
  );
}
