import { getFontData, FontName as EmbeddedFontName } from '../../fonts-embedded';
import { FontName } from '../modifySpec/updateDefault';

function getFontFromFontName(fontName: FontName): string | null {
  // Try to get font from embedded fonts
  const fontData = getFontData(fontName as EmbeddedFontName);
  if (!fontData) {
    console.error(`Font ${fontName} not found`);
    return null;
  }
  return fontData;
}

/**
 * Embeds font definitions directly into an SVG
 * @param svgElement The SVG element to embed fonts into
 * @param fontName The name of the font to embed (must match a key in fontMap)
 * @returns The SVG element with embedded font
 */
function embedFontInSvg(svgElement: SVGElement, fontName: FontName): SVGElement {
  const fontData = getFontFromFontName(fontName);
  // Check if font exists in our map
  if (!fontData) {
    console.warn(`Font "${fontName}" not found in available fonts`);
    return svgElement;
  }

  // Create a defs element if it doesn't exist
  let defsElement = svgElement.querySelector('defs');
  if (!defsElement) {
    defsElement = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svgElement.insertBefore(defsElement, svgElement.firstChild);
  }

  // Create a style element for the font
  const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleElement.setAttribute('type', 'text/css');

  // Create the @font-face CSS rule
  const fontFaceRule = `
    @font-face {
      font-family: '${fontName}';
      src: url(${fontData}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `;

  styleElement.textContent = fontFaceRule;

  // Add the style element to the defs
  defsElement.appendChild(styleElement);

  return svgElement;
}

/**
 * Embeds font based on the specification provided in the TVL config
 * @param svgElement The SVG element to embed fonts into
 * @param spec The TVL specification containing font information
 * @returns The SVG element with embedded font
 */
export function embedFontFromSpec(svgElement: SVGElement, spec: any): SVGElement {
  // Extract font name from the specification
  let fontName: FontName = 'Swell Braille'; // Default font

  // Check if font is specified in the config
  if (spec.config && spec.config.text && spec.config.text.font) {
    fontName = spec.config.text.font;
  }

  // Embed the font
  return embedFontInSvg(svgElement, fontName);
}
