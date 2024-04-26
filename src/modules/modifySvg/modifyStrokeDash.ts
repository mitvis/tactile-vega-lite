const d3 = require("d3");
// import { findUniqueColors } from "../texture/findUniqueColors";
const legendSymbolSelector = '.mark-symbol.role-legend-symbol path';
const lineSelector = '.mark-line.role-mark.marks path';

function findUniqueLines(result: any, svgSelector: string): string[] {
    // console.log("findUniqueColors");
    const colors = new Set<string>();
    d3.select(result.view.container())
        .selectAll(svgSelector)
        .each(function (this: SVGPathElement) {
            const color = d3.select(this).style('stroke-dasharray');
            colors.add(color);
        });
    return Array.from(colors);
}

function extendLine(result: any, spec: any) {

    const offset = 50;

    // select all legend symbols
    const legendSymbols = d3.select(result.view.container())
        .select("svg")
        .selectAll(legendSymbolSelector).nodes();
    // for each legend symbol, extend the line to the left
    legendSymbols.forEach((symbol: any) => {
        // get the d attribute of the symbol
        const d = symbol.getAttribute("d");
        // find the begining of the path data
        const begin = d.indexOf("M");
        // find the first comma after the begining of the path data
        const firstComma = d.indexOf(",", begin);
        // get the number in between
        const x = parseFloat(d.substring(begin + 1, firstComma));
        // subtract an offset from the x value
        const newX = x - offset;
        // create a new path data string with the new x and all other values in path stays the same
        const newD = `M${newX}${d.substring(firstComma)}`;
        // set the new path data string to the symbol
        symbol.setAttribute("d", newD);

    });
}


export function modifyStrokeDash(result: any, spec: any) {

    extendLine(result, spec);
    const uniqueColors = findUniqueLines(result, lineSelector);
    if (uniqueColors.length > 1) {
        const lines = d3.select(result.view.container())
            .select("svg")
            .selectAll(lineSelector).nodes();
        // create a list of strokeDashArray values
        const strokeDashArray = ["10, 10", "0, 0", "40, 10", "20, 5", "6, 6"];
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


}