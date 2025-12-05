import { TactileVegaLiteSpec } from 'tactile-vega-lite';
import {
  EditorState,
  ChannelEncoding,
  TextureChannelEncoding,
  StrokeDashEncoding,
  SimpleChannelEncoding,
  ShapeEncoding,
} from '../types';

/**
 * Build a TactileVegaLiteSpec from the current editor state
 */
export function buildSpecFromState(state: EditorState): TactileVegaLiteSpec | null {
  // Must have data source
  const hasDataUrl = state.dataSource === 'url' && state.dataUrl;
  const hasInlineData = state.dataSource === 'inline' && state.parsedData;

  if (!hasDataUrl && !hasInlineData) {
    return null;
  }

  const spec: TactileVegaLiteSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  };

  // Title - always use string format
  if (state.title) {
    spec.title = state.title;
  }

  // Top-level spec properties - direct access
  if (state.description) {
    (spec as any).description = state.description;
  }
  if (state.width) {
    (spec as any).width = state.width;
  }
  if (state.height) {
    (spec as any).height = state.height;
  }
  if (state.config) {
    (spec as any).config = state.config;
  }

  // Data
  if (state.dataSource === 'url') {
    spec.data = { url: state.dataUrl };
  } else if (state.parsedData) {
    spec.data = { values: state.parsedData };
  }

  // Transform (filter)
  if (state.transforms) {
    // Use complete transform array
    spec.transform = state.transforms;
  } else if (state.filterExpression) {
    // Single filter expression
    spec.transform = [
      {
        filter: state.filterExpression,
      },
    ];
  } else {
    spec.transform = undefined;
  }

  // Mark - use string format (simpler, matches test specs)
  if (state.chartType === 'pie') {
    spec.mark = 'arc';
  } else {
    spec.mark = state.mark.type;
  }

  // Encodings - NO MORE mergePassthroughProps!
  spec.encoding = {};

  if (state.encodings.x) {
    const xSpec = buildChannelSpec(state.encodings.x);
    if (xSpec) {
      spec.encoding.x = xSpec;
    }
  }

  if (state.encodings.y) {
    const ySpec = buildChannelSpec(state.encodings.y);
    if (ySpec) {
      spec.encoding.y = ySpec;
    }
  }

  if (state.encodings.theta) {
    const thetaSpec = buildChannelSpec(state.encodings.theta);
    if (thetaSpec) {
      spec.encoding.theta = thetaSpec;
    }
  }

  if (state.encodings.texture) {
    const textureSpec = buildTextureSpec(state.encodings.texture);
    if (textureSpec) {
      spec.encoding.texture = textureSpec;
    }
  }

  if (state.encodings.xOffset) {
    const xOffsetSpec = buildSimpleChannelSpec(state.encodings.xOffset);
    if (xOffsetSpec) {
      spec.encoding.xOffset = xOffsetSpec;
    }
  }

  if (state.encodings.yOffset) {
    const yOffsetSpec = buildSimpleChannelSpec(state.encodings.yOffset);
    if (yOffsetSpec) {
      (spec.encoding as any).yOffset = yOffsetSpec;
    }
  }

  if (state.encodings.strokeDash) {
    const strokeDashSpec = buildStrokeDashSpec(state.encodings.strokeDash);
    if (strokeDashSpec) {
      spec.encoding.strokeDash = strokeDashSpec;
    }
  }

  if (state.encodings.shape) {
    const shapeSpec = buildShapeSpec(state.encodings.shape);
    if (shapeSpec) {
      (spec.encoding as any).shape = shapeSpec;
    }
  }

  return spec;
}

/**
 * Build a channel encoding specification (x, y, theta)
 */
