import React from 'react';
import Skeleton from '@/components/ui/skeleton';

const ProjectsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" /> {/* Back button */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" /> {/* Title */}
            <Skeleton className="h-4 w-40" /> {/* Subtitle */}
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" /> {/* Button */}
          <Skeleton className="h-10 w-32" /> {/* Button */}
        </div>
      </div>

      {/* Search bar skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-full max-w-md" />
      </div>

      {/* Projects grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSkeleton; 