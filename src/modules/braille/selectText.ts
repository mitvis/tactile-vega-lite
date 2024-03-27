const d3 = require("d3");
import { translateBraille } from "./translateBraille";


function selectText(result: any, svgSelectionCriteria: string, spec: any) {

  // pass in class names as a string
  d3.select(result.view.container()).select("svg")
    .selectAll(svgSelectionCriteria)
    .each(function (this: SVGTextElement, d: any, i: number, nodes: ArrayLike<SVGTextElement>) {
      // convert all text to lower case
      d.text = d.text;
      translateBraille(d.text, (brailleText: string) => {
        const textElement = d3.select(this);
        textElement.text(brailleText);
      });
    });

}

export { selectText };