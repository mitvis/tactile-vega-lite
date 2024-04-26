const d3 = require("d3");

function adjustYTitle(result: any, spec: any) {
    console.log("adjustYTitle");
    const yAxis = d3.select(result.view.container()).select("svg").selectAll('.mark-text.role-axis-title').nodes()[1];
    // get yAxis.text
    const yAxisText = yAxis.querySelector('text');
    yAxisText.setAttribute('text-anchor', 'start');
    // move yAxisText upwards
    const transform = yAxisText.getAttribute('transform');
    const translateMatch = transform.match(/translate\(([^)]+)\)/);
    if (translateMatch) {
        const [x, y] = translateMatch[1].split(',').map(parseFloat);
        const newY = y - 20;
        const newTransform = `translate(${x},${newY})`;
        yAxisText.setAttribute('transform', newTransform);
    }

}

export { adjustYTitle };