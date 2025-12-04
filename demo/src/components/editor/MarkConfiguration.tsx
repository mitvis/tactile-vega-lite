import { editorState } from '../../store';

export function MarkConfiguration() {
  return (
    <div class="form-group">
      <label class="form-label">Mark Type</label>
      <div class="form-value">{editorState.mark.type}</div>
      <p class="form-hint">Mark type is automatically set based on chart type</p>
    </div>
  );
}
