const d3 = require('d3');

import { findUniqueColors } from './findUniqueColors';
import { generateTexturesForColors } from './generateTextures';

// Function to apply textures to SVG elements based on their fill color
function applyTextures(result: any, svgSelector: string, colorTextureMap: Record<string, string>): void {
  d3.select(result.view.container()).selectAll(svgSelector).each(function (this: any) {
    // Directly apply the texture URL as the fill for each element
    const pathElement = d3.select(this);
    // get the current fill attribute of the path element
    const currentFillColor = pathElement.style('fill');

    // Check if there's a corresponding texture URL for the current fill color
    const textureUrl = colorTextureMap[currentFillColor];
    if (textureUrl) {
      // If a corresponding texture URL exists, apply it as the new fill for the path
      pathElement.style('fill', textureUrl);
      pathElement.style('stroke', 'black');

    }
  });
}

function mapUserDefinedTexture(spec: any, uniqueColors: string[]): Record<string, string> {
  const colorToTextureUrl: Record<string, string> = {};
  const userDefinedTextures = spec.encoding.color.scale.range;
  uniqueColors.forEach((color, index) => {
    colorToTextureUrl[color] = userDefinedTextures[index]
  });
  return colorToTextureUrl;
}

// Main function to apply textures to colors in a Vega-Lite chart
function applyTexturesToVegaLiteChart(spec: any, result: any, markSelector: string, legendSymbolSelector: string) {
  const uniqueColors = findUniqueColors(result, markSelector);
  console.log("uniquecolors: ", uniqueColors)
  let colorTextureMap: Record<string, string> = {};
  console.log("applyTexturesToVegaLiteChart")
  if (spec.encoding && spec.encoding.color && spec.encoding.color.scale && spec.encoding.color.scale.range) {
    // use specified textures if the above are specified
    console.log("range specified: ", spec.encoding.color.scale.range)
    colorTextureMap = mapUserDefinedTexture(spec, uniqueColors);


  }
  // generate random ones if only spec.encoding.color is specified
  else if (spec.encoding.color && !spec.encoding.color.scale && !spec.encoding.color.scale.range) {


    console.log("here: ", colorTextureMap)
    colorTextureMap = generateTexturesForColors(uniqueColors);
  }
  else {
    console.error('No color scale specified in the Vega-Lite spec');
    return;
  }
  applyTextures(result, markSelector, colorTextureMap);
  applyTextures(result, legendSymbolSelector, colorTextureMap);

}


export { applyTexturesToVegaLiteChart, generateTexturesForColors }
