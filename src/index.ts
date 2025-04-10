import vegaEmbed from 'vega-embed';
import { modifySvg } from './modules/modifySvg/chartModifier';
import './style.css';
import { elaborateTVLSpec } from './modules/modifySpec/elaborateSpec';
import { mergeSpec } from './modules/modifySpec/mergeSpec';
import { selectDefaultSpec } from './modules/modifySpec/selectDefault';
import { updateDefault } from './modules/modifySpec/updateDefault';
import { terminateWorker } from './modules/braille/translateBraille';
import * as monaco from 'monaco-editor';
import { initSvgPatterns } from './modules/texture/initializeTexture';

document.addEventListener('DOMContentLoaded', async () => {
  // List of available chart specs (filenames without extension)
  const exampleCharts = ['grouped_bar_horizontal', 'grouped_bar_vertical', 'simple_bar', 'stacked_bar', 'dual_line', 'multi_series', 'pie', 'scatter'];

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

  const exampleSpecs: Record<string, string> = {
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
  let currentExample = 'grouped_bar_horizontal';
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

  // Function to render the visual chart
  function renderVegaLiteChart(spec: any) {
    const VLSpec = JSON.parse(JSON.stringify(spec));
    if (VLSpec.encoding.texture) {
      VLSpec.encoding.color = VLSpec.encoding.texture;
      delete VLSpec.encoding.texture;
    }

    if (VLSpec.encoding.color && VLSpec.encoding.color.scale && VLSpec.encoding.color.scale.range) {
      delete VLSpec.encoding.color.scale.range;
    }

    vegaEmbed('#visual', VLSpec, { renderer: 'svg', actions: false })
      .then(() => {})
      .catch((error) => console.error(error));
  }

  // Function to render the tactile chart
  async function renderTactileChart(spec: any) {
    initSvgPatterns();
    const TVLSpec = JSON.parse(JSON.stringify(spec));

    if (TVLSpec.encoding.texture) {
      TVLSpec.encoding.color = TVLSpec.encoding.texture;
      delete TVLSpec.encoding.texture;
    }

    const defaultSpec = selectDefaultSpec(TVLSpec);
    const updatedDefaultSpec = updateDefault(TVLSpec, defaultSpec);
    const mergedSpec = mergeSpec(TVLSpec, updatedDefaultSpec);

    try {
      const elaboratedTVLSpec = await elaborateTVLSpec(mergedSpec);
      const result = await vegaEmbed('#tactile', elaboratedTVLSpec, { renderer: 'svg', actions: false });
      await modifySvg(result, elaboratedTVLSpec);
      terminateWorker();
    } catch (error) {
      console.error('Error rendering tactile chart:', error);
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
      renderTactileChart(userTVLSpec);
    } else {
      console.error(`Failed to load chart spec for ${currentExample}`);
    }
  });

  // Handle render button click
  submitButton.addEventListener('click', () => {
    try {
      const spec = JSON.parse(editor.getValue());
      renderTactileChart(spec);
      renderVegaLiteChart(spec);
    } catch (error) {
      console.error('Invalid JSON', error);
    }
  });

  // Handle download button click
  downloadButton.addEventListener('click', downloadSVG);

  // Initial render
  if (userTVLSpec) {
    renderVegaLiteChart(userTVLSpec);
    renderTactileChart(userTVLSpec);
  }
});
