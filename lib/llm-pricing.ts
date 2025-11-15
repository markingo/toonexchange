export interface LLMModel {
  id: string;
  vendor: string;
  name: string;
  input: number; // Price per 1M tokens
  output: number;
  input_cached: number | null;
}

export interface LLMPricingData {
  updated_at: string;
  prices: LLMModel[];
}

// Popular models to feature (based on OpenRouter popularity and common usage)
export const POPULAR_MODELS = [
  // Top Popular Models
  'gpt-5.1',
  'gpt-5',
  'claude-sonnet-4.5',
  'gemini-2.5-pro-preview-03-25',
  'gemini-2.5-flash',
  'grok-4',
  // OpenAI
  'gpt-4o',
  'gpt-4o-mini',
  'o1-preview',
  'o1-mini',
  'o1-pro',
  'gpt-4-turbo',
  'gpt-4.1',
  'gpt-4.1-mini',
  // Anthropic
  'claude-opus-4',
  'claude-3.5-sonnet',
  'claude-3.5-haiku',
  'claude-4.5-haiku',
  // Google
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  // xAI
  'grok-4-fast',
  'grok-3',
  // DeepSeek
  'deepseek-chat',
  'deepseek-reasoner',
  // Amazon
  'amazon-nova-pro',
  'amazon-nova-lite',
  'amazon-nova-micro',
];

let cachedPricingData: LLMPricingData | null = null;

/**
 * Fetch LLM pricing data from llm-prices.com
 */
export async function fetchLLMPricing(): Promise<LLMPricingData> {
  if (cachedPricingData) {
    return cachedPricingData;
  }

  try {
    const response = await fetch('https://www.llm-prices.com/current-v1.json');
    const data: LLMPricingData = await response.json();
    
    // Deduplicate by ID (keep the first occurrence)
    const seenIds = new Set<string>();
    const uniquePrices = data.prices.filter(model => {
      if (seenIds.has(model.id)) {
        return false;
      }
      seenIds.add(model.id);
      return true;
    });
    
    cachedPricingData = {
      ...data,
      prices: uniquePrices,
    };
    return cachedPricingData;
  } catch (error) {
    console.error('Failed to fetch LLM pricing:', error);
    // Return fallback data with GPT-5.1 pricing
    return {
      updated_at: new Date().toISOString(),
      prices: [
        {
          id: 'gpt-5.1',
          vendor: 'openai',
          name: 'GPT-5.1',
          input: 1.25,
          output: 10.0,
          input_cached: 0.125,
        },
      ],
    };
  }
}

/**
 * Get popular models from the pricing data
 */
export function getPopularModels(pricingData: LLMPricingData): LLMModel[] {
  const popularSet = new Set(POPULAR_MODELS);
  return pricingData.prices
    .filter(model => popularSet.has(model.id))
    .sort((a, b) => {
      const aIndex = POPULAR_MODELS.indexOf(a.id);
      const bIndex = POPULAR_MODELS.indexOf(b.id);
      return aIndex - bIndex;
    });
}

/**
 * Calculate cost for a given token count and model
 */
export function calculateCost(
  tokenCount: number,
  pricePerMillion: number
): number {
  return (tokenCount / 1_000_000) * pricePerMillion;
}

/**
 * Format currency with appropriate precision
 */
export function formatCurrency(amount: number): string {
  if (amount === 0) return '$0.00';
  if (amount < 0.0001) return `$${amount.toExponential(2)}`;
  if (amount < 0.01) return `$${amount.toFixed(6)}`;
  if (amount < 1) return `$${amount.toFixed(4)}`;
  return `$${amount.toFixed(2)}`;
}

/**
 * Get vendor color for badges - Monochrome TOON style
 */
export function getVendorColor(vendor: string): string {
  // All vendors use same monochrome style - only text differs
  return 'bg-foreground/10 text-foreground border border-foreground/20';
}

