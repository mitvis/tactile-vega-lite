
import { convertToBraille } from "./braille/brailleConversion";
import { correctRotation }from "./rotation/checkRotation";
import { applyTexturesToVegaLiteChart } from "./texture/changeTexture";
import { resize } from "./resize/resize";

function modifySvg(result:any, spec:any) {
    // resize(result, 600, 400, spec)

    // convert text to braille
    convertToBraille(result, spec)

    // Adjust axis labels orientation 
    correctRotation(result, '.mark-text.role-axis-title text');
    

    // Changing color to textures
    let textureMarkSelector = '';
    if (spec.mark.type === "circle") {
      textureMarkSelector = '.mark-symbol.role-mark.marks path';
    } else {
      textureMarkSelector = '.mark-rect.role-mark.marks path';
    }

    applyTexturesToVegaLiteChart(result, textureMarkSelector, '.mark-symbol.role-legend-symbol path');

  }

  
  // Export the function if using modules
  export { modifySvg };