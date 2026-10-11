export default function Loading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading">
      <div className="h-9 w-56 rounded-xl bg-line" />
      <div className="h-48 rounded-[28px] bg-line" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-28 rounded-2xl bg-line" />
        <div className="h-28 rounded-2xl bg-line" />
      </div>
    </div>
  );
}
