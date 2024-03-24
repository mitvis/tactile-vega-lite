const d3 = require("d3");

import { getBraille } from "./getBraille";

function renderDescription(result: any, spec: any) {
    // spec.description exists, then select the text and convert to braille
    if (spec.description) {
        getBraille(spec.description, (brailleText: string) => {
            // add a new text element to the svg
            d3.select(result.view.container()).select("svg")
                .append("text")
                .attr("class", "description")
                .attr("x", 0)
                .attr("y", 0)
                .text(brailleText);
        });
    }
}

export { renderDescription };