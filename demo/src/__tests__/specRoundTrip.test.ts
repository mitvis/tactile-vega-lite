import { describe, test, expect } from 'vitest';
import { parseSpecToState } from '../utils/exampleLoader';
import { buildSpecFromState } from '../utils/specBuilder';
import { TactileVegaLiteSpec } from 'tactile-vega-lite';
import { EditorState } from '../types';

// Import all example specs
import simple_bar_raw from '../specs/simple_bar.tvl.json';
import grouped_bar_horizontal_raw from '../specs/grouped_bar_horizontal.tvl.json';
import grouped_bar_vertical_raw from '../specs/grouped_bar_vertical.tvl.json';
import stacked_bar_raw from '../specs/stacked_bar.tvl.json';
import dual_line_raw from '../specs/dual_line.tvl.json';
import multi_series_raw from '../specs/multi_series.tvl.json';
import pie_raw from '../specs/pie.tvl.json';
import scatter_raw from '../specs/scatter.tvl.json';

const specs: Record<string, TactileVegaLiteSpec> = {
  simple_bar: simple_bar_raw as TactileVegaLiteSpec,
  grouped_bar_horizontal: grouped_bar_horizontal_raw as TactileVegaLiteSpec,
  grouped_bar_vertical: grouped_bar_vertical_raw as TactileVegaLiteSpec,
  stacked_bar: stacked_bar_raw as TactileVegaLiteSpec,
  dual_line: dual_line_raw as TactileVegaLiteSpec,
  multi_series: multi_series_raw as TactileVegaLiteSpec,
  pie: pie_raw as TactileVegaLiteSpec,
  scatter: scatter_raw as TactileVegaLiteSpec,
};

/**
 * Normalize a spec for comparison by removing undefined values
 * and sorting arrays where order doesn't matter
 */
function normalizeSpec(spec: any): any {
  if (spec === null || spec === undefined) {
    return spec;
  }

  if (Array.isArray(spec)) {
    return spec.map(normalizeSpec);
  }

  if (typeof spec === 'object') {
    const normalized: any = {};
    for (const [key, value] of Object.entries(spec)) {
      if (value !== undefined) {
        normalized[key] = normalizeSpec(value);
      }
    }
    return normalized;
  }

  return spec;
}

describe('Spec Round-Trip Tests', () => {
  Object.entries(specs).forEach(([name, originalSpec]) => {
    test(`${name}: spec -> state -> spec should match original`, () => {
      // Step 1: Parse spec to editor state
      const editorState = parseSpecToState(originalSpec);

      // Step 2: Build spec from editor state
      // We need to create a minimal EditorState object with defaults
      const fullState: Partial<EditorState> = {
        chartType: 'bar',
        title: '',
        dataSource: 'url',
        dataUrl: '',
        inlineDataFormat: 'json',
        inlineDataText: '',
        parsedData: null,
        dataFields: null,
        filterExpression: null,
        mark: { type: 'bar' },
        encodings: {},
        showJsonViewer: false,
        isLoadingData: false,
        dataError: null,
        // Override with parsed state
        ...editorState,
      };

      const rebuiltSpec = buildSpecFromState(fullState as EditorState);

      // Step 3: Compare normalized versions
      const normalizedOriginal = normalizeSpec(originalSpec);
      const normalizedRebuilt = normalizeSpec(rebuiltSpec);

      // Debug output on failure
      if (JSON.stringify(normalizedOriginal) !== JSON.stringify(normalizedRebuilt)) {
        console.log('\n========================================');
        console.log(`MISMATCH in ${name}:`);
        console.log('Original:', JSON.stringify(normalizedOriginal, null, 2));
        console.log('Rebuilt:', JSON.stringify(normalizedRebuilt, null, 2));
        console.log('========================================\n');
      }

      expect(normalizedRebuilt).toEqual(normalizedOriginal);
    });
  });
});
