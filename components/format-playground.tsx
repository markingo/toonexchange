'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileJson, 
  FileCode, 
  FileSpreadsheet,
  FileText,
  Code,
  Copy,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Upload,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AnimatedNumber } from '@/components/animated-number';
import { countTokens } from '@/lib/token-counter';
import { cn } from '@/lib/utils';
import {
  jsonToToon,
  toonToJson,
  csvToToon,
  toonToCsv,
  yamlToToon,
  toonToYaml,
  xmlToToon,
  toonToXml,
  csvToJson,
} from '@/lib/format-converters';

type Format = 'json' | 'toon' | 'csv' | 'yaml' | 'xml';

interface FormatInfo {
  icon: typeof FileJson;
  label: string;
  color: string;
  example: string;
}

const formatInfo: Record<Format, FormatInfo> = {
  json: {
    icon: FileJson,
    label: 'JSON',
    color: 'text-green-600 dark:text-green-400',
    example: JSON.stringify({
      products: [
        { id: 1, name: 'MacBook Pro', category: 'Laptops', price: 2499, inStock: true, specs: { ram: '16GB', storage: '512GB', processor: 'M3 Pro' } },
        { id: 2, name: 'iPhone 15 Pro', category: 'Phones', price: 999, inStock: true, specs: { storage: '256GB', color: 'Natural Titanium', camera: '48MP' } },
        { id: 3, name: 'AirPods Pro', category: 'Audio', price: 249, inStock: false, specs: { battery: '6h', charging: 'USB-C', noise_cancelling: true } },
        { id: 4, name: 'iPad Air', category: 'Tablets', price: 599, inStock: true, specs: { screen: '10.9"', storage: '128GB', chip: 'M2' } },
        { id: 5, name: 'Apple Watch', category: 'Wearables', price: 399, inStock: true, specs: { size: '45mm', gps: true, cellular: false } }
      ]
    }, null, 2),
  },
  toon: {
    icon: FileCode,
    label: 'TOON',
    color: 'text-primary',
    example: 'products[5]:\n  id,name,category,price,inStock\n  1,MacBook Pro,Laptops,2499,true\n  2,iPhone 15 Pro,Phones,999,true\n  3,AirPods Pro,Audio,249,false\n  4,iPad Air,Tablets,599,true\n  5,Apple Watch,Wearables,399,true',
  },
  csv: {
    icon: FileSpreadsheet,
    label: 'CSV',
    color: 'text-blue-600 dark:text-blue-400',
    example: 'id,name,category,price,inStock\n1,MacBook Pro,Laptops,2499,true\n2,iPhone 15 Pro,Phones,999,true\n3,AirPods Pro,Audio,249,false\n4,iPad Air,Tablets,599,true\n5,Apple Watch,Wearables,399,true',
  },
  yaml: {
    icon: FileText,
    label: 'YAML',
    color: 'text-purple-600 dark:text-purple-400',
    example: 'products:\n  - id: 1\n    name: MacBook Pro\n    category: Laptops\n    price: 2499\n    inStock: true\n  - id: 2\n    name: iPhone 15 Pro\n    category: Phones\n    price: 999\n    inStock: true\n  - id: 3\n    name: AirPods Pro\n    category: Audio\n    price: 249\n    inStock: false',
  },
  xml: {
    icon: Code,
    label: 'XML',
    color: 'text-orange-600 dark:text-orange-400',
    example: '<products>\n  <product>\n    <id>1</id>\n    <name>MacBook Pro</name>\n    <category>Laptops</category>\n    <price>2499</price>\n    <inStock>true</inStock>\n  </product>\n  <product>\n    <id>2</id>\n    <name>iPhone 15 Pro</name>\n    <category>Phones</category>\n    <price>999</price>\n    <inStock>true</inStock>\n  </product>\n</products>',
  },
};

