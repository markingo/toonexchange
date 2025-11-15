import { encodingForModel } from 'js-tiktoken';

/**
 * Count tokens in a string using GPT-4 tokenizer (cl100k_base)
 */
export function countTokens(text: string): number {
  try {
    const encoding = encodingForModel('gpt-4');
    const tokens = encoding.encode(text);
    return tokens.length;
  } catch (error) {
    console.error('Error counting tokens:', error);
    return 0;
  }
}

/**
 * Calculate token savings between JSON and TOON formats
 */
export interface TokenComparison {
  jsonTokens: number;
  toonTokens: number;
  savedTokens: number;
  savedPercentage: number;
}

export function compareTokens(jsonText: string, toonText: string): TokenComparison {
  const jsonTokens = countTokens(jsonText);
  const toonTokens = countTokens(toonText);
  const savedTokens = jsonTokens - toonTokens;
  const savedPercentage = jsonTokens > 0 ? (savedTokens / jsonTokens) * 100 : 0;

  return {
    jsonTokens,
    toonTokens,
    savedTokens,
    savedPercentage,
  };
}

