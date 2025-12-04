import { createEffect, on, Show, createSignal } from 'solid-js';
import { tactileVegaLite } from 'tactile-vega-lite';
import { editorState } from '../../store';
import { Button } from '../atoms/Button';

export function TactileRenderer() {
  let containerRef: HTMLDivElement | undefined;
  const [isRendering, setIsRendering] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  // Render whenever the spec changes
  createEffect(
    on(
      () => editorState.generatedSpec,
      (spec) => {
        if (spec && containerRef) {
          renderTactileChart(spec);
        }
      }
    )
  );

  async function renderTactileChart(spec: any) {
    if (!containerRef) return;

    setIsRendering(true);
    setError(null);

    try {
      // Clear existing content
      containerRef.innerHTML = '';

      // Use the tactile-vega-lite library
      const result = await tactileVegaLite(spec);

      // Append the SVG to the container
      containerRef.appendChild(result.svg);

      console.log('Tactile chart rendered successfully');
    } catch (err) {
      console.error('Error rendering tactile chart:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      containerRef.innerHTML = `<p class="error-message">Error: ${errorMessage}</p>`;
    } finally {
      setIsRendering(false);
    }
  }

  function downloadSVG() {
    const svgElement = containerRef?.querySelector('svg');
    if (!svgElement) {
      console.error('SVG not found');
      return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tactile-chart.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div class="renderer-section">
      <h2>Tactile Renderer</h2>

      <Show when={isRendering()}>
        <div class="loading-message">Rendering tactile chart...</div>
      </Show>

      <div ref={containerRef} class="tactile-container"></div>

      <Show when={!error() && containerRef?.querySelector('svg')}>
        <Button onClick={downloadSVG} variant="secondary">
          Download Tactile SVG
        </Button>
      </Show>
    </div>
  );
}
