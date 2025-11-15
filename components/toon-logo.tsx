'use client';

import { cn } from '@/lib/utils';

interface ToonLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export function ToonLogo({ size = 'md', className, showText = true }: ToonLogoProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const squareSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-4 h-4',
    xl: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Geometric Logo - 4 Squares in TOON Formation */}
      <div className={cn('relative flex-shrink-0', sizes[size])}>
        {/* Top Row - 2 squares */}
        <div className="absolute top-0 left-0 flex gap-0.5">
          <div className={cn(squareSizes[size], 'bg-foreground')} />
          <div className={cn(squareSizes[size], 'bg-foreground')} />
        </div>
        
        {/* Bottom Row - 2 squares */}
        <div className="absolute bottom-0 left-0 flex gap-0.5">
          <div className={cn(squareSizes[size], 'bg-foreground')} />
          <div className={cn(squareSizes[size], 'bg-foreground')} />
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={cn('font-bold tracking-tight leading-none', textSizes[size])}>
            TOON
          </span>
        </div>
      )}
    </div>
  );
}

interface ToonLogoIconProps {
  size?: number;
  className?: string;
}

export function ToonLogoIcon({ size = 40, className }: ToonLogoIconProps) {
  const squareSize = size / 2.5;
  const gap = size / 20;

  return (
    <div className={cn('relative flex-shrink-0', className)} style={{ width: size, height: size }}>
      {/* Top Row - 2 squares */}
      <div className="absolute top-0 left-0 flex" style={{ gap }}>
        <div 
          className="bg-foreground" 
          style={{ width: squareSize, height: squareSize }}
        />
        <div 
          className="bg-foreground" 
          style={{ width: squareSize, height: squareSize }}
        />
      </div>
      
      {/* Bottom Row - 2 squares */}
      <div className="absolute bottom-0 left-0 flex" style={{ gap }}>
        <div 
          className="bg-foreground" 
          style={{ width: squareSize, height: squareSize }}
        />
        <div 
          className="bg-foreground" 
          style={{ width: squareSize, height: squareSize }}
        />
      </div>
    </div>
  );
}

