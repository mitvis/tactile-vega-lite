import { editorState, setEditorState } from '../../store';
import { DataSourceType } from '../../types';

export function DataSourceToggle() {
  const handleChange = (source: DataSourceType) => {
    setEditorState('dataSource', source);
    // Clear errors when switching
    setEditorState('dataError', null);
  };

  return (
    <div class="form-group">
      <label class="form-label">Data Source</label>
      <div class="radio-group">
        <label class="radio-option">
          <input
            type="radio"
            name="dataSource"
            value="url"
            checked={editorState.dataSource === 'url'}
            onChange={() => handleChange('url')}
          />
          <span>URL</span>
        </label>
        <label class="radio-option">
          <input
            type="radio"
            name="dataSource"
            value="inline"
            checked={editorState.dataSource === 'inline'}
            onChange={() => handleChange('inline')}
          />
          <span>Paste Data</span>
        </label>
      </div>
    </div>
  );
}
