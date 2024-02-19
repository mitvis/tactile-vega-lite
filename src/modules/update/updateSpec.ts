import { getBrailleWidthForSelectors } from "../braille/getBrailleWidthForSelectors";
import { TopLevelSpec } from "vega-lite";
import vegaEmbed, { VisualizationSpec } from "vega-embed";

async function updateSpecForTactile(spec: any): Promise<VisualizationSpec> {
    // 

    try {
        const result = await vegaEmbed("#tactile", spec, { renderer: "svg" });
        const maxBrailleWidth = await getBrailleWidthForSelectors(result, ['.mark-text.role-axis-label text'], spec);
        const updatedSpec: any = {
            ...spec,

            "width": {
                "step": Math.ceil(maxBrailleWidth)
            }, // set bar width to the max axis label braille text width
            "height": {
                "step": 100 // set bar height to 30 pixels
            },
            "config": {
                "axis": {
                    "labelFont": spec.tactile.brailleFont || "swell-braille",
                    "labelFontSize": spec.tactile.brailleFontSize || 30,
                    "titleFont": spec.tactile.brailleFont || "swell-braille",
                    "titleFontSize": spec.tactile.brailleFontSize || 30,
                    "titleAngle": 0,
                    "titlePadding": 20 // distance between axis title and axis labels
                },
                "legend": {
                    "labelFont": spec.tactile.brailleFont || "swell-braille",
                    "labelFontSize": spec.tactile.brailleFontSize || 30,
                    "titleFont": spec.tactile.brailleFont || "swell-braille",
                    "titleFontSize": spec.tactile.brailleFontSize || 30,
                    "titlePadding": 20, // distance between legend title and legend labels
                    "direction": "vertical",
                    "orient": "top", // position of the legend
                    "padding": 60, // distance between bottom of legend and top of chart
                    "symbolSize": 500,  // size of the legend symbols
                    "columnPadding": 20, // distance between legend columns
                    "rowPadding": 20, // distance between legend rows
                }
            }
        };


        // Ensure spec.encoding and spec.encoding.y exist
        if (!updatedSpec.encoding) updatedSpec.encoding = {};
        if (!updatedSpec.encoding.y) updatedSpec.encoding.y = {};

        // Update or add the axis property to spec.encoding.y
        updatedSpec.encoding.y.axis = {
            ...updatedSpec.encoding.y.axis, // Preserve existing properties
            "titleY": -20, // Adjust the title position for the y axis
            "titleX": -10, // Adjust the title position for the y axis
        };
        return updatedSpec;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to ensure the rejection of the promise
    }
}

export { updateSpecForTactile }
