export async function loadCustomFont() {
    const font = new FontFace(
        "Swell Braille",
        "url(src/assets/fonts/Swell_Braille.ttf)",
        {
            style: "normal",
            weight: "400"
        }
    );

    try {
        // Wait for the font to be loaded
        await font.load();
        // Add the loaded font to the document
        document.fonts.add(font);
        console.log("Font loaded successfully.");
    } catch (error) {
        console.error("Font loading failed:", error);
    }
}
