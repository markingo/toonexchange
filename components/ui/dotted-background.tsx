'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface DottedBackgroundProps {
  className?: string;
  dotSize?: number;
  dotColor?: string;
  backgroundColor?: string;
  gap?: number;
  mask?: boolean;
  fade?: boolean;
}

export function DottedBackground({
  className,
  dotSize = 1,
  dotColor = 'rgba(107, 114, 128, 0.2)',
  backgroundColor = 'transparent',
  gap = 15,
  mask = false,
  fade = true,
}: DottedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    if (backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }

    ctx.fillStyle = dotColor;

    for (let x = 0; x < dimensions.width; x += gap) {
      for (let y = 0; y < dimensions.height; y += gap) {
        let opacity = 1;
        
        if (fade) {
          const distanceFromCenter = Math.sqrt(
            Math.pow(x - dimensions.width / 2, 2) + 
            Math.pow(y - dimensions.height / 2, 2)
          );
          const maxDistance = Math.sqrt(
            Math.pow(dimensions.width / 2, 2) + 
            Math.pow(dimensions.height / 2, 2)
          );
          opacity = 1 - (distanceFromCenter / maxDistance) * 0.8;
        }

        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
  }, [dimensions, dotSize, dotColor, backgroundColor, gap, fade]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'pointer-events-none fixed inset-0 z-0',
        mask && '[mask-image:radial-gradient(ellipse_at_center,white,transparent)]',
        className
      )}
    />
  );
}

