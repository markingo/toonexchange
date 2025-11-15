'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchLLMPricing, getVendorColor, type LLMModel } from '@/lib/llm-pricing';

export function ModelComparisonTable() {
  const [models, setModels] = useState<LLMModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'input' | 'output' | 'name'>('input');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    async function loadPricing() {
      try {
        const pricingData = await fetchLLMPricing();
        setModels(pricingData.prices);
      } catch (err) {
        console.error('Failed to load pricing:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPricing();
  }, []);

  const filteredModels = models
    .filter(model =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'input') comparison = a.input - b.input;
      else if (sortBy === 'output') comparison = a.output - b.output;
      else comparison = a.name.localeCompare(b.name);
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (column: 'input' | 'output' | 'name') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <Card className="backdrop-blur-xl bg-card/70 shadow-xl border-border/50">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading LLM pricing data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-xl bg-card/70 shadow-xl border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">LLM Pricing Comparison</CardTitle>
              <CardDescription>
                Compare pricing across {models.length}+ language models (per 1M tokens)
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      Model
                      {sortBy === 'name' && (
                        sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Vendor</th>
                  <th className="text-right py-3 px-4 font-semibold">
                    <button
                      onClick={() => handleSort('input')}
                      className="flex items-center gap-2 ml-auto hover:text-primary transition-colors"
                    >
                      Input Price
                      {sortBy === 'input' && (
                        sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="text-right py-3 px-4 font-semibold">
                    <button
                      onClick={() => handleSort('output')}
                      className="flex items-center gap-2 ml-auto hover:text-primary transition-colors"
                    >
                      Output Price
                      {sortBy === 'output' && (
                        sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="text-right py-3 px-4 font-semibold">Cached Input</th>
                </tr>
              </thead>
              <tbody>
                {filteredModels.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                      No models found matching "{searchTerm}"
                    </td>
                  </tr>
                ) : (
                  filteredModels.slice(0, 50).map((model, index) => (
                    <motion.tr
                      key={`${model.id}-${model.vendor}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.01 }}
                      className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{model.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className={getVendorColor(model.vendor)}>
                          {model.vendor}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        ${model.input.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        ${model.output.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-muted-foreground">
                        {model.input_cached ? `$${model.input_cached.toFixed(2)}` : '—'}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
            {filteredModels.length > 50 && (
              <p className="text-center py-4 text-sm text-muted-foreground">
                Showing top 50 of {filteredModels.length} models
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

