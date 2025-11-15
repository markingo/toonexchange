'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FileJson, 
  FileCode, 
  FileSpreadsheet,
  FileText,
  Code,
  ArrowRight,
  Zap,
  TrendingDown,
  Calculator,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Tool {
  id: string;
  icon: typeof FileJson;
  title: string;
  description: string;
  from: string;
  to: string;
  sourceFormat: string;
  targetFormat: string;
  color: string;
  badge?: string;
}

const tools: Tool[] = [
  {
    id: 'json-to-toon',
    icon: FileJson,
    title: 'JSON to TOON',
    description: 'Convert JSON data to TOON format and save 30-60% tokens',
    from: 'JSON',
    to: 'TOON',
    sourceFormat: 'json',
    targetFormat: 'toon',
    color: 'from-green-500 to-primary',
    badge: 'Popular',
  },
  {
    id: 'toon-to-json',
    icon: FileCode,
    title: 'TOON to JSON',
    description: 'Convert TOON format back to JSON for standard processing',
    from: 'TOON',
    to: 'JSON',
    sourceFormat: 'toon',
    targetFormat: 'json',
    color: 'from-primary to-green-500',
  },
  {
    id: 'csv-to-toon',
    icon: FileSpreadsheet,
    title: 'CSV to TOON',
    description: 'Transform CSV spreadsheet data to TOON format',
    from: 'CSV',
    to: 'TOON',
    sourceFormat: 'csv',
    targetFormat: 'toon',
    color: 'from-blue-500 to-primary',
  },
  {
    id: 'toon-to-csv',
    icon: FileSpreadsheet,
    title: 'TOON to CSV',
    description: 'Export TOON data to CSV for spreadsheet applications',
    from: 'TOON',
    to: 'CSV',
    sourceFormat: 'toon',
    targetFormat: 'csv',
    color: 'from-primary to-blue-500',
  },
  {
    id: 'yaml-to-toon',
    icon: FileText,
    title: 'YAML to TOON',
    description: 'Convert YAML configuration files to TOON format',
    from: 'YAML',
    to: 'TOON',
    sourceFormat: 'yaml',
    targetFormat: 'toon',
    color: 'from-purple-500 to-primary',
  },
  {
    id: 'toon-to-yaml',
    icon: FileText,
    title: 'TOON to YAML',
    description: 'Export TOON data to YAML configuration format',
    from: 'TOON',
    to: 'YAML',
    sourceFormat: 'toon',
    targetFormat: 'yaml',
    color: 'from-primary to-purple-500',
  },
  {
    id: 'xml-to-toon',
    icon: Code,
    title: 'XML to TOON',
    description: 'Transform XML documents to TOON format',
    from: 'XML',
    to: 'TOON',
    sourceFormat: 'xml',
    targetFormat: 'toon',
    color: 'from-orange-500 to-primary',
  },
  {
    id: 'toon-to-xml',
    icon: Code,
    title: 'TOON to XML',
    description: 'Convert TOON data back to XML document format',
    from: 'TOON',
    to: 'XML',
    sourceFormat: 'toon',
    targetFormat: 'xml',
    color: 'from-primary to-orange-500',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Instant Conversion',
    description: '100% client-side processing for maximum speed and privacy',
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    icon: TrendingDown,
    title: 'Token Reduction',
    description: 'Save 30-60% on LLM API costs with optimized format',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    icon: Calculator,
    title: 'Real-time Analysis',
    description: 'Instant token count comparison and savings calculation',
    color: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: RefreshCw,
    title: 'Bidirectional',
    description: 'Convert to and from TOON format seamlessly',
    color: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: CheckCircle,
    title: 'No Data Collection',
    description: 'Zero tracking, zero storage, complete privacy',
    color: 'text-pink-600 dark:text-pink-400',
  },
  {
    icon: FileCode,
    title: 'Multiple Formats',
    description: 'Support for JSON, CSV, YAML, XML and more',
    color: 'text-primary',
  },
];

export function ToolsGrid() {
  return (
    <div className="w-full space-y-16">
      {/* Tools Section */}
      <section id="tools" className="scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6 mb-12"
        >
          <div className="border-b-2 border-foreground pb-4">
            <h2 className="text-3xl font-bold tracking-tight">
              TOON Conversion Tools
            </h2>
            <p className="text-lg mt-2">
              Free, fast, and secure data format conversion
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link href={`/playground?source=${tool.sourceFormat}&target=${tool.targetFormat}`}>
                  <Card className="group h-full hover:bg-foreground/5 transition-all cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-3 border-2 border-foreground bg-background">
                          <Icon className="w-6 h-6" />
                        </div>
                        {tool.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {tool.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base group-hover:underline">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <span>{tool.from}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <span>{tool.to}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6 mb-12"
        >
          <div className="border-b-2 border-foreground pb-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Built for Developers
            </h2>
            <p className="text-lg mt-2">
              Professional-grade tools with privacy and performance in mind
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 border-2 border-foreground bg-background">
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

