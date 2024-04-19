
function setVLWidth(
    mergedSpec: any,
    maxBrailleWidth: number,
    braillePadding: number,
    numberOfTicksX: number,
) {
    const chartInnerPadding = 100;
    const userSpecifiedNumberOfTicks = mergedSpec.encoding.x.axis && mergedSpec.encoding.x.axis.tickCount;
    const padding = maxBrailleWidth * mergedSpec.config.scale.barBandPaddingInner
    const maxBarWidth = 100;
    let stepWidth = Math.ceil(maxBrailleWidth + padding);

    // mark is NOT arc 
    if (mergedSpec.mark !== "arc" || mergedSpec.mark.type !== "arc") {

        // #1: directly set width
        // if user specified number of ticks for x axis
        // then use user specified number of ticks to calculate width
        if (mergedSpec.encoding.x.axis && mergedSpec.encoding.x.axis.tickCount) {
            const width = userSpecifiedNumberOfTicks * (maxBrailleWidth + braillePadding) + chartInnerPadding;
            mergedSpec = {
                ...mergedSpec,
                "width": width
            }
            return mergedSpec;
        }

        // if :
        // encoding.x.type is temporal | encoding.x.timeUnit is defined
        // first get the number of x axis ticks
        // then set the width of the chart to the number of ticks * maxBrailleWidth
        if (mergedSpec.encoding.x.type === "temporal"
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
            return mergedSpec;
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
            return mergedSpec;
        }

        // #2: set width based on step
        if (mergedSpec.encoding.x.bin !== true) {
            mergedSpec = {
                ...mergedSpec,
                "width": {
                    // set step to be smallest of stepWidth and maxBarWidth
                    "step": stepWidth > maxBarWidth ? maxBarWidth : stepWidth
                }
            }
            return mergedSpec;
        }
    }
}

export { setVLWidth };
