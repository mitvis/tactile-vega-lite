
import { convertToBraille } from "../braille/brailleConversion";
import { applyTexturesToVegaLiteChart } from "../texture/changeTexture";
import { staggerXAxisLabels } from "./staggerXAxisLabels";
import { adjustYTitle } from "./adjustYTitle";
import { modifyStrokeDash } from "./modifyStrokeDash";
import { initSvgPatterns } from "../texture/initializeTexture";

// modify the bar mark
function modifyBar(result: any, spec: any) {
  const textureMarkSelector = '.mark-rect.role-mark.marks path';
  applyTexturesToVegaLiteChart(spec, result, textureMarkSelector, '.mark-symbol.role-legend-symbol path');
  staggerXAxisLabels(result, spec);
  adjustYTitle(result, spec);
  // convert text to braille
  // convertToBraille(result, spec);
}

// modify the line mark
function modifyLine(result: any, spec: any) {
  // convert text to braille
  // convertToBraille(result, spec);
  staggerXAxisLabels(result, spec);
  modifyStrokeDash(result, spec);
}


// modify the arc mark
function modifyArc(result: any, spec: any) {
  // convert text to braille
  // convertToBraille(result, spec);
  const textureMarkSelector = '.mark-arc.role-mark.marks path';
  applyTexturesToVegaLiteChart(spec, result, textureMarkSelector, '.mark-symbol.role-legend-symbol path');
}

// modify the Point mark 
function modifyPoint(result: any, spec: any) {
  // convert text to braille
  // convertToBraille(result, spec);
  const textureMarkSelector = '.mark-symbol.role-mark.marks path';
  applyTexturesToVegaLiteChart(spec, result, textureMarkSelector, '.mark-symbol.role-legend-symbol path');

}



function modifySvg(result: any, spec: any) {

  initSvgPatterns();

  convertToBraille(result, spec);

  let textureMarkSelector = "";
  let legendSymbolSelector = "";
  if (spec.mark === "arc" || spec.mark.type === "arc") {
    textureMarkSelector = '.mark-arc.role-mark.marks path';
    legendSymbolSelector = '.mark-symbol.role-legend-symbol path';
  } else if (spec.mark === "bar" || spec.mark.type === "bar") {
    textureMarkSelector = '.mark-rect.role-mark.marks path';
    legendSymbolSelector = '.mark-symbol.role-legend-symbol path';
  }

  applyTexturesToVegaLiteChart(spec, result, textureMarkSelector, legendSymbolSelector);
}


// Export the function if using modules
export { modifySvg };