const d3 = require("d3");
import { translateBraille } from "./translateBraille";

// function selectLegendLabelText(result: any, svgSelectionCriteria: string, spec: any) {

//     // pass in class names as a string
//     d3.select(result.view.container()).select("svg")
//         .selectAll(svgSelectionCriteria)
//         .each(function (this: SVGTextElement, d: any, i: number, nodes: ArrayLike<SVGTextElement>) {
//             // convert all text to lower case
//             d.text = d.text.toLowerCase();
//             translateBraille(d.text, (brailleText: string) => {
//                 const textElement = d3.select(this);
//                 // if the braillText has spacing in it, create a tspan element for each word and display each word on a new line
//                 if (brailleText.includes(" ")) {
//                     const words = brailleText.split(" ");
//                     textElement.text(null);
//                     words.forEach((word, index) => {
//                         textElement.append("tspan")
//                             .text(word)
//                             .attr("x", "0")
//                             .attr("dy", `${index * 1.2}em`);
//                     });
//                 } else {
//                     textElement.text(brailleText);
//                 }
//                 // set text-anchor to middle
//                 textElement.attr("text-anchor", "middle");

//             });
//         });

// }


async function selectLegendLabelText(result: any, svgSelectionCriteria: string, spec: any) {
    // Select the elements using D3 and pass in the class names as a string
    const elements = d3.select(result.view.container()).select("svg").selectAll(svgSelectionCriteria).nodes();

    // Use `for...of` to loop through each element asynchronously
    for (const node of elements) {
        const textElement = d3.select(node as SVGTextElement);
        let originalText = textElement.text().toLowerCase();

        try {
            const brailleText = await translateBraille(originalText);

            // If the Braille text has spacing, create a tspan element for each word and display each word on a new line
            if (brailleText.includes(" ")) {
                const words = brailleText.split(" ");
                textElement.text(null); // Clear the existing text
                words.forEach((word, index) => {
                    textElement.append("tspan")
                        .text(word)
                        .attr("x", "0")
                        .attr("dy", `${index * 1.2}em`);
                });
            } else {
                textElement.text(brailleText);
            }

            // Set text-anchor to middle
            textElement.attr("text-anchor", "middle");

        } catch (error) {
            console.error("Error translating to Braille:", error);
        }
    }
}

export { selectLegendLabelText };