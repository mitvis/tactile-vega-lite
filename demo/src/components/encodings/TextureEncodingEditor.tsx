import { For, Show } from 'solid-js';
import { editorState, setEditorState } from '../../store';
import { FieldSelector } from './FieldSelector';
import { TypeSelector } from './TypeSelector';
import { TEXTURE_TYPES, TEXTURE_LABELS } from '../../utils/constants';
import { TextureType } from 'tactile-vega-lite';

export function TextureEncodingEditor() {
  const handleTextureToggle = (texture: TextureType, checked: boolean) => {
    const currentRange = editorState.encodings.texture?.scale?.range || [];
    let newRange: TextureType[];

    if (checked) {
      newRange = [...currentRange, texture];
    } else {
      newRange = currentRange.filter((t) => t !== texture);
    }

    setEditorState('encodings', 'texture', 'scale', 'range', newRange);
  };

  const isTextureSelected = (texture: TextureType) => {
    const range = editorState.encodings.texture?.scale?.range || [];
    return range.includes(texture);
  };

  return (
    <div class="encoding-section">
      <h3>Texture</h3>

      <FieldSelector
        label="Field (optional)"
        value={editorState.encodings.texture?.field || null}
        onChange={(field) => setEditorState('encodings', 'texture', 'field', field)}
        fields={editorState.dataFields}
        placeholder="Use default texture"
      />

      <Show when={editorState.encodings.texture?.field}>
        <TypeSelector
          value={editorState.encodings.texture?.type || null}
          onChange={(type) => setEditorState('encodings', 'texture', 'type', type)}
        />
      </Show>

      <div class="form-group">
        <label class="form-label">Texture Patterns</label>
        <div class="texture-grid">
          <For each={TEXTURE_TYPES}>
            {(texture) => (
              <label class="texture-option">
                <input
                  type="checkbox"
                  checked={isTextureSelected(texture)}
                  onChange={(e) => handleTextureToggle(texture, e.currentTarget.checked)}
                />
                <span>{TEXTURE_LABELS[texture]}</span>
              </label>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
