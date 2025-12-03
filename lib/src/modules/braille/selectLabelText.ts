import * as d3 from "d3";
import { translateBraille } from "./translateBraille";

async function selectLabelText(result: any, svgSelectionCriteria: string, spec: any) {
    // console.log("select label text");
    const axis = d3.select(result.view.container()).select("svg").selectAll(svgSelectionCriteria);
    const xAxis = axis.nodes()[0];
    const xAxisLabels = d3.select(xAxis).selectAll("text");
    const yAxis = axis.nodes()[1];
    const yAxisLabels = d3.select(yAxis).selectAll("text");


    try {
        // Translate every x-axis label to Braille
        await Promise.all(
            xAxisLabels.nodes().map(async function (this: SVGTextElement, node: SVGTextElement) {
                // const originalText = node.textContent?.toLowerCase() || '';
                // if original text is null then set it to empty string
                const originalText = node.textContent || '';
                const brailleText = await translateBraille(originalText);
                const textElement = d3.select(node);
                textElement.text(brailleText);

                // Set text-anchor to middle
                textElement.attr("text-anchor", "middle");
            })
        );
        // Translate every y-axis label to Braille
        await Promise.all(
            yAxisLabels.nodes().map(async function (this: SVGTextElement, node: SVGTextElement) {
                const originalText = node.textContent || '';
                const brailleText = await translateBraille(originalText);
                const textElement = d3.select(node);
                textElement.text(brailleText);

                // Set text-anchor to end
                textElement.attr("text-anchor", "end");
            })
        );
    } catch (error) {
        console.error("Error in selectLabelText: ", error);
    }
}

export { selectLabelText };