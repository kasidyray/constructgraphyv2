import React from 'react';
import HeroSectionSkeleton from './HeroSectionSkeleton';
import FeaturesSectionSkeleton from './FeaturesSectionSkeleton';
import CTASectionSkeleton from './CTASectionSkeleton';

const HomeSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header skeleton */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-8 w-40 bg-muted/60 animate-pulse rounded-md" />
            <div className="hidden md:flex gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 w-20 bg-muted/60 animate-pulse rounded-md" />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-muted/60 animate-pulse rounded-md" />
            <div className="h-10 w-24 bg-muted/60 animate-pulse rounded-md" />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <HeroSectionSkeleton />
        <FeaturesSectionSkeleton />
        <CTASectionSkeleton />
      </main>
      
      {/* Footer skeleton */}
      <footer className="bg-muted/20 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-32 bg-muted/60 animate-pulse rounded-md" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 w-24 bg-muted/60 animate-pulse rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-muted/30 flex justify-between items-center">
            <div className="h-4 w-48 bg-muted/60 animate-pulse rounded-md" />
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-8 bg-muted/60 animate-pulse rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeSkeleton; 