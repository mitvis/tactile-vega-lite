const worker = new Worker('worker.js');
const d3 = require('d3');

import { selectText } from "./selectText";

function convertToBraille(result:any, spec:any) {

  selectText(result, '.mark-text.role-axis-label text', spec);
  selectText(result, '.mark-text.role-axis-title text', spec);
  selectText(result, '.mark-text.role-legend-label text', spec)
  selectText(result, '.mark-text.role-legend-title text', spec);

}

export { convertToBraille };

