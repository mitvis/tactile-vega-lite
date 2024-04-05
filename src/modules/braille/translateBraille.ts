// // Import the Worker and any necessary libraries
// const worker = new Worker('worker.js');

// // Initialize messageId and callbacks Map outside of the translateBraille function
// let messageId = 0;
// const callbacks = new Map();

// // Set up the onmessage handler for the worker only once, outside the translateBraille function
// worker.onmessage = (event) => {
//   const { id, translatedText } = event.data;
//   const callback = callbacks.get(id);
//   if (callback) {
//     callback(translatedText);
//     callbacks.delete(id); // Clean up after calling the callback
//   }
// };

// // The translateBraille function sends messages to the worker and registers callbacks
// function translateBraille(text:string, callback: (brailleText: string) => void) {
//   const id = messageId++;
//   callbacks.set(id, callback);
//   worker.postMessage({
//     id,
//     text: text,
//     tableName: "en-ueb-g2.ctb" // Specify the Braille translation table
//   });
// }

// function terminateWorker() {
//   worker.postMessage({ action: 'terminate' }); // This will be caught by the worker's 'message' event listener
// }

// Assuming the definition of the message structure sent to and received from the worker
interface WorkerMessage {
  id: number;
  text: string;
  tableName: string;
}

interface WorkerResponse {
  id: number;
  translatedText: string;
}

// Type for the worker, which may be null when not initialized
let worker: Worker | null = null;

let messageId = 0;
const callbacks = new Map<number, (brailleText: string) => void>();

// Function to initialize or reinitialize the worker
function initializeWorker(): void {
  // Check if the worker exists and is active; if not, create a new one
  if (!worker) {
    worker = new Worker('worker.js');

    // Set up the onmessage handler for the worker
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id, translatedText } = event.data;
      const callback = callbacks.get(id);
      if (callback) {
        callback(translatedText);
        callbacks.delete(id); // Clean up after calling the callback
      }
    };
  }
}

function translateBraille(text: string, callback: (brailleText: string) => void): void {
  initializeWorker(); // Ensure the worker is ready before sending a message
  if (worker) {
    const id = messageId++;
    callbacks.set(id, callback);
    const message: WorkerMessage = {
      id,
      text: text,
      tableName: "en-ueb-g2.ctb" // Specify the Braille translation table
    };
    worker.postMessage(message);
  }
}

function terminateWorker(): void {
  if (worker) {
    worker.terminate(); // Terminate the current worker
    worker = null; // Clear the worker variable so a new one can be created next time
  }
}

export { translateBraille, terminateWorker };


