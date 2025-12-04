import { Show } from 'solid-js';
import { editorState, setEditorState } from '../../store';
import { TextArea } from '../atoms/TextArea';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { parseInlineData, inferFieldTypes } from '../../utils/dataIntrospection';

export function InlineDataEditor() {
  const formatOptions = [
    { value: 'json', label: 'JSON' },
    { value: 'csv', label: 'CSV' },
  ];

  const handleParse = () => {
    if (!editorState.inlineDataText) {
      setEditorState('dataError', 'Please paste some data');
      return;
    }

    setEditorState('dataError', null);

    try {
      const data = parseInlineData(
        editorState.inlineDataText,
        editorState.inlineDataFormat
      );
      setEditorState('parsedData', data);

      const fields = inferFieldTypes(data);
      setEditorState('dataFields', fields);
      setEditorState('dataError', null);
    } catch (error) {
      setEditorState('dataError', error instanceof Error ? error.message : 'Failed to parse data');
      setEditorState('dataFields', null);
      setEditorState('parsedData', null);
    }
  };

  return (
    <div>
      <Select
        label="Data Format"
        value={editorState.inlineDataFormat}
        onChange={(value) => setEditorState('inlineDataFormat', value as any)}
        options={formatOptions}
      />

      <TextArea
        label="Paste Data"
        value={editorState.inlineDataText}
        onInput={(value) => setEditorState('inlineDataText', value)}
        placeholder={
          editorState.inlineDataFormat === 'json'
            ? '[{"field1": "value1", "field2": 123}, ...]'
            : 'field1,field2,field3\nvalue1,123,value2\n...'
        }
        rows={15}
      />

      <Button onClick={handleParse} disabled={!editorState.inlineDataText}>
        Parse Data
      </Button>

      <Show when={editorState.dataError}>
        <div class="error-message">{editorState.dataError}</div>
      </Show>

      <Show when={editorState.dataFields && !editorState.dataError}>
        <div class="success-message">
          Parsed {editorState.dataFields?.length} fields from {editorState.parsedData?.length} rows
        </div>
      </Show>
    </div>
  );
}
