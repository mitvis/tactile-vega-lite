import { createSignal, onMount } from 'solid-js';
import { editorState, setEditorState, resetEditorState } from '../store';
import { EditorPanel } from './editor/EditorPanel';
import { RenderPanel } from './render/RenderPanel';
import { parseSpecToState } from '../utils/exampleLoader';
import { introspectDataFromUrl, inferFieldTypes } from '../utils/dataIntrospection';

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

  async function loadExample(exampleName: string) {
    const spec = exampleSpecs[exampleName];
    if (!spec) {
      console.error(`Example spec not found: ${exampleName}`);
      return;
    }

    // Reset to clean state before loading new example
    // This ensures old properties (like theta, filterExpression) are cleared
    resetEditorState();

    // Parse spec to state
    const parsedState = parseSpecToState(spec);

    // Update editor state, handling encodings specially to prevent merging
    Object.entries(parsedState).forEach(([key, value]) => {
      if (key === 'encodings') {
        // Clear whatever encoding channels currently exist in state
        Object.keys(editorState.encodings).forEach(channel => {
          setEditorState('encodings', channel as any, undefined);
        });
        // Then set only the encodings from the new spec
        Object.entries(value || {}).forEach(([channel, encoding]) => {
          setEditorState('encodings', channel as any, encoding as any);
        });
      } else {
        setEditorState(key as any, value as any);
      }
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
