import * as d3 from "d3";

function adjustYTitle(result: any, spec: any) {
    const axisTitles = d3.select(result.view.container()).select("svg").selectAll('.mark-text.role-axis-title').nodes();

    // Defensive: Only proceed if we have at least 2 axis titles
    if (axisTitles.length < 2) {
        console.warn('adjustYTitle: Expected 2 axis titles, found', axisTitles.length);
        return result;
    }

    const yAxis = axisTitles[1] as Element;
    const yAxisText = yAxis?.querySelector('text');

    // Null check before setAttribute
    if (!yAxisText) {
        console.warn('adjustYTitle: Y-axis text element not found');
        return result;
    }

    yAxisText.setAttribute('text-anchor', 'start');
    // move yAxisText upwards
    const transform = yAxisText.getAttribute('transform');
    const translateMatch = transform?.match(/translate\(([^)]+)\)/);
    if (translateMatch) {
        const [x, y] = translateMatch[1].split(',').map(parseFloat);
        const newY = y - 20;
        const newTransform = `translate(${x},${newY})`;
        yAxisText.setAttribute('transform', newTransform);
    }

    return result;
}

export { adjustYTitle };