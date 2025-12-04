import { createSignal, onMount, createEffect } from 'solid-js';
import { editorState, setEditorState } from '../store';
import { EditorPanel } from './editor/EditorPanel';
import { RenderPanel } from './render/RenderPanel';
import { parseSpecToState } from '../utils/exampleLoader';
import { introspectDataFromUrl, inferFieldTypes } from '../utils/dataIntrospection';
import { buildSpecFromState } from '../utils/specBuilder';

// Import example specs
import simple_bar from '../specs/simple_bar.tvl.json';
import grouped_bar_horizontal from '../specs/grouped_bar_horizontal.tvl.json';
import grouped_bar_vertical from '../specs/grouped_bar_vertical.tvl.json';
import stacked_bar from '../specs/stacked_bar.tvl.json';
import dual_line from '../specs/dual_line.tvl.json';
import multi_series from '../specs/multi_series.tvl.json';
import pie from '../specs/pie.tvl.json';
import scatter from '../specs/scatter.tvl.json';

const exampleSpecs: Record<string, any> = {
  simple_bar,
  grouped_bar_horizontal,
  grouped_bar_vertical,
  stacked_bar,
  dual_line,
  multi_series,
  pie,
  scatter,
};

const chartNames: Record<string, string> = {
  simple_bar: 'Simple Bar Chart',
  grouped_bar_vertical: 'Grouped Bar Chart (Vertical)',
  grouped_bar_horizontal: 'Grouped Bar Chart (Horizontal)',
  stacked_bar: 'Stacked Bar Chart',
  dual_line: 'Dual Line Chart',
  multi_series: 'Multi-Series Line Chart',
  pie: 'Pie Chart',
  scatter: 'Scatter Plot',
};

export function App() {
  const [selectedExample, setSelectedExample] = createSignal('simple_bar');

  onMount(async () => {
    // Load the initial example spec
    await loadExample('simple_bar');
  });

  // Auto-generate spec whenever editor state changes
  createEffect(() => {
    // Track relevant parts of editor state
    const {
      chartType,
      title,
      dataSource,
      dataUrl,
      parsedData,
      filterExpression,
      mark,
      encodings,
    } = editorState;

    // Build spec from current state
    const spec = buildSpecFromState(editorState);
    setEditorState('generatedSpec', spec);
  });

  async function loadExample(exampleName: string) {
    const spec = exampleSpecs[exampleName];
    if (!spec) {
      console.error(`Example spec not found: ${exampleName}`);
      return;
    }

    // Parse spec to state
    const parsedState = parseSpecToState(spec);

    // Update editor state
    Object.entries(parsedState).forEach(([key, value]) => {
      setEditorState(key as any, value as any);
    });

    // Load data if it's a URL
    if (parsedState.dataSource === 'url' && parsedState.dataUrl) {
      try {
        setEditorState('isLoadingData', true);
        const { fields, data } = await introspectDataFromUrl(parsedState.dataUrl);
        setEditorState('dataFields', fields);
        setEditorState('parsedData', data);
      } catch (error) {
        console.error('Error loading data:', error);
        setEditorState('dataError', error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setEditorState('isLoadingData', false);
      }
    } else if (parsedState.parsedData) {
      // For inline data, infer fields
      const fields = inferFieldTypes(parsedState.parsedData);
      setEditorState('dataFields', fields);
    }

    setSelectedExample(exampleName);
  }

  return (
    <div class="app">
      <div class="example-selector">
        <label>Load Example:</label>
        <select
          value={selectedExample()}
          onChange={(e) => loadExample(e.currentTarget.value)}
        >
          {Object.entries(chartNames).map(([key, name]) => (
            <option value={key}>{name}</option>
          ))}
        </select>
      </div>

      <div class="container">
        <div class="item">
          <EditorPanel />
        </div>

        <div class="item">
          <RenderPanel />
        </div>
      </div>
    </div>
  );
}
