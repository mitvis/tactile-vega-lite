const d3 = require("d3");


function setVLHeight(result: any,
    updatedVLSpec: any,
    maxBrailleHeight: number,
    braillePaddingY: number,
    numberOfTicksY: number,
) {
    // if user did not specify number of ticks for y axis
    if (!updatedVLSpec.encoding.y.axis || !updatedVLSpec.encoding.y.axis.tickCount) {
        // set y axis tick count to be the number of ticks
        updatedVLSpec.encoding.y.axis = {
            ...updatedVLSpec.encoding.y.axis, // Preserve existing properties
            "tickCount": numberOfTicksY
        };
    }


    const currentHeight = d3.select(result.view.container()).select("svg").attr("height");
    updatedVLSpec.height = Number(currentHeight) + numberOfTicksY * braillePaddingY;
    console.log("updatedVLSpec.height", updatedVLSpec.height);
    return updatedVLSpec;
}

export { setVLHeight };
