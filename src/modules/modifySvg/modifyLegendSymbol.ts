const d3 = require('d3');

// function moveLegend(result: any, spec: any) {
//     const legendSelector = ".mark-group.role-legend-entry g";
//     const increment = 50;

//     // Select the group element using the provided selector
//     const group = document.querySelector(legendSelector);

//     console.log("group", group)

//     // Get the current 'transform' attribute value
//     let transform = group.getAttribute('transform');

//     console.log("transform", transform)

//     // Use a regular expression to extract the current translate values
//     const translateMatch = transform.match(/translate\(([\d.+-]+),([\d.+-]+)\)/);

//     if (translateMatch) {
//         // Extract current translateX and translateY values
//         let translateX = parseFloat(translateMatch[1]);
//         let translateY = parseFloat(translateMatch[2]);

//         // Increase the translateX by the specified increment
//         translateX += increment;

//         // Update the transform attribute with the new translateX and existing translateY
//         transform = `translate(${translateX},${translateY})`;
//         group.setAttribute('transform', transform);
//     } else {
//         // If no translate was found, add it
//         group.setAttribute('transform', `translate(${increment},0)`);

//     }
// }

export function modifyLegendSymbol(result: any, spec: any) {

    const legendSymbolSelector = ".mark-symbol.role-legend-symbol path";

    // moveLegend(result, spec);

    // select all legend symbols
    const legendSymbols = d3.select(result.view.container())
        .select("svg")
        .selectAll(legendSymbolSelector).nodes();

    // for each legend symbol, extend symbol to the left
    legendSymbols.forEach((symbol: any) => {
        // get the d attribute of the symbol
        let d = symbol.getAttribute("d");
        let transform = symbol.getAttribute('transform');

        // <g class="mark-symbol role-legend-symbol" pointer-events="none">
        //   <path transform="translate(28.5,28.5)" d="M-27.386,-27.386h54.772v54.772h-54.772Z" fill="#4c78a8" stroke="black" stroke-width="2" opacity="1" style="fill: url(&quot;#fill_black&quot;);"></path>
        // </g>
        // make the width of the symbol 2x larger and keep the height the same
        const matches = d.match(/M(-?\d+\.?\d*),(-?\d+\.?\d*)h(\d+\.?\d*)v(\d+\.?\d*)h-(\d+\.?\d*)Z/);
        const translateMatch = transform.match(/translate\(([\d.]+),([\d.]+)\)/);

        if (matches) {
            const x = parseFloat(matches[1]);
            const y = parseFloat(matches[2]);
            const width = parseFloat(matches[3]);
            const height = parseFloat(matches[4]);
            const translateX = parseFloat(translateMatch[1]);
            const translateY = parseFloat(translateMatch[2]);

            // Calculate new width (twice the height)
            const newWidth = 2 * height;

            // Update the 'd' attribute to make width twice the height
            d = `M${x},${y}h${newWidth}v${height}h-${newWidth}Z`;
            symbol.setAttribute('d', d);

            const newTranslateX = translateX - (newWidth) / 2;
            transform = `translate(${newTranslateX},${translateY})`;
            symbol.setAttribute('transform', transform);

        }
    });
}