import { Show } from 'solid-js';
import { editorState } from '../../store';
import { DataSourceToggle } from './DataSourceToggle';
import { URLInput } from './URLInput';
import { InlineDataEditor } from './InlineDataEditor';

export function DataInput() {
  return (
    <div class="data-input-section">
      <h2>Data</h2>

      <DataSourceToggle />

      <Show when={editorState.dataSource === 'url'}>
        <URLInput />
      </Show>

      <Show when={editorState.dataSource === 'inline'}>
        <InlineDataEditor />
      </Show>
    </div>
  );
}
