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

    console.log("Initializing worker...");

    worker = new Worker('worker.js');

    // Set up the onmessage handler for the worker
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {

      console.log("Worker received message:", event.data);

      const { id, translatedText } = event.data;
      const callback = callbacks.get(id);
      if (callback) {
        callback(translatedText);
        callbacks.delete(id); // Clean up after calling the callback
      }
    };

    worker.onerror = function (error) {
      console.error("Worker error:", error);
    };
  }
}

function translateBraille(text: string): Promise<string> {
  initializeWorker(); // Ensure the worker is ready before sending a message

  return new Promise((resolve, reject) => {
    if (worker) {
      const id = messageId++;
      callbacks.set(id, (brailleText: string) => {
        resolve(brailleText);
      });
      const message: WorkerMessage = {
        id,
        text: text,
        tableName: "en-ueb-g2.ctb" // Specify the Braille translation table
      };
      worker.postMessage(message);
    } else {
      reject(new Error("Worker is not initialized"));
    }
  });
}


// function translateBraille(text: string, callback: (brailleText: string) => void): void {

//   console.log("Translating text:", text);

//   initializeWorker(); // Ensure the worker is ready before sending a message

//   if (worker) {
//     const id = messageId++;

//     console.log("Sending message with ID:", id);

//     callbacks.set(id, callback);

//     const message: WorkerMessage = {
//       id,
//       text: text,
//       tableName: "en-ueb-g2.ctb" // Specify the Braille translation table
//     };
//     worker.postMessage(message);
//   }
// }


// function translateBraille(text: string, callback: (brailleText: string) => void): void {
//   initializeWorker(); // Ensure the worker is ready before sending a message
//   if (worker) {
//     const id = messageId++;
//     callbacks.set(id, callback);
//     const message: WorkerMessage = {
//       id,
//       text: text,
//       tableName: "en-ueb-g2.ctb" // Specify the Braille translation table
//     };
//     worker.postMessage(message);
//   }
// }



function terminateWorker(): void {
  if (worker) {
    worker.terminate(); // Terminate the current worker
    worker = null; // Clear the worker variable so a new one can be created next time
  }
}

export { translateBraille, terminateWorker };


