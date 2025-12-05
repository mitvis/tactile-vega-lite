import { createEffect, Show, createSignal } from 'solid-js';
import { tactileVegaLite, TactileVegaLiteSpec } from 'tactile-vega-lite';
import { Button } from '../atoms/Button';

interface TactileRendererProps {
  spec: TactileVegaLiteSpec | null;
}

export function TactileRenderer(props: TactileRendererProps) {
  let containerRef: HTMLDivElement | undefined;
  const [isRendering, setIsRendering] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [svgReady, setSvgReady] = createSignal(false);
  let renderCounter = 0;

  // Render whenever the spec prop changes
  createEffect(() => {
    const spec = props.spec;
    if (spec && containerRef) {
      // Increment counter and capture current render number
      renderCounter++;
      const thisRender = renderCounter;

      // Clear container immediately
      containerRef.innerHTML = '';
      setSvgReady(false);

      renderTactileChart(spec, thisRender);
    }
  });

  async function renderTactileChart(spec: any, renderNumber: number) {
    if (!containerRef) return;

    setIsRendering(true);
    setError(null);

    try {
      const result = await tactileVegaLite(spec);

      // Only append if we're still the latest render
      if (renderNumber === renderCounter && containerRef) {
        containerRef.appendChild(result.svg);
        setSvgReady(true);
      }
    } catch (err) {
      console.error('Error rendering tactile chart:', err);
      if (renderNumber === renderCounter) {
        // Get full error message including cause
        let errorMessage = 'Unknown error';
        if (err instanceof Error) {
          errorMessage = err.message;
          // Include cause if available
          if ((err as any).cause) {
            errorMessage += `\nCaused by: ${(err as any).cause.message || (err as any).cause}`;
          }
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        setError(errorMessage);
        setSvgReady(false);
      }
    } finally {
      // ALWAYS clear isRendering, regardless of whether this render is stale
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

      <Show when={error()}>
        <div class="error-message" style="color: red; padding: 10px; background: #ffe6e6; border: 1px solid red; margin: 10px 0;">
          <strong>Error:</strong> {error()}
        </div>
      </Show>

      <div ref={containerRef} class="tactile-container"></div>

      <Show when={svgReady() && !error()}>
        <Button onClick={downloadSVG} variant="secondary">
          Download Tactile SVG
        </Button>
      </Show>
    </div>
  );
}
