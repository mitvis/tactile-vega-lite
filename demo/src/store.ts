import { createStore } from 'solid-js/store';
import { EditorState } from './types';

/**
 * Initial state for the editor
 */
const initialState: EditorState = {
  // Chart configuration
  chartType: 'bar',
  title: '',

  // Data source
  dataSource: 'url',
  dataUrl: 'https://raw.githubusercontent.com/vega/vega-datasets/main/data/gapminder.json',
  inlineDataFormat: 'json',
  inlineDataText: '',
  parsedData: null,
  dataFields: null,

  // Data transforms
  filterExpression: null,

  // Mark configuration
  mark: {
    type: 'bar',
  },

  // Encodings
  encodings: {},

  // UI state
  showJsonViewer: false,
  isLoadingData: false,
  dataError: null,

  // Generated spec
  generatedSpec: null,
};

/**
 * Global reactive store for editor state
 */
export const [editorState, setEditorState] = createStore<EditorState>(initialState);

/**
 * Reset the editor state to initial values
 */
export function resetEditorState() {
  setEditorState(initialState);
}

/**
 * Clear all encodings
 */
export function clearEncodings() {
  setEditorState('encodings', {});
}

/**
 * Clear specific encoding
 */
export function clearEncoding(channel: keyof EditorState['encodings']) {
  setEditorState('encodings', channel, undefined);
}
