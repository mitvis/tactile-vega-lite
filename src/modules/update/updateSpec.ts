import { getBrailleWidthForSelectors } from "../braille/getBrailleWidthForSelectors";
import { TopLevelSpec } from "vega-lite";
import vegaEmbed, { VisualizationSpec } from "vega-embed";

async function updateSpecForTactile(spec: any): Promise<VisualizationSpec> {
    try {
        const result = await vegaEmbed("#tactile", spec, { renderer: "svg" });
        const maxBrailleWidth = await getBrailleWidthForSelectors(result, ['.mark-text.role-axis-label text'], spec);
        const brailleFont = spec.tactile.braille.brailleFont;
        const brailleFontSize = spec.tactile.braille.brailleFontSize;
        const strokeWidth = 2;

        let updatedSpec: any = {
            ...spec,
            "background": "white", // assert background color to be white, overwriting user input if any
            "config": {
                "view": {
                    "stroke": "black", // chart border color
                    "strokeWidth": strokeWidth // chart border width 
                },
                "axis": {
                    "labelFont": brailleFont,
                    "labelFontSize": brailleFontSize,
                    "labelAngle": 0,
                    "titleFont": brailleFont,
                    "titleFontSize": brailleFontSize,
                    "titleAngle": 0,
                    "titlePadding": 20, // distance between axis title and axis labels
                    // "format": "~s", // handling big numbers: format numbers as strings, e.g. 1,200,000 = 1.2M
                    // "formatType": "number",
                    "tickSize": 10, // length of the ticks
                    "tickWidth": strokeWidth, // width of the ticks
                },
                "legend": {
                    "labelFont": brailleFont,
                    "labelFontSize": brailleFontSize,
                    "titleFont": brailleFont,
                    "titleFontSize": brailleFontSize,
                    "titlePadding": 20, // distance between legend title and legend labels
                    "direction": "vertical",
                    "orient": "top", // position of the legend
                    "padding": 60, // distance between bottom of legend and top of chart // probably don't want to hardcode this [TODO] get y position of y axis title, y position of lengend + lengend height, maybe set padding to the difference?? 
                    "symbolSize": 3000,  // size of the legend symbols
                    "columnPadding": 20, // distance between legend columns
                    "rowPadding": 20, // distance between legend rows
                },
                "mark": {
                    "stroke": "black",
                    "strokeWidth": strokeWidth
                }
            }
        };

        // check to see if spec.tactile.grid is not false
        // then set updatedSpec.config.axis.grid to true
        if (updatedSpec.tactile.grid !== false) {
            updatedSpec.config.axis.grid = true;
            // if grid is enabled, set grid color to black and grid width to 2
            updatedSpec.config.axis.gridColor = "black";
            updatedSpec.config.axis.gridWidth = spec.tactile.gridWidth || strokeWidth;
        } else if (updatedSpec.tactile.grid === false || updatedSpec.tactile.grid === undefined) {
            updatedSpec.config.axis.grid = false;
        }



        // console.log("updatedSpec: ", updatedSpec)



        // ================== Specific Spec Updates Based on Mark Type ==================
        // check if mark type is a bar or line, if yes then extend the spec to include width
        // and that x is not continuous (i.e. binned)
        if (updatedSpec.mark === "bar" ||
            updatedSpec.mark.type === "bar" ||
            updatedSpec.mark === "line" ||
            updatedSpec.mark.type === "line") {
            if (updatedSpec.encoding.x.bin !== true) {
                updatedSpec = {
                    ...updatedSpec,
                    "width": {
                        "step": Math.ceil(maxBrailleWidth) // set bar width to the max axis label braille text width
                    }
                }
            }


            // Ensure spec.encoding and spec.encoding.y exist
            if (!updatedSpec.encoding) updatedSpec.encoding = {};
            if (!updatedSpec.encoding.y) updatedSpec.encoding.y = {};

        }

        if (updatedSpec.mark !== "arc" && updatedSpec.mark.type !== "arc") {
            // Update or add the axis property to spec.encoding.y
            updatedSpec.encoding.y.axis = {
                ...updatedSpec.encoding.y.axis, // Preserve existing properties
                "titleY": -20, // Adjust the title position for the y axis
                "titleX": -10, // Adjust the title position for the y axis
            };
        }
        // ================== End of Specific Spec Updates Based on Mark Type ==================


        return updatedSpec;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to ensure the rejection of the promise
    }
}

export { updateSpecForTactile }
