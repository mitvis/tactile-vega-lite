import { Show, createSignal, createMemo } from 'solid-js';
import { editorState } from '../../store';
import { buildSpecFromState } from '../../utils/specBuilder';

export function JSONSpecViewer() {
  const [isExpanded, setIsExpanded] = createSignal(false);

  // Compute spec from editor state
  const spec = createMemo(() => buildSpecFromState(editorState));

  const formattedSpec = () => {
    const currentSpec = spec();
    if (!currentSpec) return 'No spec generated yet';
    return JSON.stringify(currentSpec, null, 2);
  };

  const copyToClipboard = () => {
    const currentSpec = spec();
    if (currentSpec) {
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
        <Show when={isExpanded() && spec()}>
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
