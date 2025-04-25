import * as d3 from 'd3';
import textures from 'textures';

export const textureNames = ['noFill', 'solidGrayFill', 'denseDottedFill', 'verticalFill', 'horizontalFill', 'dottedFill', 'diamondFill', 'crossFill', 'diagonalRightFill', 'diagonalLeftFill'];

export function initSvgPatterns(): void {
  // Select the SVG element
  const svg = d3.select('#tactile svg');

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

  // Some patterns need more specific control, so we'll use direct D3 approach
  const defs = svg.append('defs');

  // diamondFill - complex pattern with specific path
  defs.append('pattern').attr('id', 'diamondFill').attr('patternUnits', 'userSpaceOnUse').attr('width', '13.23mm').attr('height', '26.46mm').attr('patternTransform', 'scale(2) rotate(0)').append('path').attr('d', 'M12.5 0L0 25l12.5 25L25 25 12.5 0zm25 50L25 75l12.5 25L50 75 37.5 50z').attr('stroke-width', '1').attr('stroke', 'none').attr('fill', '#000000');

  // crossFill - needs dashed lines which textures.js doesn't directly support
  defs.append('pattern').attr('id', 'crossFill').attr('width', '5.08mm').attr('height', '5.08mm').attr('patternUnits', 'userSpaceOnUse').append('line').attr('x1', '2.54mm').attr('y1', '0mm').attr('x2', '2.54mm').attr('y2', '5.08mm').attr('stroke', 'black').attr('stroke-width', '0.8mm').attr('stroke-dasharray', '1mm, 1mm');
}
