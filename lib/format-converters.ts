import { encode, decode } from '@toon-format/toon';

/**
 * Convert JSON to TOON format
 */
export function jsonToToon(json: string): string {
  const data = JSON.parse(json);
  return encode(data);
}

/**
 * Convert TOON to JSON format
 */
export function toonToJson(toon: string, pretty = true): string {
  const data = decode(toon);
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}

/**
 * Convert CSV to TOON format
 */
export function csvToToon(csv: string): string {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must have at least a header and one data row');

  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: Record<string, any> = {};
    headers.forEach((header, i) => {
      // Try to parse as number or boolean
      const value = values[i];
      if (value === 'true') obj[header] = true;
      else if (value === 'false') obj[header] = false;
      else if (!isNaN(Number(value)) && value !== '') obj[header] = Number(value);
      else obj[header] = value;
    });
    return obj;
  });

  return encode(rows);
}

/**
 * Convert TOON to CSV format
 */
export function toonToCsv(toon: string): string {
  const data = decode(toon);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('TOON data must be an array with at least one object');
  }

  const headers = Object.keys(data[0]);
  const csvLines = [headers.join(',')];

  data.forEach(obj => {
    const values = headers.map(header => {
      const value = obj[header];
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvLines.push(values.join(','));
  });

  return csvLines.join('\n');
}

/**
 * Convert YAML to TOON format (simplified, supports basic YAML)
 */
export function yamlToToon(yaml: string): string {
  // Simple YAML parser for basic objects and arrays
  const lines = yaml.trim().split('\n');
  let result: any = {};
  let currentArray: any[] = [];
  let currentKey = '';
  let inArray = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('- ')) {
      // Array item
      if (!inArray) {
        inArray = true;
        currentArray = [];
      }
      const value = trimmed.substring(2).trim();
      // Check if it's an object
      if (value.includes(':')) {
        const obj: any = {};
        const pairs = value.split(',');
        pairs.forEach(pair => {
          const [k, v] = pair.split(':').map(s => s.trim());
          obj[k] = parseYamlValue(v);
        });
        currentArray.push(obj);
      } else {
        currentArray.push(parseYamlValue(value));
      }
    } else if (trimmed.includes(':')) {
      if (inArray && currentKey) {
        result[currentKey] = currentArray;
        inArray = false;
      }

      const colonIndex = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (!value) {
        currentKey = key;
      } else {
        result[key] = parseYamlValue(value);
        currentKey = '';
      }
    }
  }

  if (inArray && currentKey) {
    result[currentKey] = currentArray;
  }

  return encode(result);
}

/**
 * Convert TOON to YAML format (simplified)
 */
export function toonToYaml(toon: string): string {
  const data = decode(toon);
  return convertToYaml(data, 0);
}

function convertToYaml(data: any, indent: number): string {
  const spaces = '  '.repeat(indent);
  
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'object' && item !== null) {
        const keys = Object.keys(item);
        const firstLine = `${spaces}- ${keys[0]}: ${formatYamlValue(item[keys[0]])}`;
        const rest = keys.slice(1).map(k => `${spaces}  ${k}: ${formatYamlValue(item[k])}`).join('\n');
        return rest ? `${firstLine}\n${rest}` : firstLine;
      }
      return `${spaces}- ${formatYamlValue(item)}`;
    }).join('\n');
  } else if (typeof data === 'object' && data !== null) {
    return Object.entries(data).map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${spaces}${key}:\n${convertToYaml(value, indent + 1)}`;
      } else if (typeof value === 'object' && value !== null) {
        return `${spaces}${key}:\n${convertToYaml(value, indent + 1)}`;
      }
      return `${spaces}${key}: ${formatYamlValue(value)}`;
    }).join('\n');
  }
  
  return formatYamlValue(data);
}

function formatYamlValue(value: any): string {
  if (typeof value === 'string') return value.includes(':') || value.includes(',') ? `"${value}"` : value;
  if (value === null || value === undefined) return 'null';
  return String(value);
}

function parseYamlValue(value: string): any {
  if (value === 'null') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(Number(value)) && value !== '') return Number(value);
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
  return value;
}

/**
 * Convert XML to TOON format (simplified)
 */
export function xmlToToon(xml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  
  if (doc.querySelector('parsererror')) {
    throw new Error('Invalid XML format');
  }

  const result = xmlNodeToObject(doc.documentElement);
  return encode(result);
}

/**
 * Convert TOON to XML format (simplified)
 */
export function toonToXml(toon: string, rootName = 'root'): string {
  const data = decode(toon);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${objectToXml(data, rootName)}`;
}

function xmlNodeToObject(node: Element): any {
  if (node.children.length === 0) {
    return node.textContent || '';
  }

  const result: any = {};
  const childNodes = Array.from(node.children);

  // Check if all children have the same tag name (array)
  const tagNames = childNodes.map(child => child.tagName);
  const uniqueTags = new Set(tagNames);

  if (uniqueTags.size === 1 && childNodes.length > 1) {
    // It's an array
    const items = childNodes.map(child => xmlNodeToObject(child));
    return items;
  }

  // It's an object
  childNodes.forEach(child => {
    const childObj = xmlNodeToObject(child);
    if (result[child.tagName]) {
      if (!Array.isArray(result[child.tagName])) {
        result[child.tagName] = [result[child.tagName]];
      }
      result[child.tagName].push(childObj);
    } else {
      result[child.tagName] = childObj;
    }
  });

  return result;
}

function objectToXml(data: any, tagName: string, indent = 0): string {
  const spaces = '  '.repeat(indent);
  
  if (Array.isArray(data)) {
    return data.map(item => objectToXml(item, 'item', indent)).join('\n');
  } else if (typeof data === 'object' && data !== null) {
    const entries = Object.entries(data);
    const content = entries.map(([key, value]) => objectToXml(value, key, indent + 1)).join('\n');
    return `${spaces}<${tagName}>\n${content}\n${spaces}</${tagName}>`;
  } else {
    return `${spaces}<${tagName}>${String(data)}</${tagName}>`;
  }
}

/**
 * Convert CSV to JSON format
 */
export function csvToJson(csv: string, pretty = true): string {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must have at least a header and one data row');

  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: Record<string, any> = {};
    headers.forEach((header, i) => {
      const value = values[i];
      if (value === 'true') obj[header] = true;
      else if (value === 'false') obj[header] = false;
      else if (!isNaN(Number(value)) && value !== '') obj[header] = Number(value);
      else obj[header] = value;
    });
    return obj;
  });

  return pretty ? JSON.stringify(rows, null, 2) : JSON.stringify(rows);
}

