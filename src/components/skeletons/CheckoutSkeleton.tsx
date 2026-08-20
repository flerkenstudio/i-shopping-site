import React from 'react';

export const CheckoutSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-28 sm:pb-16 transition-colors select-none" aria-busy="true" aria-label="Loading secure checkout">
      {/* Checkout Navbar Skeleton */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-32 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
          </div>

          <div className="flex items-center space-x-2">
            <div className="h-6 w-36 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator Skeleton */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
            <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
          </div>

          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-1/4 bg-zinc-300 dark:bg-zinc-700 animate-shimmer rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex items-center space-x-2.5 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-shimmer shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                  <div className="h-2 w-10 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Checkout Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Cards Skeleton (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact Information */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                  <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                </div>
                <div className="h-6 w-20 rounded-md bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="h-3 w-20 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                  <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-24 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                  <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                  <div className="h-4 w-44 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <div className="h-3 w-28 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                  <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
                </div>

                <div className="space-y-1.5">
                  <div className="h-3 w-24 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                  <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <div className="h-3 w-16 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                    <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3 w-14 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                    <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3 w-16 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                    <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Shipping Speed Options */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                    <div className="h-4 w-12 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                  </div>
                  <div className="h-3 w-36 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                </div>
                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                    <div className="h-4 w-12 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                  </div>
                  <div className="h-3 w-40 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Step 4: Payment Methods */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
                  <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card Skeleton (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                <div className="h-3 w-16 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
              </div>

              {/* Order Items Mock List */}
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
                    <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-shimmer shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                      <div className="h-2.5 w-1/3 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                    </div>
                    <div className="h-3.5 w-14 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer shrink-0" />
                  </div>
                ))}
              </div>

              {/* Coupon Row Skeleton */}
              <div className="flex gap-2">
                <div className="h-9 flex-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-shimmer" />
                <div className="h-9 w-20 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-shimmer shrink-0" />
              </div>

              {/* Calculation Lines */}
              <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between">
                  <div className="h-3 w-16 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                  <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 w-20 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                  <div className="h-3 w-12 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 w-16 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
                  <div className="h-3 w-14 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                </div>
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                  <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                  <div className="h-6 w-24 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
                </div>
              </div>

              {/* Big Checkout Button Skeleton */}
              <div className="h-12 w-full rounded-xl bg-zinc-900/30 dark:bg-zinc-100/30 animate-shimmer" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
