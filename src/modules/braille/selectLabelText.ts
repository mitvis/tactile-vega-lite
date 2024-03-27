const d3 = require("d3");
import { translateBraille } from "./translateBraille";


function selectLabelText(result: any, svgSelectionCriteria: string, spec: any) {

    // pass in class names as a string
    d3.select(result.view.container()).select("svg")
        .selectAll(svgSelectionCriteria)
        .each(function (this: SVGTextElement, d: any, i: number, nodes: ArrayLike<SVGTextElement>) {
            // convert all text to lower case
            d.text = d.text.toLowerCase();
            console.log(d.text)
            translateBraille(d.text, (brailleText: string) => {
                const textElement = d3.select(this);
                // if the braillText has spacing in it, create a tspan element for each word and display each word on a new line
                if (brailleText.includes(" ")) {
                    const words = brailleText.split(" ");
                    textElement.text(null);
                    words.forEach((word, index) => {
                        textElement.append("tspan")
                            .text(word)
                            .attr("x", "0")
                            .attr("dy", `${index * 1.2}em`);
                    });
                } else {
                    textElement.text(brailleText);
                }

            });
        });

}

export { selectLabelText };