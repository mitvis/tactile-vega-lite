
import { convertToBraille } from "./braille/brailleConversion";

function modifySvg(result:any, spec:any) {
    // convert text to braille
    convertToBraille(result, spec)

    // Adjust axis labels orientation 
    

    // Changing color to textures


  }
  
  // Export the function if using modules
  export { modifySvg };