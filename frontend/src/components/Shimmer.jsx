import React from 'react';

// Shimmer Component for Product Cards
export const ProductCardShimmer = () => (
  <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm animate-pulse">
    <div className="w-full h-60 bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-2/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-gray-200 rounded w-1/3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-1/3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
);

// Shimmer for Hero/Featured Section
export const FeaturedProductShimmer = () => (
  <div className="min-w-[280px] w-[280px] bg-white border border-blue-100 rounded-xl p-4 shadow-sm animate-pulse">
    <div className="relative bg-gray-50 w-full h-60 rounded-lg mb-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
    </div>
    <div className="space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-200 rounded w-1/4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-1/4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
);

// Shimmer for Product Details Page
export const ProductDetailsShimmer = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
    {/* Image Section */}
    <div>
      <div className="w-full h-96 bg-gray-200 rounded-xl mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full h-20 bg-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Details Section */}
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-2/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-1/4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="space-y-2 py-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Shimmer for Grid Layout (4 columns)
export const ProductGridShimmer = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(count)].map((_, i) => (
      <ProductCardShimmer key={i} />
    ))}
  </div>
);

// Shimmer for Carousel
export const CarouselShimmer = ({ count = 6 }) => (
  <div className="flex gap-6 overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex-none w-52">
        <FeaturedProductShimmer />
      </div>
    ))}
  </div>
);

// Shimmer for List Items
export const OrderShimmer = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-6 bg-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
      ))}
    </div>
  </div>
);

// Shimmer for Category Cards (Quad cards)
export const CategoryCardShimmer = () => (
  <div className="bg-white p-4 flex flex-col justify-between h-full z-10 shadow-lg rounded-xl border border-blue-100 animate-pulse">
    <div>
      <div className="h-14 bg-gray-200 rounded mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="grid grid-cols-2 gap-2 h-40">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
          </div>
        ))}
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded mt-4 w-2/3 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
    </div>
  </div>
);

// Shimmer for Fresh Sale Card
export const FreshSaleCardShimmer = () => (
  <div className="bg-white flex flex-col justify-between h-full shadow-lg rounded-xl border border-blue-100 overflow-hidden animate-pulse">
    <div className="p-4 bg-white border-b border-gray-100 z-20">
      <div className="h-6 bg-gray-200 rounded mb-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
    </div>
    <div className="flex-1 p-4">
      <div className="h-32 bg-gray-200 rounded-lg mb-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-2/3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
);

// Shimmer for Quad Cards Grid
export const QuadCardsShimmer = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <CategoryCardShimmer />
    <CategoryCardShimmer />
    <CategoryCardShimmer />
    <FreshSaleCardShimmer />
  </div>
);
