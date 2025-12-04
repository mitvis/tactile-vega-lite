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
 * Base channel encoding
 */
export interface ChannelEncoding {
  field: string | null;
  type: FieldType | null;
  aggregate?: AggregateFunction;
  timeUnit?: TimeUnit;
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
  strokeDash?: StrokeDashEncoding;
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

  // UI state
  showJsonViewer: boolean;
  isLoadingData: boolean;
  dataError: string | null;

  // Generated spec (derived)
  generatedSpec: TactileVegaLiteSpec | null;
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
  strokeDash: boolean;
}

/**
 * Example spec metadata
 */
export interface ExampleSpec {
  name: string;
  filename: string;
  spec: TactileVegaLiteSpec;
}
