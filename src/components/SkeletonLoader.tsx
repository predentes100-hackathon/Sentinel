export function SkeletonLoader() {
  return (
    <section className="glass-panel min-h-[calc(100vh-2rem)] animate-pulse rounded-[8px] p-4 sm:p-6">
      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-[1.25fr_0.9fr]">
            <div className="glass-panel rounded-[8px] p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[4px] bg-[#D4AF37]/10" />
                <div className="space-y-3">
                  <div className="h-3 w-24 rounded bg-[#D4AF37]/10" />
                  <div className="h-6 w-32 rounded bg-[#D4AF37]/20" />
                  <div className="h-3 w-48 rounded bg-[#D4AF37]/10" />
                </div>
              </div>
              <div className="mt-8 h-2 w-full rounded bg-[#D4AF37]/10" />
            </div>
            <div className="glass-panel rounded-[8px] p-5 sm:p-6">
              <div className="h-4 w-32 rounded bg-[#D4AF37]/10" />
              <div className="mt-8 space-y-4">
                <div className="h-14 w-full rounded bg-[#D4AF37]/10" />
                <div className="h-14 w-full rounded bg-[#D4AF37]/10" />
                <div className="h-14 w-full rounded bg-[#D4AF37]/10" />
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-[8px] p-5 sm:p-6">
            <div className="h-6 w-48 rounded bg-[#D4AF37]/10" />
            <div className="mt-6 space-y-4">
              <div className="h-32 w-full rounded bg-[#D4AF37]/5" />
              <div className="h-32 w-full rounded bg-[#D4AF37]/5" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass-panel rounded-[8px] p-5 sm:p-6">
            <div className="h-6 w-40 rounded bg-[#D4AF37]/10" />
            <div className="mt-6 space-y-3">
              <div className="h-20 w-full rounded bg-[#D4AF37]/5" />
              <div className="h-20 w-full rounded bg-[#D4AF37]/5" />
              <div className="h-20 w-full rounded bg-[#D4AF37]/5" />
            </div>
          </div>
          <div className="glass-panel rounded-[8px] p-5 sm:p-6">
            <div className="h-6 w-40 rounded bg-[#D4AF37]/10" />
            <div className="mt-6 space-y-3">
              <div className="h-16 w-full rounded bg-[#D4AF37]/5" />
              <div className="h-16 w-full rounded bg-[#D4AF37]/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
