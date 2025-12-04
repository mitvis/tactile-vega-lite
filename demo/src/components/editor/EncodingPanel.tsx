import { Show } from 'solid-js';
import { editorState } from '../../store';
import { ENCODING_VISIBILITY } from '../../utils/constants';
import { XEncodingEditor } from '../encodings/XEncodingEditor';
import { YEncodingEditor } from '../encodings/YEncodingEditor';
import { ThetaEncodingEditor } from '../encodings/ThetaEncodingEditor';
import { TextureEncodingEditor } from '../encodings/TextureEncodingEditor';
import { XOffsetEncodingEditor } from '../encodings/XOffsetEncodingEditor';
import { StrokeDashEncodingEditor } from '../encodings/StrokeDashEncodingEditor';

export function EncodingPanel() {
  const visibility = () => ENCODING_VISIBILITY[editorState.chartType];

  return (
    <div class="encoding-panel">
      <h2>Encodings</h2>

      <Show when={visibility().x}>
        <XEncodingEditor />
      </Show>

      <Show when={visibility().y}>
        <YEncodingEditor />
      </Show>

      <Show when={visibility().theta}>
        <ThetaEncodingEditor />
      </Show>

      <Show when={visibility().texture}>
        <TextureEncodingEditor />
      </Show>

      <Show when={visibility().xOffset}>
        <XOffsetEncodingEditor />
      </Show>

      <Show when={visibility().strokeDash}>
        <StrokeDashEncodingEditor />
      </Show>
    </div>
  );
}
