// src/components/SkeletonProductCard.jsx
import React from 'react';

function SkeletonProductCard() {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-surface animate-pulse">
      {/* Image Placeholder */}
      <div className="h-48 bg-gray-300"></div>
      <div className="p-4 space-y-3">
        {/* Title Placeholder */}
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        {/* Price Placeholder */}
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        {/* Rating Placeholder */}
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
         {/* Button Placeholder */}
         <div className="h-9 bg-gray-300 rounded w-full mt-2"></div>
      </div>
    </div>
  );
}

// Component để render nhiều skeleton cards
export function SkeletonProductList({ count = 5 }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonProductCard key={index} />
            ))}
        </div>
    );
}