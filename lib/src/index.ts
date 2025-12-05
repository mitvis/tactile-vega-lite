import vegaEmbed from 'vega-embed';
import { modifySvg } from './modules/modifySvg/chartModifier';
import { elaborateTVLSpec } from './modules/modifySpec/elaborateSpec';
import { mergeSpec } from './modules/modifySpec/mergeSpec';
import { selectDefaultSpec } from './modules/modifySpec/selectDefault';
import { updateDefault } from './modules/modifySpec/updateDefault';
import { terminateWorker, setWorkerUrl } from './modules/braille/translateBraille';
import { initSvgPatterns } from './modules/texture/initializeTexture';
import {
  TactileVegaLiteSpec,
  TactileOptions,
  TactileResult,
  TactileVegaLiteError,
  TextureType,
  TextureEncoding,
} from './types';

// Re-export types for consumer convenience
export type {
  TactileVegaLiteSpec,
  TactileOptions,
  TactileResult,
  TextureType,
  TextureEncoding,
};
export { TactileVegaLiteError };

// Re-export worker configuration function
export { setWorkerUrl };

/**
 * Default options for tactile chart generation
 */
const DEFAULT_OPTIONS: Required<Omit<TactileOptions, 'workerUrl' | 'customTextures'>> = {
  brailleFont: 'Swell Braille',
  brailleFontSize: 24,
  ppi: 224,
  embedFonts: true,
};

/**
 * Compile a Tactile Vega-Lite specification into an accessible SVG visualization
 * with braille labels and tactile textures.
 *
 * @param spec - The Tactile Vega-Lite specification
 * @param options - Configuration options for the compilation
 * @returns Promise that resolves to a TactileResult containing the SVG element
 *
 * @example
 * ```typescript
 * import { tactileVegaLite } from 'tactile-vega-lite';
 *
 * const spec = {
 *   data: { values: [{ a: 'A', b: 28 }, { a: 'B', b: 55 }] },
 *   mark: 'bar',
 *   encoding: {
 *     x: { field: 'a', type: 'nominal' },
 *     y: { field: 'b', type: 'quantitative' },
 *     texture: { scale: { range: ['solidGrayFill'] } }
 *   }
 * };
 *
 * const result = await tactileVegaLite(spec);
 * document.body.appendChild(result.svg);
 * ```
 */
export async function tactileVegaLite(
  spec: TactileVegaLiteSpec,
  options: TactileOptions = {}
): Promise<TactileResult> {

  try {
    // Merge user options with defaults
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // Set worker URL if provided
    if (options.workerUrl) {
      setWorkerUrl(options.workerUrl);
    }

    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    try {
      // Clone the spec to avoid mutations
      const TVLSpec = JSON.parse(JSON.stringify(spec));

      // Convert texture encoding to color encoding (Vega-Lite doesn't understand 'texture')
      if (TVLSpec.encoding?.texture) {
        TVLSpec.encoding.color = TVLSpec.encoding.texture;
        delete TVLSpec.encoding.texture;
      }

      // Select and apply default spec based on mark type
      const defaultSpec = selectDefaultSpec(TVLSpec);
      const updatedDefaultSpec = updateDefault(TVLSpec, defaultSpec);
      const mergedSpec = mergeSpec(TVLSpec, updatedDefaultSpec);

      // Elaborate the spec (calculate dimensions, measure braille, set textures)
      let elaboratedTVLSpec;
      try {
        elaboratedTVLSpec = await elaborateTVLSpec(mergedSpec);
      } catch (error) {
        throw new TactileVegaLiteError(
          'Failed to elaborate Tactile Vega-Lite specification',
          error as Error,
          'spec-elaboration'
        );
      }

      // Render with vega-embed
      let result;
      try {
        result = await vegaEmbed(container, elaboratedTVLSpec, {
          renderer: 'svg',
          actions: false,
        });
      } catch (error) {
        console.error('vegaEmbed error:', error);
        throw new TactileVegaLiteError(
          'Failed to render chart with Vega-Embed',
          error as Error,
          'rendering'
        );
      }

      // Apply SVG modifications (braille conversion, textures, etc.)
      try {
        await modifySvg(result, elaboratedTVLSpec);
      } catch (error) {
        throw new TactileVegaLiteError(
          'Failed to apply tactile modifications to SVG',
          error as Error,
          'svg-modification'
        );
      }

      // Terminate worker to clean up resources
      terminateWorker();

      // Extract the SVG element
      const svgElement = container.querySelector('svg');
      if (!svgElement) {
        throw new TactileVegaLiteError('No SVG element found in rendered output');
      }

      // Clone the SVG to detach it from the temporary container
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;

      // Remove temporary container
      document.body.removeChild(container);

      // Return result
      return {
        svg: clonedSvg,
        spec: elaboratedTVLSpec,
        metadata: {
          dimensions: {
            width: svgElement.width.baseVal.value,
            height: svgElement.height.baseVal.value,
          },
        },
      };
    } catch (error) {
      // Clean up container even on error
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      throw error;
    }
  } catch (error) {
    // Re-throw TactileVegaLiteError as-is
    if (error instanceof TactileVegaLiteError) {
      throw error;
    }
    // Wrap other errors
    throw new TactileVegaLiteError(
      'Failed to compile Tactile Vega-Lite specification',
      error as Error
    );
  }
}

/**
 * Get the version of the tactile-vega-lite library
 */
export const VERSION = '0.1.0';
