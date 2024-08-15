// importScripts("lib/build-no-tables-utf32.js"), importScripts("lib/build-no-tables-utf16.js"), importScripts("lib/easy-api.js"), self.onmessage = t => { liblouis.enableOnDemandTableLoading("lib/tables/"); const { id: s, text: i, tableName: e } = t.data, l = liblouis.translateString(e, i); self.postMessage({ id: s, translatedText: l }) };


importScripts("lib/build-no-tables-utf32.js");
importScripts("lib/build-no-tables-utf16.js");
importScripts("lib/easy-api.js");

self.onmessage = (t) => {
    liblouis.enableOnDemandTableLoading("lib/tables/");

    const { id: s, text: i, tableName: e } = t.data;
    console.log("Text received for translation:", i);
    console.log("Translation table:", e);

    const l = liblouis.translateString(e, i);

    console.log("Translated Braille text:", l);

    self.postMessage({ id: s, translatedText: l });
};