export function FormatPlayground({ initialSource, initialTarget }: { initialSource?: string, initialTarget?: string } = {}) {
  const [sourceFormat, setSourceFormat] = useState<Format>((initialSource as Format) || 'json');
  const [targetFormat, setTargetFormat] = useState<Format>((initialTarget as Format) || 'toon');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [tokens, setTokens] = useState({ input: 0, output: 0, saved: 0, percentage: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [inputExpanded, setInputExpanded] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const [inputOverflows, setInputOverflows] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleConvert = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter some data to convert');
      return;
    }

    try {
      let result = '';

      // Convert source to TOON first (if not already)
      let toonData = '';
      switch (sourceFormat) {
        case 'json':
          toonData = jsonToToon(input);
          break;
        case 'csv':
          toonData = csvToToon(input);
          break;
        case 'yaml':
          toonData = yamlToToon(input);
          break;
        case 'xml':
          toonData = xmlToToon(input);
          break;
        case 'toon':
          toonData = input;
          break;
      }

      // Convert TOON to target format
      switch (targetFormat) {
        case 'json':
          result = toonToJson(toonData);
          break;
        case 'csv':
          result = toonToCsv(toonData);
          break;
        case 'yaml':
          result = toonToYaml(toonData);
          break;
        case 'xml':
          result = toonToXml(toonData);
          break;
        case 'toon':
          result = toonData;
          break;
      }

      setOutput(result);

      // Calculate tokens
      const inputTokens = countTokens(input);
      const outputTokens = countTokens(result);
      const savedTokens = inputTokens - outputTokens;
      const savedPercentage = inputTokens > 0 ? (savedTokens / inputTokens) * 100 : 0;

      setTokens({
        input: inputTokens,
        output: outputTokens,
        saved: savedTokens,
        percentage: savedPercentage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLoadExample = () => {
    setInput(formatInfo[sourceFormat].example);
    setError('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInput(text);
        setError('');
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInput(text);
        setError('');
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsText(file);
    }
  };

  // Check if input textarea content overflows
  useEffect(() => {
    const checkOverflow = () => {
      if (inputTextareaRef.current) {
        const textarea = inputTextareaRef.current;
        const overflows = textarea.scrollHeight > textarea.clientHeight;
        setInputOverflows(overflows);
      }
    };

    checkOverflow();
    const timeoutId = setTimeout(checkOverflow, 100);
    
    return () => clearTimeout(timeoutId);
  }, [input, inputExpanded]);

  const formats: Format[] = ['json', 'toon', 'csv', 'yaml', 'xml'];

  return (
    <div className="w-full space-y-6">
      {/* Format Selector */}
      <Card className="border-2 backdrop-blur-xl bg-card/70 shadow-xl border-border/50">
        <CardHeader>
          <CardTitle>Format Comparison Playground</CardTitle>
          <CardDescription>
            Convert between JSON, TOON, CSV, YAML, and XML with real-time token analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Source Format */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Source Format</label>
              <div className="grid grid-cols-3 xs:grid-cols-5 gap-2">
                {formats.map((format) => {
                  const Icon = formatInfo[format].icon;
                  return (
                    <motion.button
                      key={format}
                      onClick={() => setSourceFormat(format)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        sourceFormat === format
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${sourceFormat === format ? formatInfo[format].color : 'text-muted-foreground'}`} />
                      <span className="text-[10px] sm:text-xs font-medium">{formatInfo[format].label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Target Format */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Target Format</label>
              <div className="grid grid-cols-3 xs:grid-cols-5 gap-2">
                {formats.map((format) => {
                  const Icon = formatInfo[format].icon;
                  return (
                    <motion.button
                      key={format}
                      onClick={() => setTargetFormat(format)}
                      className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-lg border-2 transition-all ${
                        targetFormat === format
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${targetFormat === format ? formatInfo[format].color : 'text-muted-foreground'}`} />
                      <span className="text-[10px] sm:text-xs font-medium">{formatInfo[format].label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="border-2 backdrop-blur-xl bg-card/70 shadow-xl border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = formatInfo[sourceFormat].icon;
                  return <Icon className={`w-5 h-5 ${formatInfo[sourceFormat].color}`} />;
                })()}
                <CardTitle>{formatInfo[sourceFormat].label} Input</CardTitle>
              </div>
              <Badge variant="secondary" className="tabular-nums">
                {tokens.input > 0 && <><AnimatedNumber value={tokens.input} /> tokens</>}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative ${isDragging ? 'ring-2 ring-primary rounded-lg' : ''}`}
            >
              <Textarea
                ref={inputTextareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Enter ${formatInfo[sourceFormat].label} data or drag & drop a file...`}
                className={cn(
                  "font-mono text-sm resize-none overflow-y-auto",
                  inputExpanded ? "h-[600px]" : "h-[300px]"
                )}
              />
              {inputOverflows && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInputExpanded(!inputExpanded)}
                    className="bg-background/80 backdrop-blur-sm border border-border hover:bg-background/90"
                  >
                    {inputExpanded ? (
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
              {isDragging && (
                <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-lg flex items-center justify-center pointer-events-none z-20">
                  <p className="text-primary font-medium">Drop file here</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,.csv,.yaml,.yml,.xml,.txt,.toon"
              className="hidden"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleConvert} className="flex-1 group">
                Convert
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={handleLoadExample} variant="outline">
                Example
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload
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

        {/* Output */}
        <Card className="border-2 backdrop-blur-xl bg-card/70 shadow-xl border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = formatInfo[targetFormat].icon;
                  return <Icon className={`w-5 h-5 ${formatInfo[targetFormat].color}`} />;
                })()}
                <CardTitle>{formatInfo[targetFormat].label} Output</CardTitle>
              </div>
              <Badge 
                variant="secondary" 
                className={`tabular-nums ${tokens.saved > 0 ? 'bg-accent/10 text-foreground' : ''}`}
              >
                {tokens.output > 0 && <><AnimatedNumber value={tokens.output} /> tokens</>}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                value={output}
                readOnly
                placeholder={`${formatInfo[targetFormat].label} output will appear here...`}
                className={cn(
                  "font-mono text-sm resize-none bg-muted/50 overflow-y-auto",
                  outputExpanded ? "h-[600px]" : "h-[300px]"
                )}
              />
              {output && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOutputExpanded(!outputExpanded)}
                    className="bg-background/80 backdrop-blur-sm border border-border hover:bg-background/90"
                  >
                    {outputExpanded ? (
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
              onClick={handleCopy}
              variant="outline"
              className="w-full group"
              disabled={!output}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-foreground" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Copy Output
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Token Analysis */}
      <AnimatePresence>
        {output && tokens.saved !== 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <Card className="border-2 backdrop-blur-xl bg-card/70 shadow-xl border-border/50">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border-2 border-border">
                    <p className="text-sm text-muted-foreground">Input Tokens</p>
                    <p className="text-2xl font-bold tabular-nums">
                      <AnimatedNumber value={tokens.input} />
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-toon-navy text-white border-2 border-toon-navy">
                    <p className="text-sm opacity-90">Output Tokens</p>
                    <p className="text-2xl font-bold tabular-nums">
                      <AnimatedNumber value={tokens.output} />
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg border-2 ${
                    tokens.saved > 0 
                      ? 'bg-success/10 border-success' 
                      : tokens.saved < 0 
                      ? 'bg-destructive/10 border-destructive'
                      : 'bg-muted/30 border-border'
                  }`}>
                    <p className="text-sm text-muted-foreground">Token Difference</p>
                    <p className={`text-2xl font-bold tabular-nums ${
                      tokens.saved > 0 
                        ? 'text-success' 
                        : tokens.saved < 0 
                        ? 'text-destructive'
                        : 'text-foreground'
                    }`}>
                      {tokens.saved > 0 ? '-' : tokens.saved < 0 ? '+' : ''}<AnimatedNumber value={Math.abs(tokens.saved)} />
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg border-2 ${
                    tokens.percentage > 0 
                      ? 'bg-success/10 border-success' 
                      : tokens.percentage < 0 
                      ? 'bg-destructive/10 border-destructive'
                      : 'bg-muted/30 border-border'
                  }`}>
                    <p className="text-sm text-muted-foreground">Percentage</p>
                    <p className={`text-2xl font-bold tabular-nums ${
                      tokens.percentage > 0 
                        ? 'text-success' 
                        : tokens.percentage < 0 
                        ? 'text-destructive'
                        : 'text-foreground'
                    }`}>
                      {tokens.percentage > 0 ? '-' : tokens.percentage < 0 ? '+' : ''}<AnimatedNumber value={Math.abs(tokens.percentage)} decimals={1} />%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

