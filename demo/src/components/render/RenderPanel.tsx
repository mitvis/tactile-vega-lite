import { createMemo } from 'solid-js';
import { VisualRenderer } from './VisualRenderer';
import { TactileRenderer } from './TactileRenderer';
import { editorState } from '../../store';
import { buildSpecFromState } from '../../utils/specBuilder';

export function RenderPanel() {
  // Build spec from editor state - memoized with stable reference
  // Only produces new reference when spec content actually changes
  const spec = createMemo((prev) => {
    const next = buildSpecFromState(editorState);

    // Only return new reference if content actually changed
    if (prev && JSON.stringify(prev) === JSON.stringify(next)) {
      return prev; // Maintain stable reference
    }

    return next;
  });

  return (
    <div class="render-panel">
      <VisualRenderer spec={spec()} />

      <TactileRenderer spec={spec()} />
    </div>
  );
}
