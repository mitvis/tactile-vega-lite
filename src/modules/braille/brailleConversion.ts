const worker = new Worker('worker.js');
const d3 = require('d3');

import { selectText } from "./selectText";
import { selectLabelText } from "./selectLabelText";

async function convertToBraille(result: any, spec: any) {
  await selectLabelText(result, '.mark-text.role-axis-label', spec);
  // selectLabelText(result, '.mark-text.role-legend-label text', spec);
  if (spec.title && spec.title.subtitle !== undefined) {
    await selectText(result, '.mark-text.role-title-subtitle text', spec);
  }

  await selectText(result, '.mark-text.role-axis-title text', spec);
  await selectText(result, '.mark-text.role-legend-title text', spec);
  await selectText(result, '.mark-text.role-title-text text', spec);
}

export { convertToBraille };

