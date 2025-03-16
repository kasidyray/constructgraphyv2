import React from 'react';
import Skeleton from '@/components/ui/skeleton';

const ProjectDetailsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" /> {/* Title */}
          <Skeleton className="h-4 w-40" /> {/* Subtitle */}
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" /> {/* Button */}
          <Skeleton className="h-10 w-32" /> {/* Button */}
        </div>
      </div>

      {/* Project info skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project image gallery */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" /> {/* Section title */}
            <Skeleton className="h-80 w-full rounded-lg" /> {/* Main image */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Project description */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" /> {/* Section title */}
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>

          {/* Project timeline */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" /> {/* Section title */}
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Project details */}
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-40" /> {/* Section title */}
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Project team */}
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-40" /> {/* Section title */}
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsSkeleton; 