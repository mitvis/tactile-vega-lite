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

// Global worker URL configuration
// Default to CDN, can be overridden by setWorkerUrl()
let workerUrl: string;

/**
 * Set the URL for the braille translation worker
 * @param url - URL to the worker file
 */
export function setWorkerUrl(url: string): void {
  workerUrl = url;
  // If worker is already initialized, terminate it so it gets reinitialized with new URL
  if (worker) {
    terminateWorker();
  }
}

// Function to initialize or reinitialize the worker
function initializeWorker(): void {
  // Check if the worker exists and is active; if not, create a new one
  if (!worker && workerUrl) {

    worker = new Worker(workerUrl);

    // Set up the onmessage handler for the worker
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {

      const { id, translatedText } = event.data;
      const callback = callbacks.get(id);
      if (callback) {
        callback(translatedText);
        callbacks.delete(id); // Clean up after calling the callback
      }
    };

    worker.onerror = function (error) {
      console.error("Worker error:", workerUrl, error);
    };
  }
}

function translateBraille(text: string): Promise<string> {
  initializeWorker(); // Ensure the worker is ready before sending a message

  return new Promise((resolve, reject) => {
    if (worker) {
      const id = messageId++;
      callbacks.set(id, (brailleText: string) => {
        console.log('translated: ', brailleText)
        resolve(brailleText);
      });
      const message: WorkerMessage = {
        id,
        text: text,
        tableName: "en-ueb-g2.ctb"
      };
      worker.postMessage(message);
    } else {
      reject(new Error("Worker is not initialized"));
    }
  });
}

function terminateWorker(): void {
  if (worker) {
    worker.terminate(); // Terminate the current worker
    worker = null; // Clear the worker variable so a new one can be created next time
  }
}

export { translateBraille, terminateWorker };


