export default function Loading() {
  return (
    <div role="status" aria-label="Loading jobs" className="container px-5 py-10 md:px-8">
      <span className="sr-only">Loading jobs…</span>
      <div aria-hidden="true" className="animate-pulse">
        <div className="mb-4 h-9 w-3/4 max-w-xl rounded bg-gray-200" />
        <div className="mb-10 h-5 w-2/3 max-w-lg rounded bg-gray-200" />
        <div className="mb-8 h-12 rounded border border-border bg-white" />
        <div className="space-y-0 overflow-hidden rounded-lg border border-border lg:w-3/4">
          {[1, 2, 3, 4].map(i => <div key={i} className="space-y-4 border-b border-border bg-white p-6 last:border-0"><div className="h-4 w-1/3 rounded bg-gray-200" /><div className="h-6 w-3/4 rounded bg-gray-200" /><div className="h-4 w-1/2 rounded bg-gray-200" /><div className="h-4 w-1/4 rounded bg-gray-200" /></div>)}
        </div>
      </div>
    </div>
  );
}
