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
    tableName: "en-ueb-g2.ctb"
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

export { getBraille };