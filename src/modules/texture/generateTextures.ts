const d3 = require('d3');

// Function to generate textures for each unique color
function generateTexturesForColors(uniqueColors: string[]): Record<string, string> {
    const colorToTextureUrl: Record<string, string> = {};
    // 9 patterns in total
    const patternIDs = [
        "noFill",
        "solidBlackFill",
        "denseDottedFill",
        "verticalLineFill",
        "horizontalLineFill",
        "dottedFill",
        "dashedLineFill",
        "gridPatternFill",
        "diagonalLineRightFill",
        "diagonalLineLeftFill"
    ];

    if (uniqueColors.length === 1) {
        // if there is only one unique color, fill it with black
        colorToTextureUrl[uniqueColors[0]] = "url(#solidBlackFill)";
        // colorToTextureUrl[uniqueColors[0]] = "url(#no_fill)";
        return colorToTextureUrl;

    }

    if (uniqueColors.length === 2) {
        // if there are only two colors, fill one with black one with white
        colorToTextureUrl[uniqueColors[0]] = "url(#solidBlackFill)";
        colorToTextureUrl[uniqueColors[1]] = "url(#denseDottedFill)";
        return colorToTextureUrl;

    }

    if (uniqueColors.length > patternIDs.length) {
        alert('There are too many colors! Pls why would you do this to me?');
        return colorToTextureUrl;
    } else {
        uniqueColors.forEach((color, index) => {
            // randomly select a texture from the defined textures
            const patternId = patternIDs[index % patternIDs.length];
            colorToTextureUrl[color] = `url(#${patternId})`;
        });
        return colorToTextureUrl;
    }
}

export { generateTexturesForColors }