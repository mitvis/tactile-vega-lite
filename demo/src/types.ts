import { TactileVegaLiteSpec, TextureType } from 'tactile-vega-lite';

/**
 * Available chart types in the editor
 */
export type ChartType = 'bar' | 'line' | 'scatter' | 'pie';

/**
 * Field data type
 */
export type FieldType = 'nominal' | 'ordinal' | 'quantitative' | 'temporal';

/**
 * Aggregation functions
 */
export type AggregateFunction =
  | 'count'
  | 'sum'
  | 'mean'
  | 'average'
  | 'median'
  | 'min'
  | 'max'
  | 'stdev'
  | 'variance';

/**
 * Time units for temporal fields
 */
export type TimeUnit =
  | 'year'
  | 'month'
  | 'date'
  | 'day'
  | 'hours'
  | 'minutes'
  | 'seconds';

/**
 * Stroke dash patterns for line charts
 */
export type StrokeDashPattern = 'solid' | 'dashed' | 'dotted' | 'longDashed';

/**
 * Mark types
 */
export type MarkType = 'bar' | 'line' | 'point' | 'arc' | 'rect' | 'area';

/**
 * Data source types
 */
export type DataSourceType = 'url' | 'inline';

/**
 * Inline data format
 */
export type InlineDataFormat = 'csv' | 'json';

/**
 * Field information from data introspection
 */
export interface FieldInfo {
  name: string;
  inferredType: FieldType;
}

/**
 * Axis configuration
 */
export interface AxisConfig {
  title?: string;
  staggerLabels?: boolean | string;
  grid?: boolean;
  style?: string[];
}

/**
 * Scale configuration
 */
export interface ScaleConfig {
  zero?: boolean;
  domain?: string[];
  range?: any[];
}

/**
 * Legend configuration
 */
export interface LegendConfig {
  title?: string;
}

/**
 * Base channel encoding
 */
export interface ChannelEncoding {
  field: string | null;
  type: FieldType | null;
  aggregate?: AggregateFunction;
  timeUnit?: TimeUnit;
  axis?: AxisConfig;
  scale?: ScaleConfig;
  sort?: any;
  title?: string;
  staggerLabel?: boolean;
}

/**
 * Simple channel encoding (no aggregate or timeUnit)
 */
export interface SimpleChannelEncoding {
  field: string | null;
  type?: FieldType | null;
}

/**
 * Texture channel encoding
 */
export interface TextureChannelEncoding {
  field?: string;
  type?: FieldType;
  scale?: {
    domain?: string[];
    range?: TextureType[];
  };
  legend?: LegendConfig;
}

/**
 * Stroke dash channel encoding
 */
export interface StrokeDashEncoding {
  field?: string;
  type?: FieldType;
  scale?: {
    domain?: string[];
    range?: StrokeDashPattern[];
  };
}

/**
 * Shape channel encoding
 */
export interface ShapeEncoding {
  field?: string;
  type?: FieldType;
  scale?: {
    domain?: string[];
    range?: string[];
  };
  legend?: LegendConfig;
}

/**
 * Mark configuration
 */
export interface MarkConfig {
  type: MarkType;
}

/**
 * All encodings
 */
export interface Encodings {
  x?: ChannelEncoding;
  y?: ChannelEncoding;
  theta?: ChannelEncoding;
  texture?: TextureChannelEncoding;
  xOffset?: SimpleChannelEncoding;
  yOffset?: SimpleChannelEncoding;
  strokeDash?: StrokeDashEncoding;
  shape?: ShapeEncoding;
}

/**
 * Main editor state
 */
export interface EditorState {
  // Chart configuration
  chartType: ChartType;
  title: string;

  // Data source
  dataSource: DataSourceType;
  dataUrl: string;
  inlineDataFormat: InlineDataFormat;
  inlineDataText: string;
  parsedData: any[] | null;
  dataFields: FieldInfo[] | null;

  // Data transforms
  filterExpression: string | null;

  // Mark configuration
  mark: MarkConfig;

  // Encodings
  encodings: Encodings;

  // Top-level spec properties
  description?: string;
  width?: number;
  height?: number;
  config?: any;
  transforms?: any[];

  // UI state
  showJsonViewer: boolean;
  isLoadingData: boolean;
  dataError: string | null;
}

/**
 * Encoding visibility map - defines which encodings are available for each chart type
 */
export interface EncodingVisibilityMap {
  x: boolean;
  y: boolean;
  theta: boolean;
  texture: boolean;
  xOffset: boolean;
  yOffset: boolean;
  strokeDash: boolean;
  shape: boolean;
}

/**
 * Example spec metadata
 */
export interface ExampleSpec {
  name: string;
  filename: string;
  spec: TactileVegaLiteSpec;
}
