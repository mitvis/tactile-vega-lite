const d3 = require("d3");

export function initSvgPatterns(): void {
    // Select the SVG element
    const svg = d3.select("#tactile svg");

    // Define the patterns
    const defs = svg.append("defs");

    defs.append("pattern")
        .attr("id", "noFill")
        .attr("fill", "white")
        .attr("width", "1")
        .attr("height", "1")
        .attr("patternUnits", "userSpaceOnUse")
        .append("rect")
        .attr("width", "1")
        .attr("height", "1")

    defs.append("pattern")
        .attr("id", "solidGrayFill")
        .attr("width", "1")
        .attr("height", "1")
        .attr("patternUnits", "userSpaceOnUse")
        .append("rect")
        .attr("width", "1")
        .attr("height", "1")
        .attr("fill", "#808080");

    // diamond fill

    defs.append("pattern")
        .attr("id", "diamondFill")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", "13.23mm")
        .attr("height", "26.46mm")
        .attr("patternTransform", "scale(2) rotate(0)")
        .append("path")
        .attr("d", "M12.5 0L0 25l12.5 25L25 25 12.5 0zm25 50L25 75l12.5 25L50 75 37.5 50z")
        .attr("stroke-width", "1")
        .attr("stroke", "none")
        .attr("fill", "#000000")

    defs.append("pattern")
        .attr("id", "denseDottedFill")
        .attr("width", "2.5mm")
        .attr("height", "2.5mm")
        .attr("patternUnits", "userSpaceOnUse")
        .append("circle")
        .attr("cx", "1.25mm")
        .attr("cy", "1.25mm")
        .attr("r", "0.6mm")
        .attr("fill", "black");

    defs.append("pattern")
        .attr("id", "verticalFill")
        .attr("width", "5mm")
        .attr("height", "0.5mm")
        .attr("patternUnits", "userSpaceOnUse")
        .append("line")
        .attr("x1", "1.25mm")
        .attr("y1", "-1mm")
        .attr("x2", "1.25mm")
        .attr("y2", "1.5mm")
        .attr("stroke", "black")
        .attr("stroke-width", "1.3mm");

    defs.append("pattern")
        .attr("id", "horizontalFill")
        .attr("width", "0.5mm")
        .attr("height", "5mm")
        .attr("patternUnits", "userSpaceOnUse")
        .append("line")
        .attr("x1", "-1mm")
        .attr("y1", "1.25mm")
        .attr("x2", "1.5mm")
        .attr("y2", "1.25mm")
        .attr("stroke", "black")
        .attr("stroke-width", "1.3mm");

    defs.append("pattern")
        .attr("id", "dottedFill")
        .attr("width", "5mm")
        .attr("height", "5mm")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("fill", "black")
        .attr("stroke", "none")
        .append("circle")
        .attr("cx", "1.25mm")
        .attr("cy", "1.25mm")
        .attr("r", "1mm")
        .append("circle")
        .attr("cx", "6.25mm")
        .attr("cy", "6.25mm")
        .attr("r", "1mm");

    defs.append("pattern")
        .attr("id", "crossFill")
        .attr("width", "5.08mm") // Space between lines
        .attr("height", "5.08mm") // Pattern unit height
        .attr("patternUnits", "userSpaceOnUse")
        .append("line")
        .attr("x1", "2.54mm") // Center of the pattern width
        .attr("y1", "0mm")
        .attr("x2", "2.54mm")
        .attr("y2", "5.08mm") // Full height of the pattern
        .attr("stroke", "black")
        .attr("stroke-width", "0.8mm")
        .attr("stroke-dasharray", "1mm, 1mm"); // Creates a dashed effect

    defs.append("pattern")
        .attr("id", "diagonalLeftFill")
        .attr("width", "5.08mm")
        .attr("height", "5.08mm")
        .attr("patternUnits", "userSpaceOnUse")
        .append("line")
        .attr("x1", "-0.5mm")
        .attr("y1", "-1.27mm")
        .attr("x2", "7.12mm")
        .attr("y2", "6.35mm")
        .attr("stroke", "black")
        .attr("stroke-width", "0.8mm")
        .append("line")
        .attr("x1", "-1.77mm")
        .attr("y1", "2.54mm")
        .attr("x2", "2.04mm")
        .attr("y2", "-1.27mm")
        .attr("stroke", "black")
        .attr("stroke-width", "0.8mm");


    defs.append("pattern")
        .attr("id", "diagonalRightFill")
        .attr("width", "5.08mm")
        .attr("height", "5.08mm")
        .attr("patternUnits", "userSpaceOnUse")
        .append("line")
        .attr("x1", "7.12mm")
        .attr("y1", "-1.27mm")
        .attr("x2", "-0.5mm")
        .attr("y2", "6.35mm")
        .attr("stroke", "black")
        .attr("stroke-width", "0.8mm")
        .append("line")
        .attr("x1", "2.04mm")
        .attr("y1", "-1.27mm")
        .attr("x2", "-1.77mm")
        .attr("y2", "2.54mm")
        .attr("stroke", "black")
        .attr("stroke-width", "0.8mm")


}

