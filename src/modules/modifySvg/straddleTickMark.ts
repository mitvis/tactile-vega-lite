const d3 = require('d3');

export function adjustLineTransforms(result: any, spec: any) {
    // Select the second g element with the class "mark-group role-axis"
    const axisGroup = d3.select(result.view.container())
        .selectAll('g.mark-group.role-axis')
        .filter((d: any, i: number) => i === 2); // Select the second group (index 1)

    // Select the nested g element with the class "mark-rule role-axis-tick"
    const tickGroup = axisGroup.select('g.mark-rule.role-axis-tick');

    // Process all line elements except the first one
    tickGroup.selectAll('line')
        // .filter((d: any, i: number) => i !== 0) // Skip the first line element
        .each(function (this: SVGLineElement) { // Use a regular function to access 'this'
            const line = d3.select(this);

            // Parse the x2 and y2 attributes to calculate the line length
            const x2 = parseFloat(line.attr('x2')) || 0;
            const y2 = parseFloat(line.attr('y2')) || 0;
            const length = Math.sqrt(x2 ** 2 + y2 ** 2); // Length of the line

            // Extract the current transform attribute (e.g., translate(0, 500))
            const transform = line.attr('transform');
            const [, x, y] = /translate\(([-\d.]+),\s*([-\d.]+)\)/.exec(transform) || [null, 0, 0];
            const newX = parseFloat(String(x)) + length / 2; // Adjust x position by half the line length
            const newY = parseFloat(String(y)); // Ensure y is a string

            // Update the transform attribute
            line.attr('transform', `translate(${newX.toString()}, ${newY})`);
        });
}
