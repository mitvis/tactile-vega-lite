const worker = new Worker('worker.js');
import * as d3 from 'd3';

import { selectText } from "./selectText";
import { selectLabelText } from "./selectLabelText";

async function convertToBraille(result: any, spec: any) {
  try {
    await result.view.runAsync(); // Ensures the rendering is complete
    
    const tasks = [
      selectLabelText(result, '.mark-text.role-axis-label', spec),
      selectText(result, '.mark-text.role-axis-title text', spec),
      selectText(result, '.mark-text.role-legend-title text', spec),
      selectText(result, '.mark-text.role-legend-label text', spec),
      selectText(result, '.mark-text.role-title-text text', spec),
    ];

    await Promise.all(tasks); // Wait for all tasks to complete
  } catch (error) {
    console.error('Failed to translate axis title:', error);
  }
}

export { convertToBraille };

