import { TextureType } from 'tactile-vega-lite';
import {
  AggregateFunction,
  TimeUnit,
  StrokeDashPattern,
  ChartType,
  EncodingVisibilityMap,
} from '../types';

/**
 * Available texture types for tactile charts
 */
export const TEXTURE_TYPES: TextureType[] = [
  'noFill',
  'solidGrayFill',
  'denseDottedFill',
  'dottedFill',
  'verticalFill',
  'horizontalFill',
  'diagonalLeftFill',
  'diagonalRightFill',
  'diamondFill',
  'crossFill',
];

/**
 * Human-readable labels for texture types
 */
export const TEXTURE_LABELS: Record<TextureType, string> = {
  noFill: 'No Fill',
  solidGrayFill: 'Solid Gray',
  denseDottedFill: 'Dense Dotted',
  dottedFill: 'Dotted',
  verticalFill: 'Vertical Lines',
  horizontalFill: 'Horizontal Lines',
  diagonalLeftFill: 'Diagonal Left',
  diagonalRightFill: 'Diagonal Right',
  diamondFill: 'Diamond',
  crossFill: 'Cross',
};

/**
 * Available aggregation functions
 */
export const AGGREGATE_FUNCTIONS: AggregateFunction[] = [
  'count',
  'sum',
  'mean',
  'average',
  'median',
  'min',
  'max',
  'stdev',
  'variance',
];

/**
 * Available time units
 */
export const TIME_UNITS: TimeUnit[] = [
  'year',
  'month',
  'date',
  'day',
  'hours',
  'minutes',
  'seconds',
];

/**
 * Available stroke dash patterns
 */
export const STROKE_DASH_PATTERNS: StrokeDashPattern[] = [
  'solid',
  'dashed',
  'dotted',
  'longDashed',
];

/**
 * Human-readable labels for stroke dash patterns
 */
export const STROKE_DASH_LABELS: Record<StrokeDashPattern, string> = {
  solid: 'Solid',
  dashed: 'Dashed',
  dotted: 'Dotted',
  longDashed: 'Long Dashed',
};

/**
 * Encoding visibility map - defines which encodings are available for each chart type
 */
export const ENCODING_VISIBILITY: Record<ChartType, EncodingVisibilityMap> = {
  bar: {
    x: true,
    y: true,
    theta: false,
    texture: true,
    xOffset: true,
    strokeDash: false,
  },
  line: {
    x: true,
    y: true,
    theta: false,
    texture: false,
    xOffset: false,
    strokeDash: true,
  },
  scatter: {
    x: true,
    y: true,
    theta: false,
    texture: true,
    xOffset: false,
    strokeDash: false,
  },
  pie: {
    x: false,
    y: false,
    theta: true,
    texture: true,
    xOffset: false,
    strokeDash: false,
  },
};
