import React from 'react';
import Skeleton from '@/components/ui/skeleton';

const ProjectDetailsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:max-w-screen-xl py-6 space-y-8">
      {/* Project Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" /> {/* Project Title */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24 rounded-full" /> {/* Status Badge */}
            <Skeleton className="h-5 w-32" /> {/* Address */}
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-md" /> {/* Action Button */}
          <Skeleton className="h-10 w-32 rounded-md" /> {/* Action Button */}
        </div>
      </div>

      {/* Project Info Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-lg">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-1">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-6 w-32" /> {/* Value */}
          </div>
        ))}
      </div>

      {/* Photos Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-40" /> {/* Section Title */}
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32 rounded-full" /> {/* Filter Button */}
            <Skeleton className="h-9 w-32 rounded-full" /> {/* Filter Button */}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Photos */}
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>

      {/* Project Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Description */}
          <div className="space-y-4">
            <Skeleton className="h-7 w-40" /> {/* Section Title */}
            <div className="space-y-2">
              {/* Description Text */}
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>

          {/* Project Timeline */}
          <div className="space-y-4">
            <Skeleton className="h-7 w-40" /> {/* Section Title */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  {/* Timeline Icon */}
                  <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-40" /> {/* Event Title */}
                      <Skeleton className="h-5 w-24" /> {/* Event Date */}
                    </div>
                    <Skeleton className="h-4 w-full" /> {/* Event Description */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Stats */}
          <div className="p-6 border rounded-lg space-y-4">
            <Skeleton className="h-6 w-40" /> {/* Section Title */}
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-24" /> {/* Stat Label */}
                  <Skeleton className="h-6 w-full" /> {/* Stat Value */}
                </div>
              ))}
            </div>
          </div>

          {/* Project Team */}
          <div className="p-6 border rounded-lg space-y-4">
            <Skeleton className="h-6 w-40" /> {/* Section Title */}
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  {/* Team Member Avatar */}
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-32" /> {/* Team Member Name */}
                    <Skeleton className="h-4 w-24" /> {/* Team Member Role */}
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