
function setVLWidth(
    mergedSpec: any,
    maxBrailleWidth: number,
    braillePadding: number,
    numberOfTicksX: number,
) {
    const chartInnerPadding = 100;
    const userSpecifiedNumberOfTicks = mergedSpec.encoding.x.axis && mergedSpec.encoding.x.axis.tickCount;

    // ================== Update Width==================
    // if user specified number of ticks for x axis
    // then use user specified number of ticks to calculate width
    if (mergedSpec.encoding.x.axis && mergedSpec.encoding.x.axis.tickCount) {
        const numberOfTicksX = mergedSpec.encoding.x.axis.tickCount;
        const width = numberOfTicksX * (maxBrailleWidth + braillePadding) + chartInnerPadding;
        mergedSpec = {
            ...mergedSpec,
            "width": width
        }
    }
    // if :
    // encoding.x.type is temporal | encoding.x.timeUnit is defined
    // first get the number of x axis ticks
    // then set the width of the chart to the number of ticks * maxBrailleWidth

    else if (mergedSpec.encoding.x.type === "temporal"
        || mergedSpec.encoding.x.timeUnit !== undefined
        || mergedSpec.encoding.x.bin === true) {

        const width = numberOfTicksX * (maxBrailleWidth + braillePadding) + chartInnerPadding;
        // set x axis tick count to be the number of ticks
        mergedSpec.encoding.x.axis = {
            ...mergedSpec.encoding.x.axis, // Preserve existing properties
            "tickCount": numberOfTicksX
        };
        mergedSpec = {
            ...mergedSpec,
            "width": width
        }
    }

    // ====== Bar ======
    // check if mark type is a bar or line, if yes then extend the spec to include width
    // and that x is not continuous (i.e. binned)
    const padding = maxBrailleWidth * mergedSpec.config.scale.barBandPaddingInner
    const maxBarWidth = 150;

    let stepWidth = Math.ceil(maxBrailleWidth + padding);
    if (stepWidth > maxBarWidth) {
        stepWidth = maxBarWidth;
    }
    if (mergedSpec.mark === "bar" ||
        mergedSpec.mark.type === "bar") {
        if (mergedSpec.encoding.x.bin !== true) {
            mergedSpec = {
                ...mergedSpec,
                "width": {
                    "step": stepWidth // set bar width to the max axis label braille text width
                }
            }
        }
    }

    if (mergedSpec.mark === "line" ||
        mergedSpec.mark.type === "line") {
        if (mergedSpec.encoding.x.bin !== true) {
            mergedSpec = {
                ...mergedSpec,
                "width": {
                    "step": Math.ceil(maxBrailleWidth + padding) // set bar width to the max axis label braille text width
                }
            }
        }
    }

    // if mergedSpec.encoding.x.type is quantitative, 
    // then set the width of the chart to the number of ticks * maxBrailleWidth
    if (mergedSpec.encoding.x.type === "quantitative") {
        // if user specified number of ticks for x axis
        // then use user specified number of ticks to calculate width
        if (mergedSpec.encoding.x.axis && mergedSpec.encoding.x.axis.tickCount) {
            const numberOfTicksX = mergedSpec.encoding.x.axis.tickCount;
            const width = numberOfTicksX * (maxBrailleWidth + braillePadding) + chartInnerPadding;
            mergedSpec = {
                ...mergedSpec,
                "width": width
            }
        } else {
            // user did not specify number of ticks for x axis
            const numberOfTicksX = 5;
            const width = numberOfTicksX * (maxBrailleWidth + braillePadding) + chartInnerPadding;
            // set the encoding.x.axis.tickCount to be the number of ticks
            mergedSpec.encoding.x.axis = {
                ...mergedSpec.encoding.x.axis, // Preserve existing properties
                "tickCount": numberOfTicksX
            };
            mergedSpec = {
                ...mergedSpec,
                "width": width
            }
        }
    }


    return mergedSpec;
}

export { setVLWidth };
