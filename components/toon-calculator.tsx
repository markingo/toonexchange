'use client';

import { useState, useEffect, useRef } from 'react';
import { encode } from '@toon-format/toon';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Copy, 
  Sparkles, 
  TrendingDown, 
  DollarSign,
  Zap,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Loader2,
  Search,
  Maximize2,
  Minimize2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AnimatedNumber } from '@/components/animated-number';
import { cn } from '@/lib/utils';

import { compareTokens, type TokenComparison } from '@/lib/token-counter';
import { 
  fetchLLMPricing, 
  POPULAR_MODELS,
  calculateCost, 
  formatCurrency,
  getVendorColor,
  type LLMModel 
} from '@/lib/llm-pricing';

export function ToonCalculator() {
  const [jsonInput, setJsonInput] = useState('');
  const [toonOutput, setToonOutput] = useState('');
  const [error, setError] = useState('');
  const [comparison, setComparison] = useState<TokenComparison | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-5.1');
  const [models, setModels] = useState<LLMModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<LLMModel[]>([]);
  const [modelSearch, setModelSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [jsonExpanded, setJsonExpanded] = useState(false);
  const [toonExpanded, setToonExpanded] = useState(false);
  const [jsonOverflows, setJsonOverflows] = useState(false);
  const jsonTextareaRef = useRef<HTMLTextAreaElement>(null);

  const exampleData = {
    orders: [
      { id: 'ORD-2025-001', customerId: 'CUST-478', customerName: 'Alice Johnson', email: 'alice.johnson@email.com', items: 3, total: 249.97, status: 'shipped', paymentMethod: 'credit_card', shippingAddress: '123 Main St, New York, NY 10001', orderDate: '2025-01-10T08:30:00Z', shippedDate: '2025-01-11T14:20:00Z' },
      { id: 'ORD-2025-002', customerId: 'CUST-892', customerName: 'Bob Smith', email: 'bob.smith@email.com', items: 1, total: 89.99, status: 'processing', paymentMethod: 'paypal', shippingAddress: '456 Oak Ave, Los Angeles, CA 90001', orderDate: '2025-01-12T10:15:00Z', shippedDate: null },
      { id: 'ORD-2025-003', customerId: 'CUST-156', customerName: 'Carol White', email: 'carol.white@email.com', items: 5, total: 379.95, status: 'delivered', paymentMethod: 'credit_card', shippingAddress: '789 Pine Rd, Chicago, IL 60601', orderDate: '2025-01-08T09:45:00Z', shippedDate: '2025-01-09T11:30:00Z' },
      { id: 'ORD-2025-004', customerId: 'CUST-634', customerName: 'David Brown', email: 'david.brown@email.com', items: 2, total: 159.98, status: 'shipped', paymentMethod: 'debit_card', shippingAddress: '321 Elm St, Houston, TX 77001', orderDate: '2025-01-11T13:20:00Z', shippedDate: '2025-01-12T16:45:00Z' },
      { id: 'ORD-2025-005', customerId: 'CUST-945', customerName: 'Emma Davis', email: 'emma.davis@email.com', items: 4, total: 299.96, status: 'processing', paymentMethod: 'credit_card', shippingAddress: '654 Maple Dr, Phoenix, AZ 85001', orderDate: '2025-01-13T11:00:00Z', shippedDate: null },
      { id: 'ORD-2025-006', customerId: 'CUST-278', customerName: 'Frank Miller', email: 'frank.miller@email.com', items: 1, total: 49.99, status: 'cancelled', paymentMethod: 'paypal', shippingAddress: '987 Birch Ln, Philadelphia, PA 19101', orderDate: '2025-01-09T15:30:00Z', shippedDate: null },
      { id: 'ORD-2025-007', customerId: 'CUST-523', customerName: 'Grace Wilson', email: 'grace.wilson@email.com', items: 6, total: 449.94, status: 'delivered', paymentMethod: 'credit_card', shippingAddress: '147 Cedar Ct, San Antonio, TX 78201', orderDate: '2025-01-07T12:15:00Z', shippedDate: '2025-01-08T10:00:00Z' },
      { id: 'ORD-2025-008', customerId: 'CUST-701', customerName: 'Henry Moore', email: 'henry.moore@email.com', items: 2, total: 129.98, status: 'shipped', paymentMethod: 'debit_card', shippingAddress: '258 Spruce Way, San Diego, CA 92101', orderDate: '2025-01-12T14:45:00Z', shippedDate: '2025-01-13T09:20:00Z' }
    ],
    summary: {
      totalOrders: 8,
      totalRevenue: 1789.76,
      averageOrderValue: 223.72,
      statuses: { shipped: 3, delivered: 2, processing: 2, cancelled: 1 },
      lastUpdated: '2025-01-15T10:30:00Z'
    }
  };

  // Fetch LLM pricing on mount
  useEffect(() => {
    async function loadPricing() {
      try {
        const pricingData = await fetchLLMPricing();
        // Load all models, but prioritize popular ones
        const allModels = pricingData.prices;
        // Sort: popular models first, then others
        const popularSet = new Set(POPULAR_MODELS);
        const sortedModels = [...allModels].sort((a, b) => {
          const aIsPopular = popularSet.has(a.id);
          const bIsPopular = popularSet.has(b.id);
          if (aIsPopular && !bIsPopular) return -1;
          if (!aIsPopular && bIsPopular) return 1;
          if (aIsPopular && bIsPopular) {
            const aIndex = POPULAR_MODELS.indexOf(a.id);
            const bIndex = POPULAR_MODELS.indexOf(b.id);
            return aIndex - bIndex;
          }
          // Both not popular - sort by vendor then name
          if (a.vendor !== b.vendor) return a.vendor.localeCompare(b.vendor);
          return a.name.localeCompare(b.name);
        });
        setModels(sortedModels);
        setFilteredModels(sortedModels);
      } catch (err) {
        console.error('Failed to load pricing:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPricing();
  }, []);

  // Filter models based on search
  useEffect(() => {
    if (!modelSearch.trim()) {
      setFilteredModels(models);
    } else {
      const search = modelSearch.toLowerCase();
      const filtered = models.filter(
        (model) =>
          model.name.toLowerCase().includes(search) ||
          model.vendor.toLowerCase().includes(search) ||
          model.id.toLowerCase().includes(search)
      );
      setFilteredModels(filtered);
    }
  }, [modelSearch, models]);

  // Check if JSON textarea content overflows
  useEffect(() => {
    const checkOverflow = () => {
      if (jsonTextareaRef.current) {
        const textarea = jsonTextareaRef.current;
        // Check if scrollHeight is greater than clientHeight (content overflows)
        const overflows = textarea.scrollHeight > textarea.clientHeight;
        setJsonOverflows(overflows);
      }
    };

    // Check overflow after content changes
    checkOverflow();
    
    // Also check after a small delay to ensure DOM has updated
    const timeoutId = setTimeout(checkOverflow, 100);
    
    return () => clearTimeout(timeoutId);
  }, [jsonInput, jsonExpanded]);

  const currentModel = models.find(m => m.id === selectedModel);

  const handleCalculate = () => {
    setError('');
    setComparison(null);

    if (!jsonInput.trim()) {
      setError('Please enter some JSON data');
      return;
    }

    try {
      const data = JSON.parse(jsonInput);
      const toon = encode(data);
      setToonOutput(toon);
      const result = compareTokens(jsonInput, toon);
      setComparison(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
      setToonOutput('');
    }
  };

  const handleLoadExample = () => {
    const formatted = JSON.stringify(exampleData, null, 2);
    setJsonInput(formatted);
    setError('');
    setComparison(null);
    setToonOutput('');
  };

  const handleClear = () => {
    setJsonInput('');
    setToonOutput('');
    setError('');
    setComparison(null);
  };

  const handleCopyToon = async () => {
    if (toonOutput) {
      await navigator.clipboard.writeText(toonOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Free Token Savings Calculator</span>
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight">
          Calculate Your{' '}
          <span className="underline decoration-4 decoration-foreground/30">
            Token Savings
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Convert JSON to TOON format and see how much you can save on LLM costs
        </p>
      </motion.div>

      {/* Model Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-2 backdrop-blur-xl bg-card/70 shadow-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Select LLM Model
            </CardTitle>
            <CardDescription>
              Choose the model you're using to see accurate cost savings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="model-select">Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel} disabled={loading}>
                  <SelectTrigger id="model-select" className="mt-2 w-full border-2 border-foreground bg-background">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent align="start" className="w-[var(--radix-select-trigger-width)]">
                    <div className="p-2 border-b-2 border-foreground sticky top-0 bg-card/95 backdrop-blur-xl z-10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search models..."
                          value={modelSearch}
                          onChange={(e) => setModelSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm border-2 border-foreground rounded-sm focus:outline-none focus:ring-2 focus:ring-foreground bg-background/95 backdrop-blur-sm"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {filteredModels.length > 0 ? (
                        filteredModels.map((model, index) => (
                          <SelectItem key={`${model.id}-${index}`} value={model.id}>
                            <div className="flex items-center gap-2">
                              <span>{model.name}</span>
                              <Badge variant="secondary" className={getVendorColor(model.vendor)}>
                                {model.vendor}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No models found matching "{modelSearch}"
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              
              {currentModel && (
                <motion.div 
                  className="flex items-end gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">Input Price</p>
                    <p className="font-bold text-lg">${currentModel.input}/M tokens</p>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">Output Price</p>
                    <p className="font-bold text-lg">${currentModel.output}/M tokens</p>
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Calculator */}
      <motion.div 
        className="grid lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* JSON Input */}
        <Card className="border-2 backdrop-blur-xl bg-card/70 shadow-xl border-border/50">
          <CardHeader>
            <CardTitle>JSON Input</CardTitle>
            <CardDescription>Paste your JSON data here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 relative">
              <Textarea
                ref={jsonTextareaRef}
                id="json-input"
                placeholder='{"users": [{"id": 1, "name": "Alice"}]}'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className={cn(
                  "font-mono text-sm resize-none overflow-y-auto",
                  jsonExpanded ? "h-[600px]" : "h-[350px]"
                )}
              />
              {jsonOverflows && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setJsonExpanded(!jsonExpanded)}
                    className="bg-background/80 backdrop-blur-sm border border-border hover:bg-background/90"
                  >
                    {jsonExpanded ? (
                      <>
                        <Minimize2 className="h-3 w-3 mr-1" />
                        Collapse
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-3 w-3 mr-1" />
                        Expand
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCalculate} className="flex-1 group" size="lg">
                <Calculator className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Calculate Savings
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={handleLoadExample} variant="outline" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Example
              </Button>
              <Button onClick={handleClear} variant="ghost" size="lg">
                Clear
              </Button>
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* TOON Output */}
        <Card className="border-2 backdrop-blur-xl bg-card/70 shadow-xl border-border/50">
          <CardHeader>
            <CardTitle>TOON Output</CardTitle>
            <CardDescription>Converted to TOON format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 relative">
              <Textarea
                id="toon-output"
                value={toonOutput}
                readOnly
                placeholder="TOON output will appear here..."
                className={cn(
                  "font-mono text-sm resize-none bg-muted/50 overflow-y-auto",
                  toonExpanded ? "h-[600px]" : "h-[350px]"
                )}
              />
              {toonOutput && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setToonExpanded(!toonExpanded)}
                    className="bg-background/80 backdrop-blur-sm border border-border hover:bg-background/90"
                  >
                    {toonExpanded ? (
                      <>
                        <Minimize2 className="h-3 w-3 mr-1" />
                        Collapse
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-3 w-3 mr-1" />
                        Expand
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleCopyToon} 
              variant="outline" 
              className="w-full group"
              size="lg"
              disabled={!toonOutput}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Copy TOON
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {comparison && currentModel && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          >
            <Card className="border-2 border-primary/20 shadow-lg backdrop-blur-xl bg-card/70">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-primary" />
                  <CardTitle>Token Savings Analysis</CardTitle>
                </div>
                <CardDescription>
                  Comparison using {currentModel.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Main Metrics */}
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <motion.div 
                    className="space-y-2 p-4 rounded-lg bg-muted/30 border-2 border-border"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <p className="text-sm text-muted-foreground">JSON Tokens</p>
                    <p className="text-3xl font-bold tabular-nums">
                      <AnimatedNumber value={comparison.jsonTokens} />
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-2 p-4 rounded-lg bg-toon-navy text-white border-2 border-toon-navy"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <p className="text-sm opacity-90">TOON Tokens</p>
                    <p className="text-3xl font-bold tabular-nums">
                      <AnimatedNumber value={comparison.toonTokens} />
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-2 p-4 rounded-lg bg-success/10 border-2 border-success"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <p className="text-sm text-muted-foreground">Tokens Saved</p>
                    <p className="text-3xl font-bold tabular-nums text-success">
                      <AnimatedNumber value={comparison.savedTokens} />
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-2 p-4 rounded-lg bg-success/10 border-2 border-success"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <p className="text-sm text-muted-foreground">Savings</p>
                    <p className="text-3xl font-bold tabular-nums text-success">
                      <AnimatedNumber value={comparison.savedPercentage} decimals={1} />%
                    </p>
                  </motion.div>
                </div>

                {/* Visual Bar */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Token Comparison</span>
                    <span>{comparison.toonTokens} / {comparison.jsonTokens} tokens</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden border-2 border-border">
                    <motion.div 
                      className="h-full bg-toon-navy"
                      initial={{ width: 0 }}
                      animate={{ width: `${(comparison.toonTokens / comparison.jsonTokens) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Cost Analysis */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Cost Analysis</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30 space-y-2 border-2 border-border">
                      <p className="text-sm text-muted-foreground">JSON Cost (Input)</p>
                      <p className="text-2xl font-bold tabular-nums">
                        {formatCurrency(calculateCost(comparison.jsonTokens, currentModel.input))}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-toon-beige space-y-2 border-2 border-toon-beige">
                      <p className="text-sm text-toon-navy/70">TOON Cost (Input)</p>
                      <p className="text-2xl font-bold tabular-nums text-toon-navy">
                        {formatCurrency(calculateCost(comparison.toonTokens, currentModel.input))}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-success/10 space-y-2 border-2 border-success">
                      <p className="text-sm text-muted-foreground">You Save</p>
                      <p className="text-2xl font-bold tabular-nums text-success">
                        {formatCurrency(calculateCost(comparison.savedTokens, currentModel.input))}
                      </p>
                    </div>
                  </div>

                  {/* Scale Estimation */}
                  <div className="p-4 rounded-lg bg-toon-beige/30 border-2 border-toon-beige">
                    <p className="text-sm font-medium mb-3 text-toon-navy">At Scale (1 million requests)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">JSON Total</p>
                        <p className="text-xl font-bold tabular-nums">
                          {formatCurrency(calculateCost(comparison.jsonTokens * 1_000_000, currentModel.input))}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">TOON Savings</p>
                        <p className="text-xl font-bold tabular-nums text-success">
                          {formatCurrency(calculateCost(comparison.savedTokens * 1_000_000, currentModel.input))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="backdrop-blur-xl bg-card/70 shadow-xl border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              About TOON
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Token-Oriented Object Notation (TOON)</strong> is a 
              compact, human-readable format designed to reduce token usage by 30-60% when passing 
              structured data to Large Language Models.
            </p>
            <div className="grid md:grid-cols-3 gap-4 pt-2">
              <motion.div 
                className="space-y-1 p-3 rounded-lg bg-muted/30"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Efficient
                </p>
                <p className="text-xs">Tabular format eliminates repeated keys</p>
              </motion.div>
              <motion.div 
                className="space-y-1 p-3 rounded-lg bg-muted/30"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium text-foreground flex items-center gap-2">
                  📖 Readable
                </p>
                <p className="text-xs">Human-friendly, YAML-like structure</p>
              </motion.div>
              <motion.div 
                className="space-y-1 p-3 rounded-lg bg-muted/30"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium text-foreground flex items-center gap-2">
                  🔒 Schema-Aware
                </p>
                <p className="text-xs">Explicit array lengths and field headers</p>
              </motion.div>
            </div>
            <div className="pt-2">
              <a 
                href="https://github.com/toon-format/toon" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium inline-flex items-center gap-1 group"
              >
                Learn more about TOON
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading LLM pricing data...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
