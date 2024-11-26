const d3 = require("d3");
// import { findUniqueColors } from "../texture/findUniqueColors";
const legendSymbolSelector = '.mark-symbol.role-legend-symbol path';
const lineSelector = '.mark-line.role-mark.marks path';

function findUniqueLines(result: any, svgSelector: string): number {
    const lines = d3.select(result.view.container())
        .selectAll(svgSelector).nodes();
    return lines.length;
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
    const num_lines = findUniqueLines(result, lineSelector);
    // console.log("uniqueColors", uniqueColors);

    if (num_lines > 1) {
        // let strokeDashArray = ["10, 10", "0, 0", "40, 10", "20, 5", "6, 6"];
        let strokeDashArray = ["20, 10", "0, 0", "2, 4", "10, 10, 4, 10", "10, 10, 4, 4, 4, 10"];

        interface StrokeDashMap {
            [key: string]: string;
        }

        const strokeDashMapDict: StrokeDashMap = {
            "dashed": "20, 10",
            "solid": "0, 0",
            // "dotted": "40, 10",
            "dotted": "2, 4",
            // "dash-dot": "20, 5",
            "dash-dot": "10, 10, 4, 10",
            "dash-dot-dot": "10, 10, 4, 4, 4, 10"
        };

        // if spec.strokeDash.scale.range is definted, use it to set the strokeDashArray
        if (spec.encoding.strokeDash.scale.range) {
            for (let i = 0; i < spec.encoding.strokeDash.scale.range.length; i++) {
                strokeDashArray[i] = strokeDashMapDict[spec.encoding.strokeDash.scale.range[i]];
            }
            const lines = d3.select(result.view.container())
                .select("svg")
                .selectAll(lineSelector).nodes();
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


        } else {
            // if strokeDash.scale.range is not defined, use the default strokeDashArray
            const lines = d3.select(result.view.container())
                .select("svg")
                .selectAll(lineSelector).nodes();

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


}