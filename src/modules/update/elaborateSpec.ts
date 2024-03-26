import { getBrailleWidthForSelectors } from "../utils/getBrailleWidthForSelectors";
import vegaEmbed, { VisualizationSpec } from "vega-embed";
import { getNumberOfTicks } from "../utils/getNumberOfTicks";
import { setVLWidth } from "./setVLWidth";

async function elaborateTVLSpec(mergedSpec: any): Promise<VisualizationSpec> {
    try {
        const result = await vegaEmbed("#tactile", mergedSpec, { renderer: "svg" });
        const maxBrailleWidth = await getBrailleWidthForSelectors(result, ['.mark-text.role-axis-label text'], mergedSpec);
        const braillePaddingX = maxBrailleWidth * 0.1;
        const numberOfTicksX = await getNumberOfTicks(result, ['.mark-text.role-axis-label text'], "x");

        // ================== Update Width==================
        mergedSpec = setVLWidth(mergedSpec, maxBrailleWidth, braillePaddingX, numberOfTicksX);

        if (mergedSpec.encoding.color) {
            
            // add encoding.strokeDash and set field to symbol, type to nominal [TODO] this type: nominal could be a problem
            mergedSpec.encoding.strokeDash = {
                "field": mergedSpec.encoding.color.field,
                "type": mergedSpec.encoding.color.type
            }
            // remove encoding.color 
            delete mergedSpec.encoding.color;
        }

        console.log("merged spec ", mergedSpec)

        return mergedSpec;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to ensure the rejection of the promise
    }
}

export { elaborateTVLSpec }
