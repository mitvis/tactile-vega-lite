const d3 = require("d3");
import { getBraille } from "./getBraille";

let maxTextWidth; 


function getBrailleWidthForSelectors(result: any, svgSelectionCriteria: string[], spec: any): Promise<number> {
  
  const defaultBrailleFont = "swell braille";
  const brailleFont = spec.tactile.brailleFont || defaultBrailleFont;
  const defaultBrailleFontSize = 30;
  const brailleFontSize = spec.tactile.brailleFontSize || defaultBrailleFontSize;
  const promises: Promise<number>[] = [];

  svgSelectionCriteria.forEach(selector => {
      d3.select(result.view.container())
        .selectAll(selector)
        .each(function(this: SVGTextElement) {
            const textElement = d3.select(this);
            const originalText = textElement.text();
            
            const promise = new Promise<number>((resolve) => {
                getBraille(originalText, (brailleText: string) => {
                    textElement.text(brailleText)
                               .style("font-family", brailleFont)
                               .style("font-size", `${brailleFontSize}px`);
                    const width = textElement.node().getComputedTextLength();
                    resolve(width); // Resolve the promise with the width of the Braille text
                    textElement.text(originalText); // Optionally reset the text back to original if needed
                });
            });

            promises.push(promise);
        });
  });

  return Promise.all(promises).then(widths => {
      maxTextWidth = Math.max(...widths); // Find and return the maximum width
      return maxTextWidth;
  });
}




export { getBrailleWidthForSelectors, maxTextWidth};
