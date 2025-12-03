import { TopLevelSpec } from 'vega-lite';

/**
 * Available tactile texture patterns for charts
 */
export type TextureType =
  | 'noFill'
  | 'solidGrayFill'
  | 'denseDottedFill'
  | 'dottedFill'
  | 'verticalFill'
  | 'horizontalFill'
  | 'diagonalLeftFill'
  | 'diagonalRightFill'
  | 'diamondFill'
  | 'crossFill';

/**
 * Texture encoding for tactile charts
 */
export interface TextureEncoding {
  field?: string;
  type?: 'nominal' | 'ordinal' | 'quantitative' | 'temporal';
  scale?: {
    range?: TextureType[];
  };
}

/**
 * Tactile Vega-Lite Specification
 * Extends standard Vega-Lite spec with tactile-specific encodings
 */
export interface TactileVegaLiteSpec extends Omit<TopLevelSpec, 'encoding'> {
  encoding?: {
    x?: any;
    y?: any;
    color?: any;
    texture?: TextureEncoding;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Configuration options for tactile chart generation
 */
export interface TactileOptions {
  /**
   * URL to the braille translation worker
   * Defaults to CDN URL: https://cdn.jsdelivr.net/npm/tactile-vega-lite@{version}/dist/worker.min.js
   */
  workerUrl?: string;

  /**
   * Braille font family to use for labels
   * @default "Swell Braille"
   */
  brailleFont?: string;

  /**
   * Font size for braille text
   * @default 24
   */
  brailleFontSize?: number;

  /**
   * Pixels per inch for the output device
   * @default 224
   */
  ppi?: number;

  /**
   * Whether to embed fonts in the SVG output
   * @default true
   */
  embedFonts?: boolean;

  /**
   * Custom texture assignments (overrides automatic texture generation)
   */
  customTextures?: Record<string, TextureType>;
}

/**
 * Result returned from tactileVegaLite function
 */
export interface TactileResult {
  /**
   * The generated SVG element containing the tactile chart
   */
  svg: SVGElement;

  /**
   * The elaborated Vega-Lite specification used to generate the chart
   */
  spec: any;

  /**
   * Metadata about the generated chart
   */
  metadata?: {
    /**
     * Texture assignments used in the chart
     */
    textures?: Record<string, TextureType>;

    /**
     * Dimensions of the generated chart
     */
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

/**
 * Error thrown when tactile chart compilation fails
 */
export class TactileVegaLiteError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
    public readonly phase?: 'spec-elaboration' | 'rendering' | 'svg-modification' | 'braille-translation'
  ) {
    super(message);
    this.name = 'TactileVegaLiteError';
  }
}
