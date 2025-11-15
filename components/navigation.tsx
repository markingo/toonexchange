'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ToonLogo } from '@/components/toon-logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navItems = [
  { label: 'Calculator', href: '/#calculator' },
  { label: 'Playground', href: '/playground' },
  { label: 'Tools', href: '/#tools' },
  { label: 'About', href: '/#about' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('/')) {
      // Navigate to different page
      window.location.href = href;
    } else {
      // Scroll to section on same page
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'backdrop-blur-sm bg-background/95 border-b-2 border-foreground shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16 relative">
            {/* Logo - Absolute positioned on left */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 font-bold text-lg group absolute left-4 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 flex-shrink-0">
                <Image
                  src="/toon_logo.png"
                  alt="TOON Logo"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <span className="hidden sm:inline tracking-tight">TOON Exchange</span>
            </button>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  onClick={() => scrollToSection(item.href)}
                  className="text-foreground hover:bg-foreground/10 font-medium"
                >
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Actions - Absolute positioned on right */}
            <div className="flex items-center gap-2 absolute right-4">
              <ThemeToggle />
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden backdrop-blur-sm bg-background/95 border-b-2 border-foreground shadow-sm"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    onClick={() => scrollToSection(item.href)}
                    className="justify-start text-foreground hover:bg-foreground/10 font-medium"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