function buildChannelSpec(encoding: ChannelEncoding): any | null {
  // Field is required unless aggregate is "count"
  if (!encoding.field && encoding.aggregate !== 'count') {
    return null;
  }

  const spec: any = {};

  // Only add field if present (count aggregate doesn't need field)
  if (encoding.field) {
    spec.field = encoding.field;
  }

  // Type is optional (can be omitted if timeUnit or aggregate is present)
  if (encoding.type) {
    spec.type = encoding.type;
  }

  if (encoding.aggregate) {
    spec.aggregate = encoding.aggregate;
  }

  if (encoding.timeUnit) {
    spec.timeUnit = encoding.timeUnit;
  }

  // Direct property assignment - no more Proxy issues!
  if (encoding.axis) {
    spec.axis = encoding.axis;
  }

  if (encoding.scale) {
    spec.scale = encoding.scale;
  }

  if (encoding.sort) {
    spec.sort = encoding.sort;
  }

  // Direct title property (overrides axis.title)
  if (encoding.title) {
    spec.title = encoding.title;
  }

  // staggerLabel property
  if (encoding.staggerLabel !== undefined) {
    spec.staggerLabel = encoding.staggerLabel;
  }

  return spec;
}

/**
 * Build a simple channel encoding (xOffset)
 */
function buildSimpleChannelSpec(encoding: SimpleChannelEncoding): any | null {
  if (!encoding.field) {
    return null;
  }

  const spec: any = {
    field: encoding.field,
  };

  if (encoding.type) {
    spec.type = encoding.type;
  }

  return spec;
}

/**
 * Build a texture encoding specification
 */
function buildTextureSpec(encoding: TextureChannelEncoding): any | null {
  // Texture encoding can be empty (will use default)
  // or can have field + type + scale
  const spec: any = {};
  let hasContent = false;

  if (encoding.field) {
    spec.field = encoding.field;
    hasContent = true;
  }

  if (encoding.type) {
    spec.type = encoding.type;
    hasContent = true;
  }

  if (encoding.scale) {
    spec.scale = {};
    if (encoding.scale.domain && encoding.scale.domain.length > 0) {
      spec.scale.domain = encoding.scale.domain;
      hasContent = true;
    }
    // Include range even if empty - user explicitly set it
    if (encoding.scale.range !== undefined) {
      spec.scale.range = encoding.scale.range;
      hasContent = true;
    }
  }

  // Include legend configuration
  if (encoding.legend) {
    spec.legend = encoding.legend;
    hasContent = true;
  }

  // If no field but has scale range, still valid (uniform texture)
  if (!hasContent && encoding.scale?.range !== undefined) {
    return { scale: { range: encoding.scale.range } };
  }

  return hasContent ? spec : { scale: { range: ['solidGrayFill'] } };
}

/**
 * Build a stroke dash encoding specification
 */
function buildStrokeDashSpec(encoding: StrokeDashEncoding): any | null {
  if (!encoding.field || !encoding.type) {
    return null;
  }

  const spec: any = {
    field: encoding.field,
    type: encoding.type,
  };

  if (encoding.scale) {
    spec.scale = {};
    if (encoding.scale.domain && encoding.scale.domain.length > 0) {
      spec.scale.domain = encoding.scale.domain;
    }
    if (encoding.scale.range && encoding.scale.range.length > 0) {
      spec.scale.range = encoding.scale.range;
    }
  }

  return spec;
}

/**
 * Build a shape encoding specification
 */
function buildShapeSpec(encoding: ShapeEncoding): any | null {
  if (!encoding.field) {
    return null;
  }

  const spec: any = {
    field: encoding.field,
  };

  if (encoding.type) {
    spec.type = encoding.type;
  }

  if (encoding.scale) {
    spec.scale = {};
    if (encoding.scale.domain && encoding.scale.domain.length > 0) {
      spec.scale.domain = encoding.scale.domain;
    }
    if (encoding.scale.range && encoding.scale.range.length > 0) {
      spec.scale.range = encoding.scale.range;
    }
  }

  if (encoding.legend) {
    spec.legend = encoding.legend;
  }

  return spec;
}
