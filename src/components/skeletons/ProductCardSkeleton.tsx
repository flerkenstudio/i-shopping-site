import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 overflow-hidden shadow-xs select-none">
      {/* Top Image Section Skeleton */}
      <div className="relative aspect-4/3 w-full bg-zinc-100 dark:bg-zinc-900 animate-shimmer overflow-hidden">
        {/* Fake Top-Left Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800/90 animate-shimmer" />
        </div>

        {/* Fake Top-Right Action Buttons */}
        <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5 z-10">
          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800/90 animate-shimmer" />
          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800/90 animate-shimmer" />
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3.5">
        <div className="space-y-2.5">
          {/* Top Meta Line: SKU & Rating */}
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
              <div className="h-3 w-8 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
            </div>
          </div>

          {/* Product Name Title */}
          <div className="h-4 w-5/6 rounded-md bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />

          {/* Product Tagline (2 Lines) */}
          <div className="space-y-1.5 pt-0.5">
            <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
            <div className="h-3 w-3/4 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="h-5 w-20 rounded bg-zinc-200 dark:bg-zinc-800 animate-shimmer" />
            <div className="h-2.5 w-16 rounded bg-zinc-100 dark:bg-zinc-850 animate-shimmer" />
          </div>

          <div className="h-8 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-shimmer shrink-0" />
        </div>
      </div>
    </div>
  );
};
