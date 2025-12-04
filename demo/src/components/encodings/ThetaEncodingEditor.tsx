import { editorState, setEditorState } from '../../store';
import { FieldSelector } from './FieldSelector';
import { TypeSelector } from './TypeSelector';
import { AggregateSelector } from './AggregateSelector';

export function ThetaEncodingEditor() {
  return (
    <div class="encoding-section">
      <h3>Theta (Angle)</h3>

      <FieldSelector
        label="Field"
        value={editorState.encodings.theta?.field || null}
        onChange={(field) =>
          setEditorState('encodings', 'theta', {
            field,
            type: editorState.encodings.theta?.type || null,
          })
        }
        fields={editorState.dataFields}
      />

      <TypeSelector
        value={editorState.encodings.theta?.type || null}
        onChange={(type) =>
          setEditorState('encodings', 'theta', 'type', type)
        }
      />

      <AggregateSelector
        value={editorState.encodings.theta?.aggregate}
        onChange={(aggregate) =>
          setEditorState('encodings', 'theta', 'aggregate', aggregate)
        }
      />
    </div>
  );
}
