const d3 = require("d3");

export function modifyStrokeDash(result: any, spec: any) {
    // select all paths under mark-line role-mark layer_0_marks
    const paths = d3.select(result.view.container()).select("svg").selectAll('.role-mark.role-line.layer_0_marks path').nodes();
    console.log(paths);
    paths.attr('stroke-dasharray', '8, 4');
}