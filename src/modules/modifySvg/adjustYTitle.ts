const d3 = require("d3");

function adjustYTitle(result: any, spec: any) {
    const yAxis = d3.select(result.view.container()).select("svg").selectAll('.mark-text.role-axis-title').nodes()[1];
    // get yAxis.text
    const yAxisText = yAxis.querySelector('text');
    // update text-anchor attribute to middle
    yAxisText.setAttribute('text-anchor', 'start');

}

export { adjustYTitle };