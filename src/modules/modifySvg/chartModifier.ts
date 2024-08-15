
import { convertToBraille } from "../braille/brailleConversion";
import { applyTexturesToVegaLiteChart } from "../texture/changeTexture";
import { staggerXAxisLabels } from "./staggerXAxisLabels";
import { adjustYTitle } from "./adjustYTitle";
import { modifyStrokeDash } from "./modifyStrokeDash";
import { initSvgPatterns } from "../texture/initializeTexture";
import { modifyLegendSymbol } from "./modifyLegendSymbol";
// modify the Point mark 
function modifyPoint(result: any, spec: any) {
  // convert text to braille
  // convertToBraille(result, spec);
  const textureMarkSelector = '.mark-symbol.role-mark.marks path';
  applyTexturesToVegaLiteChart(spec, result, textureMarkSelector, '.mark-symbol.role-legend-symbol path');

}



async function modifySvg(result: any, spec: any) {

  initSvgPatterns();

  await convertToBraille(result, spec);

  modifyLegendSymbol(result, spec); // make the legend symbol to be a rectangle with width twice the height


  let textureMarkSelector = "";
  let legendSymbolSelector = "";

  if (spec.mark === "arc" || spec.mark.type === "arc") {
    textureMarkSelector = '.mark-arc.role-mark.marks path';
    legendSymbolSelector = '.mark-symbol.role-legend-symbol path';
    applyTexturesToVegaLiteChart(spec, result, textureMarkSelector, legendSymbolSelector);

  } else if (spec.mark === "bar" || spec.mark.type === "bar") {
    staggerXAxisLabels(result, spec);
    textureMarkSelector = '.mark-rect.role-mark.marks path';
    legendSymbolSelector = '.mark-symbol.role-legend-symbol path';
    applyTexturesToVegaLiteChart(spec, result, textureMarkSelector, legendSymbolSelector);
    adjustYTitle(result, spec);

  }

  if (spec.mark === "line" || spec.mark.type === "line") {
    staggerXAxisLabels(result, spec);
    modifyStrokeDash(result, spec);
    adjustYTitle(result, spec);
  }

  if (spec.mark === "point" || spec.mark.type === "point") {
    staggerXAxisLabels(result, spec);
    // change all colors to black
    modifyPoint(result, spec);
    adjustYTitle(result, spec);
  }
}


// Export the function if using modules
export { modifySvg };