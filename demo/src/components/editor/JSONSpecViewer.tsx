import { Show, createSignal } from 'solid-js';
import { editorState } from '../../store';

export function JSONSpecViewer() {
  const [isExpanded, setIsExpanded] = createSignal(false);

  const formattedSpec = () => {
    if (!editorState.generatedSpec) return 'No spec generated yet';
    return JSON.stringify(editorState.generatedSpec, null, 2);
  };

  const copyToClipboard = () => {
    if (editorState.generatedSpec) {
      navigator.clipboard.writeText(formattedSpec());
    }
  };

  return (
    <div class="json-viewer">
      <div class="json-viewer-header">
        <button
          class="button button-secondary"
          onClick={() => setIsExpanded(!isExpanded())}
        >
          {isExpanded() ? 'Hide' : 'Show'} JSON Specification
        </button>
        <Show when={isExpanded() && editorState.generatedSpec}>
          <button class="button button-secondary" onClick={copyToClipboard}>
            Copy JSON
          </button>
        </Show>
      </div>

      <Show when={isExpanded()}>
        <pre class="json-display">
          <code>{formattedSpec()}</code>
        </pre>
      </Show>
    </div>
  );
}
