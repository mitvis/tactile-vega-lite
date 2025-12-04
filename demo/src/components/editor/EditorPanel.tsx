import { ChartTypeSelector } from './ChartTypeSelector';
import { TitleInput } from './TitleInput';
import { MarkConfiguration } from './MarkConfiguration';
import { DataInput } from '../data/DataInput';
import { FilterEditor } from '../data/FilterEditor';
import { EncodingPanel } from './EncodingPanel';
import { JSONSpecViewer } from './JSONSpecViewer';

export function EditorPanel() {
  return (
    <div class="editor-panel">
      <h1>Tactile Vega Lite Editor</h1>

      <ChartTypeSelector />

      <TitleInput />

      <MarkConfiguration />

      <DataInput />

      <FilterEditor />

      <EncodingPanel />

      <JSONSpecViewer />
    </div>
  );
}
