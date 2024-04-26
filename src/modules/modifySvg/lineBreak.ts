const d3 = require("d3");

function breakBrailleIntoLines(textSelector: string, result: any, spec: any) {
    const text = d3.select(result.view.container()).select("svg").select(textSelector).node();
    // if text is longer than the spec.width, break it into multiple lines
    const textElement = text.querySelector('text');
    const textContent = textElement.textContent;
    const textWidth = textElement.getBBox().width;
    const textLength = textContent.length;
    const specWidth = spec.width;
    if (textWidth > specWidth) {
        // iterate through each word
    }
}