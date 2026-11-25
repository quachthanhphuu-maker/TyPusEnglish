export default function StudentLoading() {
  return (
    <div className="space-y-6">
      <div className="h-32 animate-pulse rounded-2xl border border-[#1E293B] bg-[#131E2B]" />
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 animate-pulse rounded-2xl border border-[#1E293B] bg-[#131E2B]"
          />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl border border-[#1E293B] bg-[#131E2B]" />
        <div className="h-64 animate-pulse rounded-2xl border border-[#1E293B] bg-[#131E2B]" />
      </div>
    </div>
  );
}
