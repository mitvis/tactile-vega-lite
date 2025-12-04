import { TactileVegaLiteSpec } from 'tactile-vega-lite';
import {
  EditorState,
  ChannelEncoding,
  TextureChannelEncoding,
  StrokeDashEncoding,
  SimpleChannelEncoding,
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

  // Title
  if (state.title) {
    spec.title = state.title;
  }

  // Data
  if (state.dataSource === 'url') {
    spec.data = { url: state.dataUrl };
  } else if (state.parsedData) {
    spec.data = { values: state.parsedData };
  }

  // Transform (filter)
  if (state.filterExpression) {
    spec.transform = [
      {
        filter: state.filterExpression,
      },
    ];
  }

  // Mark
  if (state.chartType === 'pie') {
    spec.mark = 'arc';
  } else {
    spec.mark = { type: state.mark.type };
  }

  // Encodings
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

  if (state.encodings.strokeDash) {
    const strokeDashSpec = buildStrokeDashSpec(state.encodings.strokeDash);
    if (strokeDashSpec) {
      spec.encoding.strokeDash = strokeDashSpec;
    }
  }

  return spec;
}

/**
 * Build a channel encoding specification (x, y, theta)
 */
function buildChannelSpec(encoding: ChannelEncoding): any | null {
  if (!encoding.field || !encoding.type) {
    return null;
  }

  const spec: any = {
    field: encoding.field,
    type: encoding.type,
  };

  if (encoding.aggregate) {
    spec.aggregate = encoding.aggregate;
  }

  if (encoding.timeUnit) {
    spec.timeUnit = encoding.timeUnit;
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
    if (encoding.scale.range && encoding.scale.range.length > 0) {
      spec.scale.range = encoding.scale.range;
      hasContent = true;
    }
  }

  // If no field but has scale range, still valid (uniform texture)
  if (!hasContent && encoding.scale?.range && encoding.scale.range.length > 0) {
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
