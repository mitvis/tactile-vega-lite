const d3 = require("d3");
import { translateBraille } from "../braille/translateBraille";

function getBrailleHeightForSelectors(result: any, svgSelectionCriteria: string[], spec: any): Promise<number> {
    return new Promise((resolve, reject) => {
        const brailleFont = spec.config.title.font;
        const brailleFontSize = spec.config.title.fontSize;

        const text = d3.select(result.view.container()).select("svg").select('.mark-text.role-axis-label');
        // select the first text element in text
        const textElement = text.select("text").node();
        if (!textElement) {
            reject(new Error("Text element not found"));
            return;
        }
        const originalText = textElement.textContent;

        translateBraille(originalText, (brailleText: string) => {
            try {
                console.log("brailleText", brailleText);
                textElement.textContent = brailleText;
                textElement.style.fontFamily = brailleFont;
                textElement.style.fontSize = `${brailleFontSize}px`;
                // get height of the text element
                const height = textElement.getBBox().height;
                console.log("height", height);
                resolve(height);
            } catch (innerError) {
                console.error("Error applying Braille translation:", innerError);
                reject(innerError);
            } finally {
                // Reset text and styles regardless of success or error
                textElement.textContent = originalText;
                textElement.style.fontFamily = "";
                textElement.style.fontSize = "";
            }
        });
    });
}




export { getBrailleHeightForSelectors };
