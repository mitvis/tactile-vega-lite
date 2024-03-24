const d3 = require("d3");
import { getBraille } from "./getBraille";


function selectText(result: any, svgSelectionCriteria: string, spec: any) {

  // pass in class names as a string
  d3.select(result.view.container()).select("svg")
    .selectAll(svgSelectionCriteria)
    .each(function (this: SVGTextElement, d: any, i: number, nodes: ArrayLike<SVGTextElement>) {
      getBraille(d.text, (brailleText: string) => {
        const textElement = d3.select(this);
        textElement.text(brailleText);
        console.log("brailleText: ", brailleText);
      });
    });

}

export { selectText };