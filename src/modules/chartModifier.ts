
import { convertToBraille } from "./braille/brailleConversion";
import { applyTexturesToVegaLiteChart } from "./texture/changeTexture";

function modifySvg(result:any, spec:any) {

  
    

    // convert text to braille
    convertToBraille(result, spec)
    
    // Changing color to textures
    let textureMarkSelector = '';
    if (spec.mark.type === "circle") {
      textureMarkSelector = '.mark-symbol.role-mark.marks path';
    } else {
      textureMarkSelector = '.mark-rect.role-mark.marks path';
    }

    applyTexturesToVegaLiteChart(spec, result, textureMarkSelector, '.mark-symbol.role-legend-symbol path');

  }

  
  // Export the function if using modules
  export { modifySvg };