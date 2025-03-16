import React from 'react';
import Skeleton from '@/components/ui/skeleton';

const FeaturesSectionSkeleton: React.FC = () => {
  return (
    <div className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-full max-w-lg mx-auto" />
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 bg-white rounded-lg shadow-sm space-y-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-40" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSectionSkeleton; 