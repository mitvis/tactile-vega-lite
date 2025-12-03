import * as d3 from 'd3';
import textures from 'textures';

export const textureNames = ['noFill', 'solidGrayFill', 'denseDottedFill', 'verticalFill', 'horizontalFill', 'dottedFill', 'diamondFill', 'crossFill', 'diagonalRightFill', 'diagonalLeftFill'];

export function initSvgPatterns(svgElement: SVGElement): void {
  const svg = d3.select<SVGElement, unknown>(svgElement);

  // Basic fills using textures.js
  const noFill = textures.lines().id('noFill').size(1).strokeWidth(0).background('white');
  svg.call(noFill);

  const solidGrayFill = textures.lines().id('solidGrayFill').size(1).strokeWidth(0).background('#808080');
  svg.call(solidGrayFill);

  // Circle-based patterns using textures.js
  const denseDottedFill = textures.circles().id('denseDottedFill').size(10).radius(2).fill('black');
  svg.call(denseDottedFill);

  const dottedFill = textures.circles().id('dottedFill').heavier().fill('black');
  svg.call(dottedFill);

  // Line-based patterns using textures.js
  const verticalFill = textures.lines().id('verticalFill').orientation('vertical').heavier(1.2).thinner().stroke('black');
  svg.call(verticalFill);

  const horizontalFill = textures.lines().id('horizontalFill').orientation('horizontal').heavier(1.2).stroke('black');
  svg.call(horizontalFill);

  const diagonalLeftFill = textures.lines().id('diagonalLeftFill').orientation('6/8').heavier().thinner();
  svg.call(diagonalLeftFill);

  const diagonalRightFill = textures.lines().id('diagonalRightFill').heavier();
  svg.call(diagonalRightFill);

  // Diamond pattern
  const s = 25;
  const diamondFill = textures
    .paths()
    .id('diamondFill')
    .size(s)
    .d(() => {
      const center = s / 2;
      const radius = s * 0.4;
      return (
        `M ${center} ${center - radius} ` + // Top
        `L ${center + radius} ${center} ` + // Right
        `L ${center} ${center + radius} ` + // Bottom
        `L ${center - radius} ${center} Z`
      ); // Left and close
    })
    .fill('#000000')
    .stroke('none');
  svg.call(diamondFill);

  // Cross pattern with dashed line
  const crossFill = textures.lines().id('crossFill').orientation('vertical').thinner();
  svg.call(crossFill);

  // Add dash array to cross pattern
  svg.select('#crossFill path').attr('stroke-dasharray', '2mm 1.5mm');
}
