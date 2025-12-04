import { editorState, setEditorState } from '../../store';
import { FieldSelector } from './FieldSelector';
import { TypeSelector } from './TypeSelector';
import { AggregateSelector } from './AggregateSelector';
import { TimeUnitSelector } from './TimeUnitSelector';

export function YEncodingEditor() {
  return (
    <div class="encoding-section">
      <h3>Y Axis</h3>

      <FieldSelector
        label="Field"
        value={editorState.encodings.y?.field || null}
        onChange={(field) =>
          setEditorState('encodings', 'y', {
            field,
            type: editorState.encodings.y?.type || null,
          })
        }
        fields={editorState.dataFields}
      />

      <TypeSelector
        value={editorState.encodings.y?.type || null}
        onChange={(type) =>
          setEditorState('encodings', 'y', 'type', type)
        }
      />

      <AggregateSelector
        value={editorState.encodings.y?.aggregate}
        onChange={(aggregate) =>
          setEditorState('encodings', 'y', 'aggregate', aggregate)
        }
      />

      <TimeUnitSelector
        value={editorState.encodings.y?.timeUnit}
        onChange={(timeUnit) =>
          setEditorState('encodings', 'y', 'timeUnit', timeUnit)
        }
        fieldType={editorState.encodings.y?.type || null}
      />
    </div>
  );
}
