const d3 = require("d3");
import { translateBraille } from "../braille/translateBraille";

let maxTextWidth;

// function getBrailleWidthForSelectors(result: any, svgSelectionCriteria: string[], spec: any): Promise<number> {
//     const brailleFont = spec.config.title.font;
//     const brailleFontSize = spec.config.title.fontSize;
//     const promises: Promise<number>[] = [];

//     const axisSelection = ".mark-text.role-axis-label";
//     // select all axis element matching axisSelection
//     const axisLabels = d3.select(result.view.container()).selectAll(axisSelection);
//     // get the xAxis, which is the first element in the axisLabels selection
//     const xAxis = axisLabels.node()
//     // loop through all the text elements in the xAxis
//     xAxis.querySelectorAll(svgSelectionCriteria).forEach((textElement: any) => {
//         const originalText = textElement.textContent;
//         const promise = new Promise<number>((resolve) => {
//             translateBraille(originalText, (brailleText: string) => {
//                 textElement.textContent = brailleText;
//                 // textElement.style.fontFamily = brailleFont;
//                 textElement.style.fontFamily = brailleFont;
//                 textElement.style.fontSize = `${brailleFontSize}px`;
//                 let bbox = textElement.getBBox();
//                 // The width is part of the bounding box
//                 let width = bbox.width;
//                 // const width = textElement.getComputedTextLength();
//                 resolve(width); // Resolve the promise with the width of the Braille text
//                 textElement.textContent = originalText; // Optionally reset the text back to original if needed
//                 // remove the braille font and size
//                 textElement.style.fontFamily = null;
//                 textElement.style.fontSize = null;
//             });
//         });
//         promises.push(promise);
//     });

//     return Promise.all(promises).then(widths => {
//         maxTextWidth = Math.max(...widths); // Find and return the maximum width
//         return maxTextWidth;
//     });
// }

async function getBrailleWidthForSelectors(result: any, svgSelectionCriteria: string[], spec: any): Promise<number> {
    const brailleFont = spec.config.title.font;
    const brailleFontSize = spec.config.title.fontSize;
    const axisSelection = ".mark-text.role-axis-label";
    const axisLabels = d3.select(result.view.container()).selectAll(axisSelection);
    const xAxis = axisLabels.node();

    if (!xAxis) {
        throw new Error("xAxis not found");
    }

    const textElements = xAxis.querySelectorAll(svgSelectionCriteria);

    const widthPromises = Array.from(textElements).map(async (textElement: any) => {
        const originalText = textElement.textContent;

        try {
            // Await the Braille translation
            const brailleText = await translateBraille(originalText);

            // Temporarily set the translated Braille text and styles to measure the width
            textElement.textContent = brailleText;
            textElement.style.fontFamily = brailleFont;
            textElement.style.fontSize = `${brailleFontSize}px`;

            // Get the bounding box width
            const width = textElement.getBBox().width;

            // Reset the text and styles
            textElement.textContent = originalText;
            textElement.style.fontFamily = "";
            textElement.style.fontSize = "";

            return width;
        } catch (error) {
            console.error("Error translating to Braille:", error);
            return 0; // Return 0 if there's an error, to avoid breaking the calculation
        }
    });

    // Wait for all width calculations to complete
    const widths = await Promise.all(widthPromises);
    maxTextWidth = Math.max(...widths); // Find and return the maximum width
    return maxTextWidth; // Return the maximum width
}


export { getBrailleWidthForSelectors, maxTextWidth };
