import { TactileVegaLiteSpec } from 'tactile-vega-lite';
import {
  EditorState,
  ChartType,
  ChannelEncoding,
  TextureChannelEncoding,
  StrokeDashEncoding,
  SimpleChannelEncoding,
  FieldType,
  AggregateFunction,
  TimeUnit,
  StrokeDashPattern,
} from '../types';
import { TextureType } from 'tactile-vega-lite';

/**
 * Parse a TactileVegaLiteSpec and convert it to editor state
 * This is the reverse operation of buildSpecFromState
 */
export function parseSpecToState(spec: TactileVegaLiteSpec): Partial<EditorState> {
  const state: Partial<EditorState> = {};

  // Title
  if (spec.title) {
    state.title = typeof spec.title === 'string' ? spec.title : (spec.title as any).text || '';
  } else {
    state.title = '';
  }

  // Data
  if (spec.data) {
    if ('url' in spec.data) {
      state.dataSource = 'url';
      state.dataUrl = spec.data.url as string;
    } else if ('values' in spec.data) {
      state.dataSource = 'inline';
      state.parsedData = Array.isArray(spec.data.values) ? spec.data.values : [];
      state.inlineDataFormat = 'json';
    }
  }

  // Transform (filter)
  if (spec.transform && Array.isArray(spec.transform)) {
    const filterTransform = (spec.transform as any[]).find((t: any) => t.filter);
    if (filterTransform) {
      state.filterExpression = filterTransform.filter;
    }
  }

  // Chart type from mark
  const markType = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type;
  state.chartType = detectChartType(markType);
  state.mark = { type: markType as any };

  // Encodings
  state.encodings = {};

  if (spec.encoding) {
    // X encoding
    if (spec.encoding.x) {
      state.encodings.x = parseChannelEncoding(spec.encoding.x);
    }

    // Y encoding
    if (spec.encoding.y) {
      state.encodings.y = parseChannelEncoding(spec.encoding.y);
    }

    // Theta encoding
    if (spec.encoding.theta) {
      state.encodings.theta = parseChannelEncoding(spec.encoding.theta);
    }

    // Texture encoding
    if (spec.encoding.texture) {
      state.encodings.texture = parseTextureEncoding(spec.encoding.texture);
    }

    // XOffset encoding
    if (spec.encoding.xOffset) {
      state.encodings.xOffset = parseSimpleChannelEncoding(spec.encoding.xOffset);
    }

    // StrokeDash encoding
    if (spec.encoding.strokeDash) {
      state.encodings.strokeDash = parseStrokeDashEncoding(spec.encoding.strokeDash);
    }
  }

  return state;
}

/**
 * Detect chart type from mark type
 */
function detectChartType(markType: any): ChartType {
  if (markType === 'arc') return 'pie';
  if (markType === 'line') return 'line';
  if (markType === 'point') return 'scatter';
  return 'bar';
}

/**
 * Parse a channel encoding (x, y, theta)
 */
function parseChannelEncoding(encoding: any): ChannelEncoding {
  const parsed: ChannelEncoding = {
    field: encoding.field || null,
    type: (encoding.type as FieldType) || null,
  };

  if (encoding.aggregate) {
    parsed.aggregate = encoding.aggregate as AggregateFunction;
  }

  if (encoding.timeUnit) {
    parsed.timeUnit = encoding.timeUnit as TimeUnit;
  }

  return parsed;
}

/**
 * Parse a simple channel encoding (xOffset)
 */
function parseSimpleChannelEncoding(encoding: any): SimpleChannelEncoding {
  return {
    field: encoding.field || null,
    type: (encoding.type as FieldType) || null,
  };
}

/**
 * Parse a texture encoding
 */
function parseTextureEncoding(encoding: any): TextureChannelEncoding {
  const parsed: TextureChannelEncoding = {};

  if (encoding.field) {
    parsed.field = encoding.field;
  }

  if (encoding.type) {
    parsed.type = encoding.type as FieldType;
  }

  if (encoding.scale) {
    parsed.scale = {};
    if (encoding.scale.domain) {
      parsed.scale.domain = encoding.scale.domain;
    }
    if (encoding.scale.range) {
      parsed.scale.range = encoding.scale.range as TextureType[];
    }
  }

  return parsed;
}

/**
 * Parse a stroke dash encoding
 */
function parseStrokeDashEncoding(encoding: any): StrokeDashEncoding {
  const parsed: StrokeDashEncoding = {};

  if (encoding.field) {
    parsed.field = encoding.field;
  }

  if (encoding.type) {
    parsed.type = encoding.type as FieldType;
  }

  if (encoding.scale) {
    parsed.scale = {};
    if (encoding.scale.domain) {
      parsed.scale.domain = encoding.scale.domain;
    }
    if (encoding.scale.range) {
      parsed.scale.range = encoding.scale.range as StrokeDashPattern[];
    }
  }

  return parsed;
}
