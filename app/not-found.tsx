'use client';

import Link from 'next/link';
import { CommitsGrid } from '@/components/ui/commits-grid';
import { Navigation } from '@/components/navigation';

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <Navigation />
      
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="mb-8">
          <CommitsGrid text="404" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-foreground">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          href="/"
          className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

