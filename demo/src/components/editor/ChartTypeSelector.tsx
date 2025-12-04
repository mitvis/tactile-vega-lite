import { editorState, setEditorState, clearEncodings } from '../../store';
import { Select } from '../atoms/Select';
import { ChartType } from '../../types';

export function ChartTypeSelector() {
  const options = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'scatter', label: 'Scatter Plot' },
    { value: 'pie', label: 'Pie Chart' },
  ];

  const handleChange = (value: string) => {
    const chartType = value as ChartType;
    setEditorState('chartType', chartType);

    // Update mark type to match chart type
    if (chartType === 'pie') {
      setEditorState('mark', 'type', 'arc');
    } else if (chartType === 'line') {
      setEditorState('mark', 'type', 'line');
    } else if (chartType === 'scatter') {
      setEditorState('mark', 'type', 'point');
    } else {
      setEditorState('mark', 'type', 'bar');
    }

    // Clear encodings that are not relevant for this chart type
    clearEncodings();
  };

  return (
    <Select
      label="Chart Type"
      value={editorState.chartType}
      onChange={handleChange}
      options={options}
    />
  );
}
