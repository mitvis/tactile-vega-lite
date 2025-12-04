import { VisualRenderer } from './VisualRenderer';
import { TactileRenderer } from './TactileRenderer';

export function RenderPanel() {
  return (
    <div class="render-panel">
      <VisualRenderer />

      <TactileRenderer />
    </div>
  );
}
