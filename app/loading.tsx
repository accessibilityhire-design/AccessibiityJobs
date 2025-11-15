export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <div className="h-12 bg-gray-200 rounded w-3/4 max-w-2xl mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/2 max-w-xl mx-auto animate-pulse" />
      </div>

      <div className="mb-6">
        <div className="h-10 bg-gray-200 rounded w-64 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
            <div className="flex justify-between items-center pt-4">
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
