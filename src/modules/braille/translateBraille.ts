// Import the Worker and any necessary libraries
const worker = new Worker('worker.js');
const d3 = require('d3'); // Assuming d3 is used elsewhere in your application

// Initialize messageId and callbacks Map outside of the translateBraille function
let messageId = 0;
const callbacks = new Map();

// Set up the onmessage handler for the worker only once, outside the translateBraille function
worker.onmessage = (event) => {
  const { id, translatedText } = event.data;
  const callback = callbacks.get(id);
  if (callback) {
    callback(translatedText);
    callbacks.delete(id); // Clean up after calling the callback
  }
};

// The translateBraille function sends messages to the worker and registers callbacks
function translateBraille(text:string, callback: (brailleText: string) => void) {
  const id = messageId++;
  callbacks.set(id, callback);
  worker.postMessage({
    id,
    text: text,
    tableName: "en-ueb-g2.ctb" // Specify the Braille translation table
  });
}

function terminateWorker() {
  worker.postMessage({ action: 'terminate' }); // This will be caught by the worker's 'message' event listener
}

export { translateBraille, terminateWorker };


