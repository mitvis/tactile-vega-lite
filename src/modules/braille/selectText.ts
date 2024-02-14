const d3 = require("d3");
import { getBraille } from "./getBraille";


function selectText(result: any, svgSelectionCriteria:string, spec:any) {

    // check to see if spec.tactile.brailleFont is defined, if yes use it, if not use default
    const defaultBrailleFont = "swell braille";
    const brailleFont = spec.tactile.brailleFont ? spec.tactile.brailleFont : defaultBrailleFont;
    const defaultBrailleFontSize = 30;
    const brailleFontSize = spec.tactile.brailleFontSize ? spec.tactile.brailleFontSize : defaultBrailleFontSize;
  
    // pass in class names as a string
    // d3.select(result.view.container())
    d3.select(result.view.container()).select("svg")
    .selectAll(svgSelectionCriteria)
    .each(function(this: SVGTextElement, d:any, i: number, nodes: ArrayLike<SVGTextElement>) {
      getBraille(d.text, (brailleText: string) => {
        const textElement = d3.select(this);
        // textElement.text(brailleText).style("font-family", brailleFont).style("font-size", brailleFontSize);
        textElement.text(brailleText).style("font-family", brailleFont);
      });
    });
  }

  export { selectText };