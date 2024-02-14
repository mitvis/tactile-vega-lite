const d3 = require('d3');

function detectRotation(result:any, svgSelectionCriteria:string) {
    // function detectRotation: detect if text is rotated based on the d3 selector passed in 
    // pass in class names as a string
    d3.select(result.view.container())
    .selectAll(svgSelectionCriteria)
    .each(function(this: SVGTextElement, d:any) {

        // console.log(this.transform);
        var element = d3.select(this);
        var transform = element.attr('transform');

        // Splitting the transform attribute to separate translate and rotate
        var transforms = transform.split(' ');
        var translate = transforms[0]; // The translate part
        var rotate = transforms[1]; // The rotate part

        // if rotate exists and rotate is not 0, then set it to 0
        if (rotate && rotate !== "rotate(0)") {
            var newRotate = "rotate(0)";
            var newTransform = translate + ' ' + newRotate;
            element.attr('transform', newTransform);
        }
    });
}

function correctRotation(result:any, svgSelectionCriteria:string) {
    detectRotation(result, svgSelectionCriteria);
}

export { detectRotation, correctRotation};