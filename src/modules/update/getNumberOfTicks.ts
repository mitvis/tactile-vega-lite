const d3 = require("d3");

function getNumberOfTicks(result: any, svgSelectionCriteria: string[], axis: string): Promise<number> {
    const promises: Promise<number>[] = [];
    const axisSelection = ".mark-text.role-axis-label";
    // select all axis element matching axisSelection
    const axisLabels = d3.select(result.view.container()).selectAll(axisSelection);
    let axisSelected = null;
    if (axis === "x") {
        // get the xAxis, which is the first element in the axisLabels selection
        axisSelected = axisLabels.node()
    } else if (axis === "y") {
        // get the yAxis, which is the second element in the axisLabels selection
        axisSelected = axisLabels.nodes()[1];
    }
    // now count how many text elements are in the xAxis.node()
    const numberOfDates = axisSelected.querySelectorAll(svgSelectionCriteria).length;
    return Promise.resolve(numberOfDates);
}

export { getNumberOfTicks };