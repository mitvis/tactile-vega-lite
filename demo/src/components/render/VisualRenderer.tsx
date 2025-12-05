import { createEffect } from 'solid-js';
import vegaEmbed from 'vega-embed';
import { TactileVegaLiteSpec } from 'tactile-vega-lite';

interface VisualRendererProps {
  spec: TactileVegaLiteSpec | null;
}

export function VisualRenderer(props: VisualRendererProps) {
  let containerRef: HTMLDivElement | undefined;

  // Render whenever the spec prop changes
  createEffect(() => {
    const spec = props.spec;
    console.log('VisualRenderer: spec changed', spec, 'containerRef:', containerRef);
    if (spec && containerRef) {
      renderVegaLiteChart(spec);
    }
  });

  function renderVegaLiteChart(spec: any) {
    if (!containerRef) return;

    try {
      // Clone spec to avoid mutation
      const VLSpec = JSON.parse(JSON.stringify(spec));

      // Convert texture encoding to color for standard Vega-Lite
      if (VLSpec.encoding?.texture) {
        VLSpec.encoding.color = VLSpec.encoding.texture;
        delete VLSpec.encoding.texture;
      }

      // Remove texture-specific range values
      if (
        VLSpec.encoding?.color &&
        VLSpec.encoding.color.scale &&
        VLSpec.encoding.color.scale.range
      ) {
        delete VLSpec.encoding.color.scale.range;
      }

      vegaEmbed(containerRef, VLSpec, { renderer: 'svg', actions: false })
        .then(() => {
          console.log('Visual chart rendered successfully');
        })
        .catch((error) => {
          console.error('Error rendering visual chart:', error);
        });
    } catch (error) {
      console.error('Error preparing visual chart spec:', error);
    }
  }

  return (
    <div class="renderer-section">
      <h2>Visual Renderer</h2>
      <div ref={containerRef} class="vega-container"></div>
    </div>
  );
}
