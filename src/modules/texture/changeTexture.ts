const d3 = require('d3');
const texturesModule = require('textures');
const textures = texturesModule.default; // Access the actual default export

import { findUniqueColors } from './findUniqueColors';
import { generateTexturesForColors } from './generateTextures';

const singleColor = "black";
const twoColors = ["black", "white"];

// Function to apply textures to SVG elements based on their fill color
function applyTextures(result: any, svgSelector: string, colorTextureMap: Record<string, string>): void {
  d3.select(result.view.container()).selectAll(svgSelector).each(function (this: any) {

    // Directly apply the texture URL as the fill for each element
    const pathElement = d3.select(this);
    const currentFillColor = pathElement.style('fill');

    // Check if there's a corresponding texture URL for the current fill color
    const textureUrl = colorTextureMap[currentFillColor];

    if (textureUrl) {
      // If a corresponding texture URL exists, apply it as the new fill for the path
      pathElement.style('fill', textureUrl);
    }
  });
}

// Main function to apply textures to colors in a Vega-Lite chart
function applyTexturesToVegaLiteChart(spec: any, result: any, markSelector: string, legendSymbolSelector: string) {
  // check spec to see if colorToTexture is true
  // if true then find all colors used in the chart
  if (!spec.colorToTexture) {
    // only getting colors by looking at css selectors 
    // [TODO] ideally we parse the spec to get all colors used in the chart
    // find unique colors used in the chart
    const uniqueColors = findUniqueColors(result, markSelector);
    const colorTextureMap = generateTexturesForColors(uniqueColors);
    applyTextures(result, markSelector, colorTextureMap);
    applyTextures(result, legendSymbolSelector, colorTextureMap);
  }
}


export { applyTexturesToVegaLiteChart }
