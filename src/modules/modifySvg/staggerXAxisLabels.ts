const d3 = require("d3");
import { getBrailleHeightForSelectors } from "../utils/getBrailleHeightForSelectors";
import { getBrailleWidthForSelectors } from "../utils/getBrailleWidthForSelectors";


async function calculateStaggerAmount(result: any, spec: any) {
    let maxTextHeight = await getBrailleHeightForSelectors(result, ['.mark-text.role-axis-label text'], spec);
    return Number(maxTextHeight) * 1.5;
}

let staggerThreshold = 50;

async function stagger(result: any, spec: any) {
    // wait for the maxTextHeight to be calculated
    const staggerAmount = await calculateStaggerAmount(result, spec);
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

    // move the x axis title down if it exists
    const xAxisTitle = d3.select(result.view.container()).select("svg").select(".mark-text.role-axis-title text");
    if (!xAxisTitle.empty()) {
        const transform = xAxisTitle.attr('transform');
        const translateMatch = transform.match(/translate\(([^)]+)\)/);
        if (translateMatch) {
            const [x, y] = translateMatch[1].split(',').map(parseFloat);
            const newY = y + staggerAmount;
            const newTransform = `translate(${x},${newY})`;
            xAxisTitle.attr('transform', newTransform);
        }
    }

    // get the ticks ".mark-rule role-axis-tick line" and extend the length of the ticks to long enough to reach the staggered labels
    const ticks = d3.select(result.view.container()).select("svg").selectAll('.mark-rule.role-axis-tick').node();
    const xTicks = d3.select(ticks).selectAll('line').nodes();
    // only extend the ticks whose labels have been staggered
    xTicks.forEach((tick: any, i: number) => {
        const tickLength = Number(tick.getAttribute('y2'));
        const newTickLength = tickLength + staggerAmount;
        if (i % 2 !== 0) {
            // extend the tick length
            console.log("newTickLength: ", newTickLength)
            tick.setAttribute('y2', newTickLength.toString());
        }
    });
}

async function staggerXAxisLabels(result: any, spec: any) {
    // if spec.encoding.x.axis.staggerXLabels is true, then 
    // stagger the x-axis labels and then add tick marks to the x-axis and extend the tick marks to the staggered labels
    if (spec.encoding.x.axis.staggerLabels === true) {
        stagger(result, spec);
    } else if (spec.encoding.x.axis.staggerLabels === "auto") {
        // stagger the x-axis labels if the width of the label is greater than x
        let maxBrailleWidth = await getBrailleWidthForSelectors(result, ['.mark-text.role-axis-label text'], spec);
        if (maxBrailleWidth >= staggerThreshold) {
            stagger(result, spec);
        }
    }
}

export { staggerXAxisLabels }
