const worker = new Worker('worker.js');
const d3 = require('d3');

import { selectText } from "./selectText";
import { renderDescription } from "./renderDescription";

function convertToBraille(result: any, spec: any) {

  selectText(result, '.mark-text.role-axis-label text', spec);
  selectText(result, '.mark-text.role-axis-title text', spec);
  selectText(result, '.mark-text.role-legend-label text', spec)
  selectText(result, '.mark-text.role-legend-title text', spec);
  selectText(result, '.mark-text.role-title-text text', spec);
}

export { convertToBraille };

