const d3 = require("d3");
import { getBrailleHeightForSelectors } from "../utils/getBrailleHeightForSelectors";

async function calculateStaggerAmount(result: any, spec: any) {
    let maxTextHeight = await getBrailleHeightForSelectors(result, ['.mark-text.role-axis-label text'], spec);
    return Number(maxTextHeight) * 1.5;
}

async function staggerXAxisLabels(result: any, spec: any) {

    // wait for the maxTextHeight to be calculated
    const staggerAmount = await calculateStaggerAmount(result, spec);

    // if spec.encoding.x.axis.staggerXLabels is true, then 
    // stagger the x-axis labels and then add tick marks to the x-axis and extend the tick marks to the staggered labels
    if (spec.encoding.x.axis.stagger === true) {
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

        // draw line from the center top of the bounding box of the text to the x-axis
        // get the bounding box of the text
        // textElements.forEach((text: any, i: number) => {
        //     // get the bounding box of the text
        //     const bbox = text.getBBox();
        //     console.log("bbox: ", bbox)
        //     // get the center of the top of the bounding box
        //     const x = bbox.x + bbox.width / 2;
        //     const y = bbox.y;

        //     console.log("x: ", x, "y: ", y, "staggerAmount: ", staggerAmount)
        //     // draw a line from the center of the top of the bounding box to the x-axis
        //     const line = d3.select(result.view.container()).select("svg").append("line")
        //         .attr("x1", x)
        //         .attr("y1", y)
        //         .attr("x2", x)
        //         .attr("y2", y + staggerAmount)
        //         .attr("stroke", "black")
        //         .attr("stroke-width", 1);

        //     // preserve the textElement's translate attribute and transform attribute, and apply to the new line
        //     const transform = text.getAttribute('transform');
        // });
    } else if (spec.encoding.x.axis.stagger === false) {
        // do not stagger the x-axis labels
        console.log("dont stagger the x-axis labels")
    } else if (spec.encoding.x.axis.stagger === "auto") {
        // stagger the x-axis labels if the width of the label is greater than x
        console.log("stagger the x-axis labels if the width of the label is greater than x")
    }



    // // Select all x-axis label text elements
    // const labels = d3.select(result.view.container()).select("svg").selectAll('.mark-text.role-axis-label').node();

    // // get all text element in labels
    // const textElements = labels.querySelectorAll('text');

    // // Iterate over each label
    // textElements.forEach((text: any, i: number) => {
    //     // Check if the label's index is odd to stagger only every other label
    //     if (i % 2 !== 0) {
    //         // Extract the current translate values from the transform attribute
    //         const transform = text.getAttribute('transform');
    //         const translateMatch = transform.match(/translate\(([^)]+)\)/);
    //         if (translateMatch) {
    //             const [x, y] = translateMatch[1].split(',').map(parseFloat);

    //             // Add the stagger amount to the y translation value
    //             const newY = y + staggerAmount;

    //             // Set the new transform attribute with the updated y value
    //             const newTransform = `translate(${x},${newY})`;
    //             text.setAttribute('transform', newTransform);
    //         }
    //     }
    // });
}

export { staggerXAxisLabels }
