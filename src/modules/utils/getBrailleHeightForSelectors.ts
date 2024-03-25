const d3 = require("d3");
import { getBraille } from "../braille/getBraille";

let maxTextHeight;


function getBrailleHeightForSelectors(result: any, svgSelectionCriteria: string[], spec: any): Promise<number> {

    const brailleFont = spec.config.title.font.brailleFont;
    const brailleFontSize = spec.config.title.font.brailleFontSize;
    const promises: Promise<number>[] = [];

    const axisSelection = ".mark-text.role-axis-label";
    // select all axis element matching axisSelection
    const axisLabels = d3.select(result.view.container()).selectAll(axisSelection);
    // get the yAxis, which is the 2nd element in the axisLabels selection
    const yAxis = axisLabels.nodes()[1];
    // loop through all the text elements in the xAxis
    yAxis.querySelectorAll(svgSelectionCriteria).forEach((textElement: any) => {
        const originalText = textElement.textContent;
        // console.log("originalText: ", originalText);
        const promise = new Promise<number>((resolve) => {
            getBraille(originalText, (brailleText: string) => {
                textElement.textContent = brailleText;
                textElement.style.fontFamily = brailleFont;
                textElement.style.fontSize = `${brailleFontSize}px`;
                // get height of the text element
                const height = textElement.getBBox().height;
                resolve(height); // Resolve the promise with the width of the Braille text
                textElement.textContent = originalText; // Optionally reset the text back to original if needed
                // remove the braille font and size
                textElement.style.fontFamily = null;
                textElement.style.fontSize = null;
            });
        });
        promises.push(promise);
    });

    return Promise.all(promises).then(heights => {
        maxTextHeight = Math.max(...heights); // Find and return the maximum width
        return maxTextHeight;
    });
}

export { getBrailleHeightForSelectors, maxTextHeight };
