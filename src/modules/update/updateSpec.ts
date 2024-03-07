import { getBrailleWidthForSelectors } from "../braille/getBrailleWidthForSelectors";
import { TopLevelSpec } from "vega-lite";
import vegaEmbed, { VisualizationSpec } from "vega-embed";
import { getNumberOfDates } from "./getNumberOfDates";

async function updateVLSpec(spec: any): Promise<VisualizationSpec> {
    try {
        const result = await vegaEmbed("#tactile", spec, { renderer: "svg" });
        const maxBrailleWidth = await getBrailleWidthForSelectors(result, ['.mark-text.role-axis-label text'], spec);
        const brailleFont = spec.tactile.braille.brailleFont;
        const brailleFontSize = spec.tactile.braille.brailleFontSize;
        const strokeWidth = 2;
        const braillePadding = 50;

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

        // if mark is an object, then set mark to be the type of the mark
        if (typeof updatedVLSpec.mark === "object") {
            updatedVLSpec.mark = updatedVLSpec.mark.type;
        }

        console.log("updatedVLSpec: ", updatedVLSpec);



        // ================== Encoding type specific VL updates ==================
        // if :
        // encoding.x.type is temporal | encoding.x.timeUnit is defined 
        // first get the number of dates
        // then set the width of the chart to the number of dates * maxBrailleWidth
        if (updatedVLSpec.encoding.x.type === "temporal" || updatedVLSpec.encoding.x.timeUnit !== undefined) {
            const numberOfDates = await getNumberOfDates(result, ['.mark-text.role-axis-label text']);
            // const numberOfDates = 3
            const width = numberOfDates * (maxBrailleWidth + braillePadding);
            console.log("numberOfDates: ", numberOfDates);

            // set x axis tick count to be the number of dates
            updatedVLSpec.encoding.x.axis = {
                ...updatedVLSpec.encoding.x.axis, // Preserve existing properties
                "tickCount": numberOfDates
            };
            updatedVLSpec = {
                ...updatedVLSpec,
                "width": width
            }
        }



        // ================== Mark Type Specific VL Updates ==================
        // ====== Bar ======
        // check if mark type is a bar or line, if yes then extend the spec to include width
        // and that x is not continuous (i.e. binned)
        if (updatedVLSpec.mark === "bar" ||
            updatedVLSpec.mark.type === "bar") {
            if (updatedVLSpec.encoding.x.bin !== true) {
                updatedVLSpec = {
                    ...updatedVLSpec,
                    "width": {
                        "step": Math.ceil(maxBrailleWidth) // set bar width to the max axis label braille text width
                    }
                }
            }
            // Ensure spec.encoding and spec.encoding.y exist
            if (!updatedVLSpec.encoding) updatedVLSpec.encoding = {};
            if (!updatedVLSpec.encoding.y) updatedVLSpec.encoding.y = {};
        }
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
