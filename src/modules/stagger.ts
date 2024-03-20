const d3 = require("d3");
import { getBrailleHeightForSelectors } from "./braille/getBrailleHeightForSelectors";


async function calculateStaggerAmount(result: any, spec: any) {
    let maxTextHeight = await getBrailleHeightForSelectors(result, ['.mark-text.role-axis-label text'], spec);
    console.log(maxTextHeight);
    return Number(maxTextHeight) * 1.5;
}


async function staggerXAxisLabels(result: any, spec: any) {

    // wait for the maxTextHeight to be calculated
    const staggerAmount = await calculateStaggerAmount(result, spec);
    console.log("staggerAmount: ", staggerAmount);


    // Select all x-axis label text elements
    const labels = d3.select(result.view.container()).select("svg").selectAll('.mark-text.role-axis-label').node();

    // get all text element in labels
    const textElements = labels.querySelectorAll('text');

    // Iterate over each label
    textElements.forEach((text: any, i: number) => {
        // Check if the label's index is odd to stagger only every other label
        if (i % 2 !== 0) {
            // Extract the current translate values from the transform attribute
            const transform = text.getAttribute('transform');
            const translateMatch = transform.match(/translate\(([^)]+)\)/);
            if (translateMatch) {
                const [x, y] = translateMatch[1].split(',').map(parseFloat);

                // Add the stagger amount to the y translation value
                const newY = y + staggerAmount;

                // Set the new transform attribute with the updated y value
                const newTransform = `translate(${x},${newY})`;
                text.setAttribute('transform', newTransform);
            }
        }
    });
}

export { staggerXAxisLabels }
