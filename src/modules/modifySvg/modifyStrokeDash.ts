const d3 = require("d3");

export function modifyStrokeDash(result: any, spec: any) {
    const lineSelector = '.mark-line.role-mark.marks path'
    const legendSymbolSelector = '.mark-symbol.role-legend-symbol path';

    const lines = d3.select(result.view.container())
        .select("svg")
        .selectAll(lineSelector).nodes();
    // create a list of strokeDashArray values
    const strokeDashArray = ["8, 16", "5, 5", "5, 10", "4, 8", "4, 2"];
    // apply the strokeDashArray to the legend symbols
    const legendSymbols = d3.select(result.view.container())
        .select("svg")
        .selectAll(legendSymbolSelector).nodes();
    legendSymbols.forEach((symbol: any, i: number) => {
        symbol.setAttribute("stroke-dasharray", strokeDashArray[i % strokeDashArray.length]);
    });
    // apply the strokeDashArray to the lines
    lines.forEach((line: any, i: number) => {
        line.setAttribute("stroke-dasharray", strokeDashArray[i % strokeDashArray.length]);
    });
}