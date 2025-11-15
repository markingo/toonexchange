'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToonCalculator } from '@/components/toon-calculator';
import { ToolsGrid } from '@/components/tools-grid';
import { ModelComparisonTable } from '@/components/model-comparison-table';
import { LoadingScreen } from '@/components/loading-screen';
import { Navigation } from '@/components/navigation';
import { ToonLogo } from '@/components/toon-logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Github, Code2, Zap, ArrowRight, ArrowDown } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowLoading, setShouldShowLoading] = useState(false);

  useEffect(() => {
    // Check if user has visited before (only runs on client)
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (!hasVisited) {
      setShouldShowLoading(true);
      sessionStorage.setItem('hasVisited', 'true');
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3500); // Animation + content delay

      return () => clearTimeout(timer);
    } else {
      // Skip loading for returning visitors
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && shouldShowLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen relative overflow-hidden bg-background">
          {/* Navigation */}
          <Navigation />

          {/* Hero Section */}
          <section className="relative z-10 pt-32 pb-20 border-b-2 border-foreground">
            <div className="container mx-auto px-4">
              <motion.div
                className="space-y-12 max-w-6xl mx-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Header with Logo */}
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <ToonLogo size="lg" showText={false} />
                      <div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none">
                          Token-Oriented Object Notation
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mt-2">
                          Compact, human-readable format for serializing JSON data in LLM prompts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workflow Diagram */}
                <div className="border-2 border-foreground bg-card p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">Workflow:</span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                      {/* JSON Box */}
                      <div className="border-2 border-foreground bg-background px-8 py-6 min-w-[140px] text-center">
                        <span className="text-2xl font-bold">JSON</span>
                      </div>
                      
                      {/* Arrow - Down on mobile, Right on desktop */}
                      <ArrowDown className="w-8 h-8 flex-shrink-0 md:hidden" />
                      <ArrowRight className="w-8 h-8 flex-shrink-0 hidden md:block" />
                      
                      {/* encode() Box with Stripes */}
                      <div className="border-2 border-foreground bg-card stripe-pattern px-8 py-6 min-w-[140px] text-center">
                        <span className="text-2xl font-mono font-bold">encode()</span>
                      </div>
                      
                      {/* Arrow - Down on mobile, Right on desktop */}
                      <ArrowDown className="w-8 h-8 flex-shrink-0 md:hidden" />
                      <ArrowRight className="w-8 h-8 flex-shrink-0 hidden md:block" />
                      
                      {/* TOON Box */}
                      <div className="border-2 border-foreground bg-background px-8 py-6 min-w-[140px] text-center">
                        <span className="text-2xl font-bold">TOON</span>
                      </div>
                      
                      {/* Arrow - Down on mobile, Right on desktop */}
                      <ArrowDown className="w-8 h-8 flex-shrink-0 md:hidden" />
                      <ArrowRight className="w-8 h-8 flex-shrink-0 hidden md:block" />
                      
                      {/* LLM Box */}
                      <div className="border-2 border-foreground bg-foreground text-background px-8 py-6 min-w-[140px] text-center">
                        <span className="text-2xl font-bold">LLM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Token Stats */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Visual Token Comparison */}
                  <div className="border-2 border-foreground bg-card p-6">
                    <div className="space-y-4">
                      <div className="text-sm font-bold">⌀ Tokens:</div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-12">JSON</span>
                          <div className="flex-1 bg-foreground h-6 border-2 border-foreground"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-12">TOON</span>
                          <div className="bg-foreground h-6 stripe-pattern-dense border-2 border-foreground" style={{width: '40%'}}></div>
                        </div>
                      </div>
                      <div className="pt-3 border-t-2 border-foreground">
                        <div className="text-xs">
                          <span className="font-bold">Try it:</span>
                          <code className="ml-2 font-mono">npx @toon-format/cli *.json</code>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right: Stats Box */}
                  <div className="border-2 border-foreground bg-foreground text-background p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">TOON →</span>
                        <span className="text-2xl font-bold">≈30-60% less</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-background/20 pb-2">
                          <span>avg tokens</span>
                          <span className="font-bold">↓ 73.9%</span>
                        </div>
                        <div className="flex justify-between border-b border-background/20 pb-2">
                          <span>retrieval accuracy</span>
                          <span className="font-bold">↑ 73.9%</span>
                        </div>
                        <div className="pt-3">
                          <div className="font-bold mb-2">best for:</div>
                          <div className="text-xs space-y-1">
                            <div>• repeated structure • tables</div>
                            <div>• varying fields • deep trees</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-3 pt-4 justify-center">
                  <Badge variant="outline" className="px-4 py-2">
                    <Zap className="w-4 h-4 mr-2" />
                    100% Client-Side
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Code2 className="w-4 h-4 mr-2" />
                    Zero Data Collection
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Zap className="w-4 h-4 mr-2" />
                    Instant Results
                  </Badge>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-16 relative z-10 space-y-32">
            {/* Calculator Section */}
            <section id="calculator" className="scroll-mt-20">
              <ToonCalculator />
            </section>


            {/* Tools Grid Section */}
            <ToolsGrid />

            {/* Model Comparison Table */}
            <section className="scroll-mt-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-4 mb-12"
              >
                <Badge variant="outline" className="text-sm">
                  Pricing Data
                </Badge>
                <h2 className="text-4xl font-bold tracking-tight">
                  Compare LLM Costs
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Real-time pricing data for 100+ language models
                </p>
              </motion.div>
              <ModelComparisonTable />
            </section>

            {/* About TOON Section */}
            <section id="about" className="scroll-mt-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="border-b-2 border-foreground pb-4">
                  <h2 className="text-3xl font-bold tracking-tight">
                    About TOON Format
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">⚡</span>
                        Efficient
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Tabular format eliminates repeated keys, reducing token count by 30-60% 
                        compared to JSON for structured data.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">📖</span>
                        Readable
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Human-friendly, YAML-like structure that's easy to read and understand, 
                        making it perfect for both humans and LLMs.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">🔒</span>
                        Schema-Aware
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Explicit array lengths and field headers provide clear structure, 
                        making it easier for LLMs to parse and understand.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Example Comparison */}
                <Card className="mt-12 stripe-pattern-light">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold border-b-2 border-foreground pb-2">
                          Example: JSON vs TOON
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="border-2 border-foreground bg-background p-3 text-center">
                            <div className="text-xs mb-1">JSON Tokens</div>
                            <div className="text-2xl font-bold">247</div>
                          </div>
                          <div className="border-2 border-foreground bg-card p-3 text-center">
                            <div className="text-xs mb-1">TOON Tokens</div>
                            <div className="text-2xl font-bold">98</div>
                          </div>
                          <div className="border-2 border-foreground bg-foreground text-background p-3 text-center">
                            <div className="text-xs mb-1">Saved</div>
                            <div className="text-2xl font-bold">60%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="border-2 border-foreground bg-background p-4 font-mono text-xs">
                          <div className="font-bold mb-2">JSON (247 tokens)</div>
                          <code>
                            {`{"users":[{"id":1,"name":"Alice","role":"admin"}]}`}
                          </code>
                        </div>
                        <div className="border-2 border-foreground bg-card p-4 font-mono text-xs">
                          <div className="font-bold mb-2">TOON (98 tokens)</div>
                          <code>
                            {`users[1]:\n  id,name,role\n  1,Alice,admin`}
                          </code>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </section>
          </main>

          {/* Footer */}
          <footer className="border-t-2 border-foreground mt-32 relative z-10">
            <div className="container mx-auto px-4 py-12">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-lg">
                <ToonLogo size="sm" />
              </div>
              <p className="text-sm">
                Professional format exchange platform for modern developers. 
                Convert and optimize data formats with real-time token analysis.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b-2 border-foreground pb-2">Resources</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a 
                        href="https://github.com/toon-format/toon" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center gap-2"
                      >
                        <Github className="w-4 h-4" />
                        TOON Specification
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.llm-prices.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        LLM Pricing Data
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://nextjs.org" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Built with Next.js
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://github.com/markingo/toonexchange" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center gap-1"
                      >
                        <Github className="w-4 h-4" />
                        GitHub Repository
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Creator */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b-2 border-foreground pb-2">Created By</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a 
                      href="https://linkedin.com/in/mark-mate" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 border-2 border-foreground bg-card hover:bg-foreground/10 font-bold transition-all"
                    >
                      <Linkedin className="w-5 h-5" />
                      <div>
                        <p className="font-bold">Mark Mate</p>
                        <p className="text-xs">Connect on LinkedIn</p>
                      </div>
                    </a>
                    <a 
                      href="https://github.com/markingo/toonexchange" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 border-2 border-foreground bg-card hover:bg-foreground/10 font-bold transition-all"
                    >
                      <Github className="w-5 h-5" />
                      <div>
                        <p className="font-bold">GitHub</p>
                        <p className="text-xs">View Repository</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="mt-12 pt-8 border-t-2 border-foreground flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm font-medium">
                  © 2025 Toon Exchange. MIT License. Free to use.
                </p>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span>🔒 No tracking</span>
                  <span>•</span>
                  <span>💾 No storage</span>
                  <span>•</span>
                  <span>⚡ 100% client-side</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
