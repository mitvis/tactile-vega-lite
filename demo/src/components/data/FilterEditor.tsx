import { editorState, setEditorState } from '../../store';
import { TextArea } from '../atoms/TextArea';

/**
 * FilterEditor - allows users to enter a filter expression to filter data
 */
export function FilterEditor() {
  const handleFilterChange = (value: string) => {
    setEditorState('filterExpression', value || null);
  };

  return (
    <>
      <TextArea
        label="Filter Expression (optional)"
        value={editorState.filterExpression || ''}
        onInput={handleFilterChange}
        placeholder="e.g., datum.country === 'United States' || datum.country === 'China'"
        rows={3}
      />
      <div class="form-hint">
        Use Vega-Lite filter expressions. Examples: datum.field === 'value', datum.year &gt;
        2000
      </div>
    </>
  );
}
