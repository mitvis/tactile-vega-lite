import { For } from 'solid-js';
import { editorState, setEditorState } from '../../store';
import { FieldSelector } from './FieldSelector';
import { TypeSelector } from './TypeSelector';
import { STROKE_DASH_PATTERNS, STROKE_DASH_LABELS } from '../../utils/constants';
import { StrokeDashPattern } from '../../types';

export function StrokeDashEncodingEditor() {
  const handleStrokeDashToggle = (pattern: StrokeDashPattern, checked: boolean) => {
    const currentRange = editorState.encodings.strokeDash?.scale?.range || [];
    let newRange: StrokeDashPattern[];

    if (checked) {
      newRange = [...currentRange, pattern];
    } else {
      newRange = currentRange.filter((p) => p !== pattern);
    }

    setEditorState('encodings', 'strokeDash', 'scale', 'range', newRange);
  };

  const isPatternSelected = (pattern: StrokeDashPattern) => {
    const range = editorState.encodings.strokeDash?.scale?.range || [];
    return range.includes(pattern);
  };

  return (
    <div class="encoding-section">
      <h3>Stroke Dash (for Lines)</h3>

      <FieldSelector
        label="Field"
        value={editorState.encodings.strokeDash?.field || null}
        onChange={(field) =>
          setEditorState('encodings', 'strokeDash', 'field', field)
        }
        fields={editorState.dataFields}
      />

      <TypeSelector
        value={editorState.encodings.strokeDash?.type || null}
        onChange={(type) =>
          setEditorState('encodings', 'strokeDash', 'type', type)
        }
      />

      <div class="form-group">
        <label class="form-label">Stroke Dash Patterns</label>
        <div class="pattern-list">
          <For each={STROKE_DASH_PATTERNS}>
            {(pattern) => (
              <label class="pattern-option">
                <input
                  type="checkbox"
                  checked={isPatternSelected(pattern)}
                  onChange={(e) =>
                    handleStrokeDashToggle(pattern, e.currentTarget.checked)
                  }
                />
                <span>{STROKE_DASH_LABELS[pattern]}</span>
              </label>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
