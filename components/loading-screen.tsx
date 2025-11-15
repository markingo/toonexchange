'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { CommitsGrid } from '@/components/ui/commits-grid';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    // Show the animation for 2.5 seconds to let the commits grid animation play
    // Then call onComplete to trigger the exit animation
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        className="flex flex-col items-center gap-8 scale-100 sm:scale-150"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.05, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <CommitsGrid text="TOON" />
      </motion.div>
    </motion.div>
  );
}
