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

export { findUniqueColors };