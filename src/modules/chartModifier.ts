
import { convertToBraille } from "./braille/brailleConversion";
import { correctRotation }from "./rotation/checkRotation";
import { applyTexturesToVegaLiteChart } from "./texture/changeTexture";

function modifySvg(result:any, spec:any) {
    // convert text to braille
    convertToBraille(result, spec)

    // Adjust axis labels orientation 
    correctRotation(result, '.mark-text.role-axis-title text');
    

    // Changing color to textures
    applyTexturesToVegaLiteChart(result, '.mark-rect.role-mark.marks path', '.mark-symbol.role-legend-symbol path');



  }
  
  // Export the function if using modules
  export { modifySvg };