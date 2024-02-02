importScripts("lib/build-no-tables-utf32.js");
importScripts("lib/build-no-tables-utf16.js");
importScripts("lib/easy-api.js");

self.onmessage = (event) => {
  liblouis.enableOnDemandTableLoading("lib/tables/");
  const { id, text, tableName } = event.data;
  const translatedText = liblouis.translateString(tableName, text);
  
  console.log("id: ", id, "originaln text: ", text, "translatedText: ", translatedText);
  self.postMessage({ id, translatedText });
};
