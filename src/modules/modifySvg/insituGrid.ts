const d3 = require('d3');

export function addInSituGrids(result: any, spec: any) {

    // grid selector
    const gridSelector = ".grid";
    // select all grids
    const grid = d3.select(result.view.container())
        .select("svg")
        .selectAll(gridSelector).nodes();
    // bar selector 

    // select all bars

    grid.forEach((grid: any) => {
        let x1 = grid.getAttribute("x1");
        let x2 = grid.getAttribute("x2");
        let y1 = grid.getAttribute("y1");
        let y2 = grid.getAttribute("y2");
        let stroke = grid.getAttribute("stroke");
        let strokeWidth = grid.getAttribute("stroke-width");
        let opacity = grid.getAttribute("opacity");
        let transform = grid.getAttribute("transform");
        let newGrid = d3.select(result.view.container())
            .select("svg")
            .append("line")
            .attr("x1", x1)
            .attr("x2", x2)
            .attr("y1", y1)
            .attr("y2", y2)
            .attr("stroke", stroke)
            .attr("stroke-width", strokeWidth)
            .attr("opacity", opacity)
            .attr("transform", transform);
    });
}