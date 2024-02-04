const worker = new Worker('worker.js');
const d3 = require('d3');
let messageId = 0;
const callbacks = new Map<number, (brailleText: string) => void>();


function getBraille(text: string, callback:(brailleText: string) => void) {
  const id = messageId++;
  callbacks.set(id, callback);
  worker.postMessage({
    id, 
    text: text, 
    tableName: "unicode.dis,de-de-g0.utb"
  });

  worker.onmessage = (event) => {
    const { id, translatedText } = event.data;
    const callback = callbacks.get(id);
    if (callback) {
      callback(translatedText);
      callbacks.delete(id);  // Clean up
    }
  };
}

function selectText(result: any, svgSelectionCriteria:string) {
  // pass in class names as a string
  d3.select(result.view.container())
  .selectAll(svgSelectionCriteria)
  .each(function(this: SVGTextElement, d:any) {
    getBraille(d.text, (brailleText: string) => {
      d3.select(this).text(brailleText);
    });
  });
}

function convertToBraille(result:any, spec:any) {
  // 
  selectText(result, '.mark-text.role-axis-label text');
  selectText(result, '.mark-text.role-axis-title text');
  selectText(result, '.mark-text.role-legend-label text')
  selectText(result, '.mark-text.role-legend-title text');
}

export { convertToBraille };

