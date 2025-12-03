# Tactile Vega-Lite

A TypeScript library that compiles Tactile Vega-Lite specifications into accessible SVG visualizations with braille labels and tactile textures.

## Features

- ✅ **Zero setup required** - Just import and use, worker loaded from CDN
- 🔤 **Automatic braille translation** - Chart labels converted to UEB Grade 2 braille
- 🎨 **Tactile textures** - 10 distinct texture patterns for differentiation
- 📊 **Vega-Lite compatible** - Extends standard Vega-Lite specifications
- 📦 **Fully typed** - Complete TypeScript type definitions
- 🎯 **Standalone SVGs** - Embedded fonts for portability

## Installation

```bash
npm install tactile-vega-lite
```

## Peer Dependencies

```bash
npm install d3 vega-lite vega-embed textures
```

## Quick Start

```typescript
import { tactileVegaLite } from 'tactile-vega-lite';

const spec = {
  data: {
    values: [
      { category: 'A', value: 28 },
      { category: 'B', value: 55 },
      { category: 'C', value: 43 }
    ]
  },
  mark: 'bar',
  encoding: {
    x: { field: 'category', type: 'nominal' },
    y: { field: 'value', type: 'quantitative' },
    texture: {
      scale: { range: ['solidGrayFill', 'verticalFill', 'horizontalFill'] }
    }
  }
};

// Generate the tactile chart
const result = await tactileVegaLite(spec);

// Append to DOM
document.body.appendChild(result.svg);
```

## API Reference

### `tactileVegaLite(spec, options?)`

Main function to compile a Tactile Vega-Lite specification into an accessible SVG.

**Parameters:**

- `spec: TactileVegaLiteSpec` - The Tactile Vega-Lite specification
- `options?: TactileOptions` - Optional configuration

**Returns:** `Promise<TactileResult>`

**Example with options:**

```typescript
const result = await tactileVegaLite(spec, {
  brailleFont: 'Swell Braille',
  brailleFontSize: 24,
  workerUrl: '/custom-worker.js', // Override CDN worker
  embedFonts: true
});
```

### `setWorkerUrl(url)`

Configure the URL for the braille translation worker.

```typescript
import { setWorkerUrl } from 'tactile-vega-lite';

// Use a custom worker URL (e.g., for offline use)
setWorkerUrl('/path/to/worker.min.js');
```

### Types

```typescript
interface TactileOptions {
  workerUrl?: string;           // Default: CDN URL
  brailleFont?: string;          // Default: "Swell Braille"
  brailleFontSize?: number;      // Default: 24
  ppi?: number;                  // Default: 224
  embedFonts?: boolean;          // Default: true
  customTextures?: Record<string, TextureType>;
}

interface TactileResult {
  svg: SVGElement;               // The generated SVG element
  spec: any;                     // The elaborated spec
  metadata?: {
    textures?: Record<string, TextureType>;
    dimensions?: { width: number; height: number };
  };
}

type TextureType =
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
```

## Tactile Vega-Lite Specification

Tactile Vega-Lite extends standard Vega-Lite with a `texture` encoding:

```json
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "data": { ... },
  "mark": "bar",
  "encoding": {
    "x": { ... },
    "y": { ... },
    "texture": {
      "scale": {
        "range": ["solidGrayFill", "verticalFill", "horizontalFill"]
      }
    }
  }
}
```

## Available Textures

- `noFill` - White/transparent
- `solidGrayFill` - Solid gray fill
- `denseDottedFill` - Dense dot pattern
- `dottedFill` - Sparse dot pattern
- `verticalFill` - Vertical lines
- `horizontalFill` - Horizontal lines
- `diagonalLeftFill` - Left diagonal lines
- `diagonalRightFill` - Right diagonal lines
- `diamondFill` - Diamond pattern
- `crossFill` - Cross/dashed pattern

## Supported Chart Types

- Bar charts (simple, grouped, stacked)
- Line charts (single and multi-series)
- Scatter plots
- Pie charts

## Advanced Usage

### Custom Worker URL (Offline Use)

By default, the library loads the braille translation worker from a CDN. For offline use or custom deployments:

```typescript
import { setWorkerUrl, tactileVegaLite } from 'tactile-vega-lite';

// Set custom worker URL (must be done before first tactileVegaLite call)
setWorkerUrl('/assets/worker.min.js');

// Now use normally
const result = await tactileVegaLite(spec);
```

Or pass it as an option:

```typescript
const result = await tactileVegaLite(spec, {
  workerUrl: '/assets/worker.min.js'
});
```

### Error Handling

```typescript
import { tactileVegaLite, TactileVegaLiteError } from 'tactile-vega-lite';

try {
  const result = await tactileVegaLite(spec);
  document.body.appendChild(result.svg);
} catch (error) {
  if (error instanceof TactileVegaLiteError) {
    console.error(`Error in ${error.phase}:`, error.message);
    console.error('Cause:', error.cause);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## How It Works

1. **Spec Elaboration**: Merges user spec with sensible defaults for tactile output
2. **Dimension Calculation**: Measures braille text to calculate chart dimensions
3. **Texture Assignment**: Maps colors to tactile texture patterns
4. **Rendering**: Uses Vega-Embed to generate SVG
5. **SVG Modification**: Converts labels to braille, applies textures, embeds fonts
6. **Output**: Returns standalone SVG element

## Browser Compatibility

- Modern browsers with Web Worker support
- ES2020+ JavaScript environment
- SVG support required

## Development

See the `/demo` directory for a working example with Monaco editor.

## License

ISC

## Contributing

Contributions welcome! Please see the main repository for guidelines.
