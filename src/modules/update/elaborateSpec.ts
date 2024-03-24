import { getBrailleWidthForSelectors } from "../braille/getBrailleWidthForSelectors";
import vegaEmbed, { VisualizationSpec } from "vega-embed";
import { getNumberOfTicks } from "./getNumberOfTicks";
import { getBrailleHeightForSelectors } from "../braille/getBrailleHeightForSelectors";
import { setVLWidth } from "./setVLWidth";
import { setVLHeight } from "./setVLHeight";

async function elaborateTVLSpec(mergedSpec: any): Promise<VisualizationSpec> {
    try {
        const result = await vegaEmbed("#tactile", mergedSpec, { renderer: "svg" });
        const maxBrailleWidth = await getBrailleWidthForSelectors(result, ['.mark-text.role-axis-label text'], mergedSpec);
        const maxBrailleHeight = await getBrailleHeightForSelectors(result, ['.mark-text.role-axis-label text'], mergedSpec);
        const braillePaddingX = maxBrailleWidth * 0.1;
        const braillePaddingY = maxBrailleHeight * 0.5;
        const numberOfTicksX = await getNumberOfTicks(result, ['.mark-text.role-axis-label text'], "x");

        // ================== Update Width==================
        mergedSpec = setVLWidth(result, mergedSpec, maxBrailleWidth, braillePaddingX, numberOfTicksX);
        // ================== Update Height ==================
        // mergedSpec = setVLHeight(result, mergedSpec, maxBrailleHeight, braillePaddingY);

        return mergedSpec;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to ensure the rejection of the promise
    }
}

export { elaborateTVLSpec }
