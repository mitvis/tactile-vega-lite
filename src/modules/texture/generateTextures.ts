const d3 = require('d3');

// Function to generate textures for each unique color
function generateTexturesForColors(uniqueColors: string[]): Record<string, string> {
    const colorToTextureUrl: Record<string, string> = {};
    // 9 patterns in total
    const patternIDs = ["fill_black", "densely_dotted", "vertical_line",
        "horizontal_line", "dotted", "dashed_line",
        "grid_pattern", "diagonal_line_left", "diagonal_line_right"];

    if (uniqueColors.length === 1) {
        // if there is only one unique color, fill it with black
        colorToTextureUrl[uniqueColors[0]] = "url(#fill_black)";
        return colorToTextureUrl;

    } else if (uniqueColors.length === 2) {
        // if there are only two colors, fill one with black one with white
        colorToTextureUrl[uniqueColors[0]] = "url(#fill_black)";
        colorToTextureUrl[uniqueColors[1]] = "url(#densly_dotted_pattern)";
        return colorToTextureUrl;

    } else if (uniqueColors.length > patternIDs.length) {
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