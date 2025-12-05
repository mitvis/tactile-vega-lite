/**
 * Tactile Vega-Lite braille translation worker
 * Loads bundled liblouis files for braille translation
 */

// Load liblouis runtime and API from bundled files
// Only load UTF-16 build since JavaScript uses UTF-16 internally
importScripts("./lib/build-no-tables-utf16.js");
importScripts("./lib/easy-api.js");

// Enable on-demand table loading from bundled tables directory
// Base path should point to tables directory with trailing slash
liblouis.enableOnDemandTableLoading("./lib/tables/");

self.onmessage = (event) => {

  const { id, text, tableName } = event.data;

  try {
    // Translate text using liblouis
    // IMPORTANT: Use only the filename (not "tables/filename") for on-demand loading
    // The dynamic loader will intercept file lookups and fetch from TABLE_URL + filename
    const translatedText = liblouis.translateString(tableName || 'en-ueb-g2.ctb', text);

    // Send result back
    self.postMessage({
      id: id,
      translatedText: translatedText
    });
  } catch (error) {
    console.error('[worker] Translation error:', error);

    // Send error back
    self.postMessage({
      id: id,
      translatedText: text, // Fallback to original text
      error: error.message || 'Translation failed'
    });
  }
};

console.log('[worker] Tactile Vega-Lite braille worker initialized');
