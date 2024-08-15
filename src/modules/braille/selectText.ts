const d3 = require("d3");
import { translateBraille } from "./translateBraille";


// function selectText(result: any, svgSelectionCriteria: string, spec: any) {

//   // pass in class names as a string
//   d3.select(result.view.container()).select("svg")
//     .selectAll(svgSelectionCriteria)
//     .each(function (this: SVGTextElement, d: any, i: number, nodes: ArrayLike<SVGTextElement>) {
//       // convert all text to lower case
//       d.text = d.text;
//       translateBraille(d.text, (brailleText: string) => {
//         const textElement = d3.select(this);
//         textElement.text(brailleText);
//       });
//     });

// }

async function selectText(result: any, svgSelectionCriteria: string, spec: any) {
  // Select the elements using D3 and pass in the class names as a string
  const elements = d3.select(result.view.container()).select("svg").selectAll(svgSelectionCriteria).nodes();

  // Use `for...of` to loop through each element asynchronously
  for (const node of elements) {
    const textElement = d3.select(node as SVGTextElement);
    const originalText = textElement.text();

    try {
      // Await the Braille translation
      const brailleText = await translateBraille(originalText);

      // Update the text with the translated Braille
      textElement.text(brailleText);
    } catch (error) {
      console.error("Error translating to Braille:", error);
    }
  }
}

export { selectText };