import React from 'react';
import Skeleton from '@/components/ui/skeleton';

const HomeownerDashboardSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Project overview */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-40" />
        
        {/* Project card */}
        <Skeleton className="h-64 rounded-lg" />
        
        {/* Project details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Recent updates */}
      <div className="space-y-4 mt-8">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Photo gallery */}
      <div className="space-y-4 mt-8">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeownerDashboardSkeleton; 