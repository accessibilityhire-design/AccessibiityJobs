export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <div className="h-12 bg-gray-200 rounded-md animate-pulse w-3/4 mx-auto mb-4" />
        <div className="h-6 bg-gray-200 rounded-md animate-pulse w-2/3 mx-auto" />
      </div>

      <div className="bg-white p-6 rounded-lg border mb-8">
        <div className="h-10 bg-gray-200 rounded-md animate-pulse w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg border p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
