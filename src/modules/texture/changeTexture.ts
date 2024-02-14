const d3 = require('d3');
const texturesModule = require('textures');
const textures = texturesModule.default; // Access the actual default export


// Function to find unique colors used in the chart


function findUniqueColors(result: any, svgSelector: string): string[] {
  // console.log("findUniqueColors");
  const colors = new Set<string>();
  d3.select(result.view.container())
    .selectAll(svgSelector)
    .each(function(this: SVGPathElement) {
      const color = d3.select(this).style('fill');
      colors.add(color);
    });
  return Array.from(colors);
}

  
// Function to generate textures for each unique color
function generateTexturesForColors(uniqueColors: string[]): Record<string, string> {
  const svg = d3.select('svg');
  const colorToTextureUrl: Record<string, string> = {};

  // Check if there are too many colors
  if (uniqueColors.length > 15) {
    alert('There are too many colors! Pls why would you do this to me?');
    return colorToTextureUrl;
  }

  // Pre-generate 15 textures with a mix of circles, lines, and paths
  // [TODO] map BANA guideline colors to texture.js
  // [TODO] make sure that the textures are not too similar to each other, see BANA appendix
  // [TODO] similar texture cannot be next to each other 
  let texturesArray = [
    //lines
    textures.lines().size(4),
    // textures.lines().heavier(),
    // textures.lines().lighter(),
    // textures.lines().thinner(),
    // textures.lines().thicker(),
    textures.lines().size(4).orientation("vertical"),
    textures.lines().orientation("3/8", "7/8"),

    //circles
    textures.circles().size(4),
    // textures.circles().heavier(),
    // textures.circles().lighter(),
    // textures.circles().thinner(),
    textures.circles().size(1),

    // paths
    textures.paths().d("crosses").size(2).strokeWidth(2),
    textures.paths().d("hexagons").size(2).strokeWidth(2),
    // textures.paths().d("crosses").lighter().thicker(),
    // textures.paths().d("woven").size(2).lighter().thicker(),
    // textures.paths().d("waves").size(2).thicker(),

  ];

  uniqueColors.forEach((color, index) => {
    // Randomly select a texture from the pre-generated array w/o replacement
    const textureIndex = Math.floor(Math.random() * texturesArray.length);
    const texture = texturesArray[textureIndex]; // Apply the unique color to the selected texture
    // Add the texture to the defs
    svg.call(texture);

    // Store the mapping from color to texture URL (pattern ID reference)
    colorToTextureUrl[color] = `url(#${texture.id()})`;
    texturesArray.splice(textureIndex, 1);

  });

  return colorToTextureUrl;
}

// Function to apply textures to SVG elements based on their fill color
function applyTextures(result:any, svgSelector:string, colorTextureMap: Record<string, string>):void {
  d3.select(result.view.container()).selectAll(svgSelector).each(function(this:any) {
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
  function applyTexturesToVegaLiteChart(result: any, markSelector: string, legendSymbolSelector: string) {
    // only getting colors by looking at css selectors 
    // ideally we parse the spec to get all colors used in the chart

    // find unique colors used in the chart
    const uniqueColors = findUniqueColors(result, markSelector);
    const colorTextureMap = generateTexturesForColors(uniqueColors);
    applyTextures(result, markSelector, colorTextureMap);
    applyTextures(result, legendSymbolSelector, colorTextureMap);

  }

  
export {applyTexturesToVegaLiteChart}
  