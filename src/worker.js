importScripts("lib/build-no-tables-utf32.js");
importScripts("lib/build-no-tables-utf16.js");
importScripts("lib/easy-api.js");

self.onmessage = (event) => {
  liblouis.enableOnDemandTableLoading("lib/tables/");
  const { id, text, tableName } = event.data;
  const translatedText = liblouis.translateString(tableName, text);
  self.postMessage({ id, translatedText });
};
self.addEventListener('message', (event) => {
  if (event.data.action === 'terminate') {
    // Call lou_free() here to clean up before terminating the worker
    self.close(); // Terminates the worker
  }
});
