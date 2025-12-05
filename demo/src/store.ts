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

  // Top-level spec properties
  description: undefined,
  width: undefined,
  height: undefined,
  config: undefined,
  transforms: undefined,

  // UI state
  showJsonViewer: false,
  isLoadingData: false,
  dataError: null,
};

/**
 * Global reactive store for editor state
 */
export const [editorState, setEditorState] = createStore<EditorState>(initialState);

/**
 * Reset the editor state to initial values
 */
export function resetEditorState() {
  // Manually set each property to ensure nested objects are fully replaced
  setEditorState('chartType', initialState.chartType);
  setEditorState('title', initialState.title);
  setEditorState('dataSource', initialState.dataSource);
  setEditorState('dataUrl', initialState.dataUrl);
  setEditorState('inlineDataFormat', initialState.inlineDataFormat);
  setEditorState('inlineDataText', initialState.inlineDataText);
  setEditorState('parsedData', initialState.parsedData);
  setEditorState('dataFields', initialState.dataFields);
  setEditorState('filterExpression', initialState.filterExpression);
  setEditorState('mark', { ...initialState.mark });
  setEditorState('encodings', {}); // Clear all encodings

  // Reset top-level spec properties
  setEditorState('description', initialState.description);
  setEditorState('width', initialState.width);
  setEditorState('height', initialState.height);
  setEditorState('config', initialState.config);
  setEditorState('transforms', initialState.transforms);

  setEditorState('showJsonViewer', initialState.showJsonViewer);
  setEditorState('isLoadingData', initialState.isLoadingData);
  setEditorState('dataError', initialState.dataError);
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
