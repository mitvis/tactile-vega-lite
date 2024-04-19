import { getBrailleWidthForSelectors } from "../utils/getBrailleWidthForSelectors";
import vegaEmbed, { VisualizationSpec } from "vega-embed";
import { getNumberOfTicks } from "../utils/getNumberOfTicks";
import { setVLWidth } from "../utils/setVLWidth";
import { setVLHeight } from "../utils/setVLHeight";

async function elaborateTVLSpec(mergedSpec: any): Promise<VisualizationSpec> {
    try {
        // if mark.type is not arc
        if (mergedSpec.mark != "arc" && mergedSpec.mark.type != "arc") {
            const result = await vegaEmbed("#tactile", mergedSpec, { renderer: "svg" });
            const maxBrailleWidth = await getBrailleWidthForSelectors(result, ['.mark-text.role-axis-label text'], mergedSpec);
            const braillePaddingX = maxBrailleWidth * 0.1;
            const numberOfTicksX = await getNumberOfTicks(result, ['.mark-text.role-axis-label text'], "x");
            const numberOfTicksY = await getNumberOfTicks(result, ['.mark-text.role-axis-label text'], "y");

            // ================== Update Height and Width ==================
            mergedSpec = setVLWidth(mergedSpec, maxBrailleWidth, braillePaddingX, numberOfTicksX);
            mergedSpec = setVLHeight(result, mergedSpec, numberOfTicksY);

            // ================== Update Multi-series Line Chart ==================
            if (mergedSpec.mark.type == "line" || mergedSpec.mark == "line") {
                if (mergedSpec.encoding.color) {
                    // add encoding.strokeDash and set field to encoding.color.field
                    mergedSpec.encoding.strokeDash = {
                        "field": mergedSpec.encoding.color.field,
                    }
                    // remove encoding.color 
                    delete mergedSpec.encoding.color;
                }
            }
        }


        // ================== texture ==================
        // if use specified textures, we use user specified textures
        if (mergedSpec.encoding.color && mergedSpec.encoding.color.scale && mergedSpec.encoding.color.scale.range) {
            // iterate through range, and replace each texture name to "url(#textureName)"
            mergedSpec.encoding.color.scale.range = mergedSpec.encoding.color.scale.range.map((textureName: string) => {
                return `url(#${textureName})`;
            });
        }

        return mergedSpec;
    } catch (error) {
        console.error(error);
        throw error; // Re-throw the error to ensure the rejection of the promise
    }
}

export { elaborateTVLSpec }
