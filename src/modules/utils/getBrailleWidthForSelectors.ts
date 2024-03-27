const d3 = require("d3");

import { translateBraille } from "../braille/translateBraille";

let maxTextWidth;

function getBrailleWidthForSelectors(result: any, svgSelectionCriteria: string[], spec: any): Promise<number> {
    const brailleFont = spec.config.title.font;
    const brailleFontSize = spec.config.title.fontSize;
    const promises: Promise<number>[] = [];

    const axisSelection = ".mark-text.role-axis-label";
    // select all axis element matching axisSelection
    const axisLabels = d3.select(result.view.container()).selectAll(axisSelection);
    // get the xAxis, which is the first element in the axisLabels selection
    const xAxis = axisLabels.node()
    // loop through all the text elements in the xAxis
    xAxis.querySelectorAll(svgSelectionCriteria).forEach((textElement: any) => {
        const originalText = textElement.textContent;
        const promise = new Promise<number>((resolve) => {
            translateBraille(originalText, (brailleText: string) => {
                textElement.textContent = brailleText;
                // textElement.style.fontFamily = brailleFont;
                textElement.style.fontFamily = brailleFont;
                textElement.style.fontSize = `${brailleFontSize}px`;
                let bbox = textElement.getBBox();
                // The width is part of the bounding box
                let width = bbox.width;
                // const width = textElement.getComputedTextLength();
                resolve(width); // Resolve the promise with the width of the Braille text
                textElement.textContent = originalText; // Optionally reset the text back to original if needed
                // remove the braille font and size
                textElement.style.fontFamily = null;
                textElement.style.fontSize = null;
            });
        });
        promises.push(promise);
    });

    return Promise.all(promises).then(widths => {
        maxTextWidth = Math.max(...widths); // Find and return the maximum width
        return maxTextWidth;
    });
}

export { getBrailleWidthForSelectors, maxTextWidth };
