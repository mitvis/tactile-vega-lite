import { getBrailleWidthForSelectors } from "../utils/getBrailleWidthForSelectors";
import vegaEmbed, { VisualizationSpec } from "vega-embed";
import { getNumberOfTicks } from "../utils/getNumberOfTicks";
import { getBrailleHeightForSelectors } from "../utils/getBrailleHeightForSelectors";
import { setVLWidth } from "./setVLWidth";
import { setVLHeight } from "./setVLHeight";

async function updateVLSpec(spec: any): Promise<VisualizationSpec> {
    try {
        const result = await vegaEmbed("#tactile", spec, { renderer: "svg" });
        const maxBrailleWidth = await getBrailleWidthForSelectors(result, ['.mark-text.role-axis-label text'], spec);
        const maxBrailleHeight = await getBrailleHeightForSelectors(result, ['.mark-text.role-axis-label text'], spec);
        const braillePaddingX = maxBrailleWidth * 0.1;
        const braillePaddingY = maxBrailleHeight * 0.5;

        const brailleFont = spec.config.text.brailleFont;
        const brailleFontSize = spec.config.text.brailleFontSize;

        const numberOfTicksX = await getNumberOfTicks(result, ['.mark-text.role-axis-label text'], "x");
        const numberOfTicksY = await getNumberOfTicks(result, ['.mark-text.role-axis-label text'], "y");

        const strokeWidth = 2;
        // ================== General VL Spec Updates ==================
        // make these updates to VL spec regardless of elaboratedTVLSpec
        let updatedVLSpec: any = {
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

        // ================== Ensure Single Mark Type ==================
        // if mark is an object, then set mark to be the type of the mark
        if (typeof updatedVLSpec.mark === "object") {
            updatedVLSpec.mark = updatedVLSpec.mark.type;
        }

        // ================== Update Width==================
        // updatedVLSpec = setVLWidth(updatedVLSpec, maxBrailleWidth, braillePaddingX, numberOfTicksX);
        // ================== Update Height ==================
        updatedVLSpec = setVLHeight(result, updatedVLSpec, maxBrailleHeight, braillePaddingY);




        // ================== Mark Type Specific VL Updates ==================
        // ====== Line ======
        // if mark is line and encoding.color is defined, remove encoding.color and change it to encoding.strokeDash
        if (updatedVLSpec.mark === "line" ||
            updatedVLSpec.mark.type === "line") {
            if (updatedVLSpec.encoding.color) {
                // remove encoding.color 
                delete updatedVLSpec.encoding.color;
                // add encoding.strokeDash and set field to symbol, type to nominal [TODO] this type: nominal could be a problem
                updatedVLSpec.encoding.strokeDash = {
                    "field": "symbol",
                    "type": "nominal"
                }
            }
        }



        // ====== Circle ======

        // ====== Arc ======
        if (updatedVLSpec.mark !== "arc" && updatedVLSpec.mark.type !== "arc") {
            // Update or add the axis property to spec.encoding.y
            updatedVLSpec.encoding.y.axis = {
                ...updatedVLSpec.encoding.y.axis, // Preserve existing properties
                "titleY": -20, // Adjust the title position for the y axis
                "titleX": -10, // Adjust the title position for the y axis
            };
        }


        // ================== elaboratedTVLSpec Updates ==================
        // check to see if spec.tactile.grid is not false
        // then set updatedVLSpec.config.axis.grid to true
        if (updatedVLSpec.tactile.grid !== false) {
            updatedVLSpec.config.axis.grid = true;
            // if grid is enabled, set grid color to black and grid width to 2
            updatedVLSpec.config.axis.gridColor = "black";
            updatedVLSpec.config.axis.gridWidth = spec.tactile.gridWidth || strokeWidth;
        } else if (updatedVLSpec.tactile.grid === false || updatedVLSpec.tactile.grid === undefined) {
            updatedVLSpec.config.axis.grid = false;
        }

        return updatedVLSpec;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to ensure the rejection of the promise
    }
}

export { updateVLSpec }
