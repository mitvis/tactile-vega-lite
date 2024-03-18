const d3 = require('d3');
const texturesModule = require('textures');
const textures = texturesModule.default; // Access the actual default export

// Pre-generate 15 textures with a mix of circles, lines, and paths
// [TODO] map BANA guideline colors to texture.js
// [TODO] make sure that the textures are not too similar to each other, see BANA appendix
// [TODO] similar texture cannot be next to each other 


// Function to generate textures for each unique color
function generateTexturesForColors(uniqueColors: string[]): Record<string, string> {
    // select svg element under the div with id "tactile"
    const svg = d3.select("#tactile svg");
    
    const colorToTextureUrl: Record<string, string> = {};

    if (uniqueColors.length === 1) {
        // if there is only one unique color, fill it with black
        colorToTextureUrl[uniqueColors[0]] = "black";
        return colorToTextureUrl;

    } else if (uniqueColors.length === 2) {
        // if there are only two colors, fill one with black one with white
        colorToTextureUrl[uniqueColors[0]] = "black";
        colorToTextureUrl[uniqueColors[1]] = "white";
        return colorToTextureUrl;

    } else if (uniqueColors.length > 7) {
        alert('There are too many colors! Pls why would you do this to me?');
        return colorToTextureUrl;
    } else {

        let texturesArray = [
            //lines
            textures.lines().size(4),
            // textures.lines().heavier(),
            // textures.lines().lighter(),
            // textures.lines().thinner(),
            // textures.lines().thicker(),
            textures.lines().size(4).orientation("vertical"),
            textures.lines().orientation("3/8", "7/8"),
        
            //circles
            textures.circles().size(4),
            // textures.circles().heavier(),
            // textures.circles().lighter(),
            // textures.circles().thinner(),
            textures.circles().size(1),
        
            // paths
            textures.paths().d("crosses").size(2).strokeWidth(2),
            textures.paths().d("hexagons").size(2).strokeWidth(2),
            // textures.paths().d("crosses").lighter().thicker(),
            // textures.paths().d("woven").size(2).lighter().thicker(),
            // textures.paths().d("waves").size(2).thicker(),
        
        ];

        uniqueColors.forEach((color) => {
            // Randomly select a texture from the pre-generated array w/o replacement
            const textureIndex = Math.floor(Math.random() * texturesArray.length);
            const texture = texturesArray[textureIndex]; // Apply the unique color to the selected texture
            // Add the texture to the defs
            svg.call(texture);

            // Store the mapping from color to texture URL (pattern ID reference)
            colorToTextureUrl[color] = `url(#${texture.id()})`;
            texturesArray.splice(textureIndex, 1);

        });
        return colorToTextureUrl;
    }
}

export { generateTexturesForColors }