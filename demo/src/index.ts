import { tactileVegaLite, setWorkerUrl } from 'tactile-vega-lite';
import vegaEmbed from 'vega-embed';
import './style.css';
import * as monaco from 'monaco-editor';

document.addEventListener('DOMContentLoaded', async () => {
  setWorkerUrl('/worker.js');

  // List of available chart specs (filenames without extension)
  const exampleCharts = [
    'grouped_bar_horizontal',
    'grouped_bar_vertical',
    'simple_bar',
    'stacked_bar',
    'dual_line',
    'multi_series',
    'pie',
    'scatter',
  ];

  // Map of human-readable names for the example charts
  const chartNames: { [key: string]: string } = {
    simple_bar: 'Simple Bar Chart',
    grouped_bar_vertical: 'Grouped Bar Chart (Vertical)',
    grouped_bar_horizontal: 'Grouped Bar Chart (Horizontal)',
    stacked_bar: 'Stacked Bar Chart',
    dual_line: 'Dual Line Chart',
    multi_series: 'Multi-Series Line Chart',
    pie: 'Pie Chart',
    scatter: 'Scatter Plot',
  };

  const exampleSpecs: Record<string, any> = {
    simple_bar: require('./specs/simple_bar.tvl.json'),
    grouped_bar_horizontal: require('./specs/grouped_bar_horizontal.tvl.json'),
    grouped_bar_vertical: require('./specs/grouped_bar_vertical.tvl.json'),
    stacked_bar: require('./specs/stacked_bar.tvl.json'),
    dual_line: require('./specs/dual_line.tvl.json'),
    multi_series: require('./specs/multi_series.tvl.json'),
    pie: require('./specs/pie.tvl.json'),
    scatter: require('./specs/scatter.tvl.json'),
  };

  const submitButton = document.getElementById('render') as HTMLButtonElement;
  const downloadButton = document.getElementById('download') as HTMLButtonElement;
  const editorContainer = document.getElementById('editorContainer') as HTMLDivElement;

  // Create and populate the chart type selector dropdown
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'controls';

  const selectorLabel = document.createElement('span');
  selectorLabel.className = 'chart-type-label';
  selectorLabel.textContent = 'Chart Type:';

  const chartTypeSelector = document.createElement('select');
  chartTypeSelector.id = 'chartTypeSelector';

  // Add options to the selector
  exampleCharts.forEach((type) => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = chartNames[type] || type;
    chartTypeSelector.appendChild(option);
  });

  selectorContainer.appendChild(selectorLabel);
  selectorContainer.appendChild(chartTypeSelector);

  // Insert the selector before the editor container
  editorContainer.parentElement?.insertBefore(selectorContainer, editorContainer);

  // Initialize with the default chart
  const lastSelectedExample = localStorage.getItem('tvl-selected');
  let currentExample =
    lastSelectedExample && exampleCharts.includes(lastSelectedExample)
      ? lastSelectedExample
      : exampleCharts[0];
  let userTVLSpec = exampleSpecs[currentExample];

  // Initialize Monaco Editor
  const editor = monaco.editor.create(editorContainer, {
    value: JSON.stringify(userTVLSpec, null, 2),
    language: 'json',
    theme: 'vs-light',
    lineNumbers: 'on',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
  });

  // Listen for editor changes and validate JSON
  editor.onDidChangeModelContent(() => {
    const editorValue = editor.getValue();
    try {
      JSON.parse(editorValue);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  });

  // Function to render the visual chart (standard Vega-Lite for reference)
  function renderVegaLiteChart(spec: any) {
    const VLSpec = JSON.parse(JSON.stringify(spec));
    if (VLSpec.encoding.texture) {
      VLSpec.encoding.color = VLSpec.encoding.texture;
      delete VLSpec.encoding.texture;
    }

    if (
      VLSpec.encoding.color &&
      VLSpec.encoding.color.scale &&
      VLSpec.encoding.color.scale.range
    ) {
      delete VLSpec.encoding.color.scale.range;
    }

    vegaEmbed('#visual', VLSpec, { renderer: 'svg', actions: false })
      .then(() => {})
      .catch((error) => console.error(error));
  }

  // Function to render the tactile chart using the library
  async function renderTactileChart(spec: any) {
    const tactileContainer = document.getElementById('tactile');
    if (!tactileContainer) {
      console.error('Tactile container not found');
      return;
    }

    try {
      // Clear existing content
      console.log('BEFORE clear. Container has children:', tactileContainer.children.length);
      tactileContainer.innerHTML = '';
      console.log('AFTER clear. Container has children:', tactileContainer.children.length);

      // Use the tactile-vega-lite library
      const result = await tactileVegaLite(spec);
      console.log('AFTER tactileVegaLite call. Container has children:', tactileContainer.children.length);
      console.log('Children at this point:', Array.from(tactileContainer.children).map(c => c.tagName));
      console.log('Got result from tactileVegaLite:', result);
      console.log('Result SVG type:', result.svg.constructor.name, result.svg.tagName);

      // Append the SVG to the container
      tactileContainer.appendChild(result.svg);
      console.log('AFTER append. Container now has children:', tactileContainer.children.length);
      console.log('Children are:', Array.from(tactileContainer.children).map(c => c.tagName));

      console.log('Tactile chart rendered successfully');
    } catch (error) {
      console.error('Error rendering tactile chart:', error);
      tactileContainer.innerHTML = `<p style="color: red;">Error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }</p>`;
    }
  }

  // Function to download the SVG
  function downloadSVG() {
    const svgElement = document.querySelector('#tactile svg');
    if (!svgElement) {
      console.error('SVG not found');
      return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tactile-${currentExample}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Handle chart type selection change
  chartTypeSelector.addEventListener('change', async () => {
    currentExample = chartTypeSelector.value;
    userTVLSpec = exampleSpecs[currentExample];

    if (userTVLSpec) {
      editor.setValue(JSON.stringify(userTVLSpec, null, 2));

      // Render both charts with the new spec
      renderVegaLiteChart(userTVLSpec);
      await renderTactileChart(userTVLSpec);

      localStorage.setItem('tvl-selected', currentExample);
    } else {
      console.error(`Failed to load chart spec for ${currentExample}`);
    }
  });

  // Handle render button click
  submitButton.addEventListener('click', async () => {
    try {
      const spec = JSON.parse(editor.getValue());
      renderVegaLiteChart(spec);
      await renderTactileChart(spec);
    } catch (error) {
      console.error('Invalid JSON', error);
    }
  });

  // Handle download button click
  downloadButton.addEventListener('click', downloadSVG);

  // Test function to run all specs and report errors
  async function testAllSpecs() {
    console.log('=== Starting test of all example specs ===');
    const results: Record<string, { success: boolean; error?: string }> = {};

    for (const chartType of exampleCharts) {
      console.log(`\nTesting: ${chartNames[chartType] || chartType}`);
      try {
        const spec = exampleSpecs[chartType];
        const result = await tactileVegaLite(spec);
        results[chartType] = { success: true };
        console.log(`✓ ${chartNames[chartType]} - SUCCESS`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        results[chartType] = { success: false, error: errorMsg };
        console.error(`✗ ${chartNames[chartType]} - ERROR:`, errorMsg);
        console.error('Full error:', error);
      }
    }

    // Summary
    console.log('\n=== Test Summary ===');
    const successful = Object.values(results).filter(r => r.success).length;
    const failed = exampleCharts.length - successful;
    console.log(`Total: ${exampleCharts.length} | Success: ${successful} | Failed: ${failed}`);

    if (failed > 0) {
      console.log('\nFailed specs:');
      Object.entries(results).forEach(([type, result]) => {
        if (!result.success) {
          console.log(`  - ${chartNames[type]}: ${result.error}`);
        }
      });
    }

    return results;
  }

  // Add a test button
  const testButton = document.createElement('button');
  testButton.textContent = 'Test All Specs';
  testButton.style.marginLeft = '10px';
  testButton.addEventListener('click', testAllSpecs);
  downloadButton.parentElement?.insertBefore(testButton, downloadButton.nextSibling);

  // Initial render
  if (userTVLSpec) {
    renderVegaLiteChart(userTVLSpec);
    await renderTactileChart(userTVLSpec);
  }
});
