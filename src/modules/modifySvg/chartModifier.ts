
import { convertToBraille } from "../braille/brailleConversion";
import { applyTexturesToVegaLiteChart } from "../texture/changeTexture";
import { staggerXAxisLabels } from "./stagger";

// modify the bar mark
function modifyBar(result: any, spec: any) {
  // convert text to braille
  convertToBraille(result, spec);
  const textureMarkSelector = '.mark-rect.role-mark.marks path';
  applyTexturesToVegaLiteChart(spec, result, textureMarkSelector, '.mark-symbol.role-legend-symbol path');
  staggerXAxisLabels(result, spec);
}

// modify the line mark
function modifyLine(result: any, spec: any) {
  // convert text to braille
  convertToBraille(result, spec);
  staggerXAxisLabels(result, spec);
}


// modify the arc mark
function modifyArc(result: any, spec: any) {

  // convert text to braille
  convertToBraille(result, spec);

  const textureMarkSelector = '.mark-arc.role-mark.marks path';
  applyTexturesToVegaLiteChart(spec, result, textureMarkSelector, '.mark-symbol.role-legend-symbol path');
}





// modify the circle mark 
function modifyCircle(result: any, spec: any) {

  // convert text to braille
  convertToBraille(result, spec);

  const textureMarkSelector = '.mark-symbol.role-mark.marks path';
  applyTexturesToVegaLiteChart(spec, result, textureMarkSelector, '.mark-symbol.role-legend-symbol path');

}



function modifySvg(result: any, spec: any) {

  if (spec.mark === "arc" || spec.mark.type === "arc") {
    modifyArc(result, spec);
  } else if (spec.mark === "bar" || spec.mark.type === "bar") {
    modifyBar(result, spec);
  } else if (spec.mark === "circle" || spec.mark.type === "circle") {
    modifyCircle(result, spec);
  } else if (spec.mark === "line" || spec.mark.type === "line") {
    modifyLine(result, spec);
  } else {
    console.log("Oooop you are new! Unsupported mark type");
  }
}


// Export the function if using modules
export { modifySvg };