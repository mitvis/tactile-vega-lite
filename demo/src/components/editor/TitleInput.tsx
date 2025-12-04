import { editorState, setEditorState } from '../../store';
import { TextInput } from '../atoms/TextInput';

export function TitleInput() {
  return (
    <TextInput
      label="Chart Title"
      value={editorState.title}
      onInput={(value) => setEditorState('title', value)}
      placeholder="Enter a title for your chart"
    />
  );
}
