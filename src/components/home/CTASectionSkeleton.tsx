import React from 'react';
import Skeleton from '@/components/ui/skeleton';

const CTASectionSkeleton: React.FC = () => {
  return (
    <div className="py-20 bg-primary/5">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3 mx-auto" />
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASectionSkeleton; 