'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { FormatPlayground } from '@/components/format-playground';
import { LoadingScreen } from '@/components/loading-screen';
import { Navigation } from '@/components/navigation';
import { DottedBackground } from '@/components/ui/dotted-background';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { FileJson, FileCode, FileSpreadsheet, FileText, Code, Zap } from 'lucide-react';

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');
  const target = searchParams.get('target');
  
  return <FormatPlayground initialSource={source || undefined} initialTarget={target || undefined} />;
}

export default function PlaygroundPage() {
  const [showLoading, setShowLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if user has visited before (only runs on client)
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (!hasVisited) {
      // First time visitor - show loading animation
      setShowLoading(true);
      sessionStorage.setItem('hasVisited', 'true');
    } else {
      // Returning visitor - skip loading and show content immediately
      setShowContent(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setShowContent(true);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoading && (
          <LoadingScreen key="loading-screen" onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {showContent && (
        <motion.div 
          className="min-h-screen relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Dotted Glow Background */}
          <DottedBackground
            dotSize={1.2}
            gap={20}
            fade={true}
            mask={true}
            className="opacity-50"
          />

          {/* Navigation */}
          <Navigation />

          {/* Hero Section */}
          <section className="relative z-10 pt-32 pb-16">
            <div className="container mx-auto px-4">
              <motion.div
                className="text-center space-y-6 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 backdrop-blur-xl">
                  <div className="relative w-4 h-4">
                    <Image
                      src="/toon_logo.png"
                      alt="TOON"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-primary">
                    Format Conversion Playground
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                  <span className="block">Convert Between</span>
                  <span className="block underline decoration-8 decoration-foreground/30">
                    Any Data Format
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Seamlessly convert between JSON, TOON, CSV, YAML, and XML with real-time token analysis.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-16 relative z-10 space-y-16">
            {/* Playground Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Suspense fallback={<div className="text-center py-8">Loading playground...</div>}>
                <PlaygroundContent />
              </Suspense>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid md:grid-cols-5 gap-6"
            >
              <Card className="backdrop-blur-xl bg-card/70 shadow-xl border-border/50 text-center">
                <CardHeader>
                  <FileJson className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                  <CardTitle className="text-lg">JSON</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    JavaScript Object Notation
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-card/70 shadow-xl border-border/50 text-center">
                <CardHeader>
                  <FileCode className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <CardTitle className="text-lg">TOON</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Token-Oriented Object Notation
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-card/70 shadow-xl border-border/50 text-center">
                <CardHeader>
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <CardTitle className="text-lg">CSV</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Comma-Separated Values
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-card/70 shadow-xl border-border/50 text-center">
                <CardHeader>
                  <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-lg">YAML</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    YAML Ain't Markup Language
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-card/70 shadow-xl border-border/50 text-center">
                <CardHeader>
                  <Code className="w-8 h-8 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
                  <CardTitle className="text-lg">XML</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Extensible Markup Language
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="backdrop-blur-xl bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-2 border-primary/20 shadow-2xl">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-foreground" />
                      </div>
                      <h3 className="text-xl font-bold">Instant Conversion</h3>
                      <p className="text-muted-foreground">
                        Convert between formats in milliseconds with 100% client-side processing.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <FileCode className="w-6 h-6 text-foreground" />
                      </div>
                      <h3 className="text-xl font-bold">Token Analysis</h3>
                      <p className="text-muted-foreground">
                        Real-time token counting to help you optimize LLM costs.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Badge className="text-base px-4 py-2">🔒</Badge>
                      </div>
                      <h3 className="text-xl font-bold">100% Private</h3>
                      <p className="text-muted-foreground">
                        No data sent to servers. All processing happens in your browser.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="border-t border-border/40 mt-32 backdrop-blur-sm relative z-10">
            <div className="container mx-auto px-4 py-8">
              <p className="text-center text-sm text-muted-foreground">
                © 2025 Toon Exchange • Free to use • No tracking • 100% client-side
              </p>
            </div>
          </footer>
        </motion.div>
      )}
    </>
  );
}

