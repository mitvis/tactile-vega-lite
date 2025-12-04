import Papa from 'papaparse';
import { FieldInfo, FieldType, InlineDataFormat } from '../types';

/**
 * Introspect data from a URL
 * Fetches the data and infers field types
 */
export async function introspectDataFromUrl(url: string): Promise<{
  fields: FieldInfo[];
  data: any[];
}> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    let data: any[];

    if (contentType.includes('json') || url.endsWith('.json')) {
      data = await response.json();
      // Handle case where data is wrapped in an object
      if (!Array.isArray(data)) {
        data = [data];
      }
    } else {
      // Assume CSV
      const text = await response.text();
      const result = Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
      if (result.errors && result.errors.length > 0) {
        throw new Error(`CSV parse error: ${result.errors[0].message}`);
      }
      data = result.data;
    }

    // Only analyze first 100 rows for performance
    const sample = data.slice(0, 100);
    const fields = inferFieldTypes(sample);

    return { fields, data };
  } catch (error) {
    console.error('Error introspecting data:', error);
    throw new Error(
      `Failed to load data from ${url}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Parse inline data (CSV or JSON text)
 */
export function parseInlineData(
  text: string,
  format: InlineDataFormat
): any[] {
  if (!text || text.trim() === '') {
    throw new Error('Data text is empty');
  }

  try {
    if (format === 'json') {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [parsed];
    } else {
      // CSV
      const result = Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message);
      }
      return result.data;
    }
  } catch (error) {
    console.error('Error parsing inline data:', error);
    throw new Error(
      `Failed to parse ${format.toUpperCase()} data: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Infer field types from sample data
 */
export function inferFieldTypes(data: any[]): FieldInfo[] {
  if (!data || data.length === 0) {
    return [];
  }

  const sample = data[0];
  const fields: FieldInfo[] = [];

  for (const [key, value] of Object.entries(sample)) {
    let inferredType: FieldType = 'nominal';

    // Infer type based on value
    if (typeof value === 'number') {
      inferredType = 'quantitative';
    } else if (value instanceof Date) {
      inferredType = 'temporal';
    } else if (typeof value === 'string' && isDateString(value)) {
      inferredType = 'temporal';
    } else if (typeof value === 'string' && data.length > 1) {
      // Check if values repeat (suggests nominal/ordinal)
      const uniqueValues = new Set(data.map((d) => d[key]));
      // If most values are unique, might be ordinal or just nominal
      inferredType = 'nominal';
    }

    fields.push({ name: key, inferredType });
  }

  return fields;
}

/**
 * Check if a string value represents a date
 */
function isDateString(value: string): boolean {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Get unique values for a field from data
 * Useful for populating domain arrays
 */
export function getUniqueValues(data: any[], fieldName: string): string[] {
  if (!data || data.length === 0) return [];

  const uniqueValues = new Set<string>();
  data.forEach((row) => {
    const value = row[fieldName];
    if (value !== null && value !== undefined) {
      uniqueValues.add(String(value));
    }
  });

  return Array.from(uniqueValues);
}
