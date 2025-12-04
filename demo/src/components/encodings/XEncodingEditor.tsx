import { editorState, setEditorState } from '../../store';
import { FieldSelector } from './FieldSelector';
import { TypeSelector } from './TypeSelector';
import { AggregateSelector } from './AggregateSelector';
import { TimeUnitSelector } from './TimeUnitSelector';

export function XEncodingEditor() {
  return (
    <div class="encoding-section">
      <h3>X Axis</h3>

      <FieldSelector
        label="Field"
        value={editorState.encodings.x?.field || null}
        onChange={(field) =>
          setEditorState('encodings', 'x', {
            field,
            type: editorState.encodings.x?.type || null,
          })
        }
        fields={editorState.dataFields}
      />

      <TypeSelector
        value={editorState.encodings.x?.type || null}
        onChange={(type) =>
          setEditorState('encodings', 'x', 'type', type)
        }
      />

      <AggregateSelector
        value={editorState.encodings.x?.aggregate}
        onChange={(aggregate) =>
          setEditorState('encodings', 'x', 'aggregate', aggregate)
        }
      />

      <TimeUnitSelector
        value={editorState.encodings.x?.timeUnit}
        onChange={(timeUnit) =>
          setEditorState('encodings', 'x', 'timeUnit', timeUnit)
        }
        fieldType={editorState.encodings.x?.type || null}
      />
    </div>
  );
}
