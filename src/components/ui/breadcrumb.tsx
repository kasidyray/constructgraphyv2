import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbSegment {
  name: string;
  href?: string; // Optional href for linked segments
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ segments }) => {
  if (!segments || segments.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
      <ol className="flex items-center space-x-1">
        {segments.map((segment, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
            )}
            {segment.href ? (
              <Link 
                to={segment.href}
                className="hover:text-foreground hover:underline"
              >
                {segment.name}
              </Link>
            ) : (
              // Last segment or segment without a link
              <span className="font-medium text-foreground">{segment.name}</span> 
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
