import { TactileVegaLiteSpec } from 'tactile-vega-lite';
import {
  EditorState,
  ChartType,
  ChannelEncoding,
  TextureChannelEncoding,
  StrokeDashEncoding,
  SimpleChannelEncoding,
  ShapeEncoding,
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

  // Title - always use string format
  if (spec.title) {
    if (typeof spec.title === 'string') {
      state.title = spec.title;
    } else {
      // Extract text from object format
      state.title = (spec.title as any).text || '';
    }
  } else {
    state.title = '';
  }

  // Top-level spec properties - store directly in state
  if ((spec as any).description) {
    state.description = (spec as any).description;
  }
  if ((spec as any).width) {
    state.width = (spec as any).width;
  }
  if ((spec as any).height) {
    state.height = (spec as any).height;
  }
  if ((spec as any).config) {
    state.config = (spec as any).config;
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
    const filterTransforms = (spec.transform as any[]).filter((t: any) => t.filter);

    if (filterTransforms.length === 1) {
      // Single filter - store in filterExpression
      state.filterExpression = filterTransforms[0].filter;
      state.transforms = undefined; // Explicitly clear transforms
    } else if (filterTransforms.length > 1) {
      // Multiple transforms - store entire array and use first filter for UI
      state.filterExpression = filterTransforms[0].filter;
      state.transforms = spec.transform;
    } else {
      state.filterExpression = null;
      state.transforms = undefined; // Explicitly clear transforms
    }
  } else {
    state.filterExpression = null;
    state.transforms = undefined; // Explicitly clear transforms
  }

  // Chart type and mark
  const markType = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type;
  state.chartType = detectChartType(markType);
  state.mark = { type: markType as any };

  // Encodings
  state.encodings = {};

  if (spec.encoding) {
    // Parse all supported channels
    if (spec.encoding.x) {
      state.encodings.x = parseChannelEncoding(spec.encoding.x);
    }

    if (spec.encoding.y) {
      state.encodings.y = parseChannelEncoding(spec.encoding.y);
    }

    if (spec.encoding.theta) {
      state.encodings.theta = parseChannelEncoding(spec.encoding.theta);
    }

    if (spec.encoding.texture) {
      state.encodings.texture = parseTextureEncoding(spec.encoding.texture);
    }

    if (spec.encoding.xOffset) {
      state.encodings.xOffset = parseSimpleChannelEncoding(spec.encoding.xOffset);
    }

    if ((spec.encoding as any).yOffset) {
      state.encodings.yOffset = parseSimpleChannelEncoding((spec.encoding as any).yOffset);
    }

    if (spec.encoding.strokeDash) {
      state.encodings.strokeDash = parseStrokeDashEncoding(spec.encoding.strokeDash);
    }

    if ((spec.encoding as any).shape) {
      state.encodings.shape = parseShapeEncoding((spec.encoding as any).shape);
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

  // Extract axis configuration
  if (encoding.axis) {
    parsed.axis = {
      title: encoding.axis.title,
      staggerLabels: encoding.axis.staggerLabels,
      grid: encoding.axis.grid,
      style: encoding.axis.style,
    };
  }

  // Extract scale configuration
  if (encoding.scale) {
    parsed.scale = {
      zero: encoding.scale.zero,
      domain: encoding.scale.domain,
      range: encoding.scale.range,
    };
  }

  // Extract sort
  if (encoding.sort) {
    parsed.sort = encoding.sort;
  }

  // Extract direct title property
  if (encoding.title) {
    parsed.title = encoding.title;
  }

  // Extract staggerLabel (alternate name)
  if (encoding.staggerLabel !== undefined) {
    parsed.staggerLabel = encoding.staggerLabel;
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

  // Extract legend configuration
  if (encoding.legend) {
    parsed.legend = {
      title: encoding.legend.title,
    };
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

/**
 * Parse a shape encoding
 */
function parseShapeEncoding(encoding: any): ShapeEncoding {
  const parsed: ShapeEncoding = {};

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
      parsed.scale.range = encoding.scale.range;
    }
  }

  // Extract legend configuration
  if (encoding.legend) {
    parsed.legend = {
      title: encoding.legend.title,
    };
  }

  return parsed;
}
