import { editorState, setEditorState } from '../../store';
import { FieldSelector } from './FieldSelector';

export function XOffsetEncodingEditor() {
  return (
    <div class="encoding-section">
      <h3>X Offset (for Grouped Bars)</h3>

      <FieldSelector
        label="Field"
        value={editorState.encodings.xOffset?.field || null}
        onChange={(field) =>
          setEditorState('encodings', 'xOffset', {
            field,
          })
        }
        fields={editorState.dataFields}
      />
    </div>
  );
}
