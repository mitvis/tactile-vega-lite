import { getBrailleWidthForSelectors } from '../utils/getBrailleWidthForSelectors';
import vegaEmbed, { VisualizationSpec } from 'vega-embed';
import { getNumberOfTicks } from '../utils/getNumberOfTicks';
import { setVLWidth } from '../utils/setVLWidth';
import { setVLHeight } from '../utils/setVLHeight';
import { textureNames } from '../texture/initializeTexture';

async function elaborateTVLSpec(mergedSpec: any): Promise<VisualizationSpec> {
  // Create a temporary container for rendering
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  document.body.appendChild(tempContainer);

  try {
    const result = await vegaEmbed(tempContainer, mergedSpec, { renderer: 'svg' });
    // if mark.type is not arc
    if (mergedSpec.mark != 'arc' && mergedSpec.mark.type != 'arc') {
      const maxBrailleWidth = await getBrailleWidthForSelectors(result, ['.mark-text.role-axis-label text'], mergedSpec);
      // console.log("maxBrailleWidth: ", maxBrailleWidth);
      const braillePaddingX = maxBrailleWidth * 0.1;
      const numberOfTicksX = await getNumberOfTicks(result, ['.mark-text.role-axis-label text'], 'x');
      const numberOfTicksY = await getNumberOfTicks(result, ['.mark-text.role-axis-label text'], 'y');

      // ================== Update Height and Width ==================
      mergedSpec = setVLWidth(mergedSpec, maxBrailleWidth, braillePaddingX, numberOfTicksX);
      mergedSpec = setVLHeight(result, mergedSpec, numberOfTicksY);

      // ================== Update Multi-series Line Chart ==================
      if (mergedSpec.mark.type == 'line' || mergedSpec.mark == 'line') {
        if (mergedSpec.encoding.color) {
          // add encoding.strokeDash and set field to encoding.color.field
          mergedSpec.encoding.strokeDash = {
            field: mergedSpec.encoding.color.field,
          };
          // remove encoding.color
          delete mergedSpec.encoding.color;
        }
      }
      // add maxBrailleWidth and braillePadding to config.tactileParams
      mergedSpec.config.tactileParams = {
        maxBrailleWidth: maxBrailleWidth,
        braillePadding: braillePaddingX,
      };
    }

    // ================== texture ==================
    // if use specified textures, we use user specified textures
    if (mergedSpec.encoding.color && mergedSpec.encoding.color.scale && mergedSpec.encoding.color.scale.range) {
      // iterate through range, and replace each texture name to "url(#textureName)"
      mergedSpec.encoding.color.scale.range = mergedSpec.encoding.color.scale.range.map((textureName: string) => {
        return `url(#${textureName})`;
      });
    } else if (mergedSpec.encoding.color) {
      // Only try to access color scale if color encoding exists
      try {
        const domain = result.view.scale('color').domain();
        mergedSpec.encoding.color.scale = mergedSpec.encoding.color.scale || {};
        mergedSpec.encoding.color.scale.domain = domain;
        mergedSpec.encoding.color.scale.range = domain.map((color: string, index: number) => {
          return `url(#${textureNames[index % textureNames.length]})`;
        });
      } catch (_error) {
        // If color scale doesn't exist in the view, skip texture assignment
        console.warn('Color scale not found in view, skipping automatic texture assignment');
      }
    }

    return mergedSpec;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Clean up temporary container
    if (document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
    }
  }
}

export { elaborateTVLSpec };
