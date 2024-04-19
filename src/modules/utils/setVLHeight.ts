const d3 = require("d3");

function setVLHeight(
    result: any,
    mergedSpec: any,
    numberOfTicksY: number,
) {
    const braillePaddingY = 10;
    const maxHeight = 500;

    if (mergedSpec.mark !== "arc" || mergedSpec.mark.type !== "arc") {
        // if user did not specify number of ticks for y axis
        if (!mergedSpec.encoding.y.axis || !mergedSpec.encoding.y.axis.tickCount) {
            // set y axis tick count to be the number of ticks
            mergedSpec.encoding.y.axis = {
                ...mergedSpec.encoding.y.axis, // Preserve existing properties
                "tickCount": numberOfTicksY
            };
        }

        const currentHeight = d3.select(result.view.container()).select("svg").attr("height");
        let newHeight = Number(currentHeight) + numberOfTicksY * braillePaddingY

        mergedSpec.height = newHeight > maxHeight ? maxHeight : newHeight;
        return mergedSpec;
    }
}

export { setVLHeight };
