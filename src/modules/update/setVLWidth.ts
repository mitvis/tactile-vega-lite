function setVLWidth(result: any,
    updatedVLSpec: any,
    maxBrailleWidth: number,
    braillePadding: number,
    numberOfTicksX: number,
) {

    // ================== Update Width==================
    // if user specified number of ticks for x axis
    // then use user specified number of ticks to calculate width
    if (updatedVLSpec.encoding.x.axis && updatedVLSpec.encoding.x.axis.tickCount) {
        const numberOfTicksX = updatedVLSpec.encoding.x.axis.tickCount;
        const width = numberOfTicksX * (maxBrailleWidth + braillePadding);
        updatedVLSpec = {
            ...updatedVLSpec,
            "width": width
        }
    }
    // if :
    // encoding.x.type is temporal | encoding.x.timeUnit is defined
    // first get the number of x axis ticks
    // then set the width of the chart to the number of ticks * maxBrailleWidth

    else if (updatedVLSpec.encoding.x.type === "temporal"
        || updatedVLSpec.encoding.x.timeUnit !== undefined
        || updatedVLSpec.encoding.x.bin === true) {
        const width = numberOfTicksX * (maxBrailleWidth + braillePadding);
        // set x axis tick count to be the number of ticks
        updatedVLSpec.encoding.x.axis = {
            ...updatedVLSpec.encoding.x.axis, // Preserve existing properties
            "tickCount": numberOfTicksX
        };
        updatedVLSpec = {
            ...updatedVLSpec,
            "width": width
        }
    }

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
    }


    return updatedVLSpec;
}

export { setVLWidth };
