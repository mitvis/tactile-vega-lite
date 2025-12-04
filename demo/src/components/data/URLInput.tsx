import { Show } from 'solid-js';
import { editorState, setEditorState } from '../../store';
import { TextInput } from '../atoms/TextInput';
import { Button } from '../atoms/Button';
import { introspectDataFromUrl } from '../../utils/dataIntrospection';

export function URLInput() {
  const handleLoad = async () => {
    if (!editorState.dataUrl) {
      setEditorState('dataError', 'Please enter a URL');
      return;
    }

    setEditorState('isLoadingData', true);
    setEditorState('dataError', null);

    try {
      const { fields, data } = await introspectDataFromUrl(editorState.dataUrl);
      setEditorState('dataFields', fields);
      setEditorState('parsedData', data);
      setEditorState('dataError', null);
    } catch (error) {
      setEditorState('dataError', error instanceof Error ? error.message : 'Failed to load data');
      setEditorState('dataFields', null);
      setEditorState('parsedData', null);
    } finally {
      setEditorState('isLoadingData', false);
    }
  };

  return (
    <div>
      <TextInput
        label="Data URL"
        value={editorState.dataUrl}
        onInput={(value) => setEditorState('dataUrl', value)}
        type="url"
        placeholder="https://example.com/data.json"
        disabled={editorState.isLoadingData}
      />

      <Button
        onClick={handleLoad}
        loading={editorState.isLoadingData}
        disabled={!editorState.dataUrl}
      >
        Load Data
      </Button>

      <Show when={editorState.dataError}>
        <div class="error-message">{editorState.dataError}</div>
      </Show>

      <Show when={editorState.dataFields && !editorState.dataError}>
        <div class="success-message">
          Loaded {editorState.dataFields?.length} fields from {editorState.parsedData?.length} rows
        </div>
      </Show>
    </div>
  );
}
