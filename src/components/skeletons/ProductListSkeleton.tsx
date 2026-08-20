import React from 'react';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductListSkeletonProps {
  count?: number;
}

export const ProductListSkeleton: React.FC<ProductListSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" aria-busy="true" aria-label="Loading catalog gear">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
