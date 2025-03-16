import React from 'react';
import Skeleton from '@/components/ui/skeleton';

const HeroSectionSkeleton: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" /> {/* Heading */}
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" /> {/* Paragraph */}
              ))}
            </div>
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-32" /> {/* Button */}
              <Skeleton className="h-12 w-32" /> {/* Button */}
            </div>
          </div>
          
          {/* Image skeleton */}
          <div className="flex justify-center">
            <Skeleton className="h-80 w-full max-w-lg rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionSkeleton; 