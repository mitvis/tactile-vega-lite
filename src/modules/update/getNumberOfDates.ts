const d3 = require("d3");



function getNumberOfDates(result: any, svgSelectionCriteria: string[]): Promise<number> {
    // Your code here



    const promises: Promise<number>[] = [];

    const axisSelection = ".mark-text.role-axis-label";
    // select all axis element matching axisSelection
    const axisLabels = d3.select(result.view.container()).selectAll(axisSelection);
    // get the xAxis, which is the first element in the axisLabels selection
    const xAxis = axisLabels.node()
    // now count how many text elements are in the xAxis.node()
    const numberOfDates = xAxis.querySelectorAll(svgSelectionCriteria).length;
    return Promise.resolve(numberOfDates);
}

export { getNumberOfDates };