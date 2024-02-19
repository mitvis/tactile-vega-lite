import vegaEmbed from "vega-embed";
import { Config, TopLevelSpec, compile } from 'vega-lite';
import { modifySvg } from './modules/chartModifier';
import { getBrailleWidthForSelectors } from "./modules/braille/getBrailleWidthForSelectors";
const d3 = require("d3");
import { updateSpecForTactile } from "./modules/updateSpec";

document.addEventListener('DOMContentLoaded', () => {

    const input = document.getElementById('input') as HTMLInputElement;
    const submitButton = document.getElementById('render') as HTMLButtonElement;
    const downloadButton = document.getElementById('download') as HTMLButtonElement;

    const defaultSpec: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": { "url": "https://raw.githubusercontent.com/vega/vega-datasets/main/data/seattle-weather.csv" },
        "mark": "bar",
        "encoding": {
            "x": {
                "timeUnit": "month",
                "field": "date",
                "type": "ordinal",
                "title": "Month of the year"
            },
            "y": {
                "aggregate": "count",
                "type": "quantitative"
            },
            "color": {
                "field": "weather",
                "type": "nominal",
                "scale": {
                    "domain": ["sun", "fog", "drizzle", "rain", "snow"],
                    "range": ["#e7ba52", "#c7c7c7", "#aec7e8", "#1f77b4", "#9467bd"]
                },
                "title": "Weather type"
            },
        },
        "tactile": {
            "useGridlines": false,
        }
    }

    // Function to populate default tactile spec, preserving user-specified attributes
    function populateDefaultTactileSpec(spec: any): any {
        // Define default tactile settings
        const defaultTactileSpec = {
            braille: {
                brailleFont: "Swell Form",
                brailleFontSize: 30,
                brailleTranslationTable: "en-ueb-g2.ctb",
            },
            colorToTexture: {
                enabled: true,
                // textureArray: ["Texture 1", "Texture 2"], // Example textures
            },
            useGridlines: true,
        };

        if (typeof spec.tactile === 'object') {
            // Merge user-specified tactile settings with defaults
            spec.tactile = {
                ...defaultTactileSpec, // Spread the default settings first
                ...spec.tactile, // Then spread the user settings, allowing user settings to override defaults
                braille: {
                    ...defaultTactileSpec.braille, // Spread the default braille settings
                    ...(spec.tactile.braille || {}), // Then spread user's braille settings, if any
                },
                colorToTexture: {
                    ...defaultTactileSpec.colorToTexture, // Spread the default colorToTexture settings
                    ...(spec.tactile.colorToTexture || {}), // Then spread user's colorToTexture settings, if any
                }
            };
        } else if (spec.tactile === true) {
            // If tactile is simply set to true, use all default settings
            spec.tactile = defaultTactileSpec;
        }

        return spec;
    }

    // function to render vega-lite spec
    function renderVegaLiteChart(spec: TopLevelSpec) {
        vegaEmbed("#visual", spec, { renderer: "svg" }).then(result => {
        }).catch(error => console.error(error));
    }

    function renderTactileChart(spec: any) {
        // First, populate default tactile spec
        spec = populateDefaultTactileSpec(spec);
        console.log(spec);

        // updates the spec for tactile representation
        updateSpecForTactile(spec).then((updatedSpec) => {
            console.log(updatedSpec);
            vegaEmbed("#tactile", updatedSpec, { renderer: "svg" }).then(result => {
                if (spec.tactile !== undefined && spec.tactile !== null) {
                    console.log("Chart updated for tactile representation");
                    modifySvg(result, spec); // Call the function to modify the SVG if tactile is true
                } else {
                    console.log("Tactile Mode Off");
                }
            }).catch(error => console.error(error));
        });
    };

    function downloadSVG() {

        const svgElement = document.querySelector('#tactile svg');
        if (!svgElement) {
            console.error('SVG not found');
            return;
        }

        // Serialize the SVG to a string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        // Create a Blob object
        const blob = new Blob([svgString], { type: 'image/svg+xml' });

        // Create a download link and trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'tactile-visualization.svg'; // Name of the file to download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    renderVegaLiteChart(defaultSpec);
    renderTactileChart(defaultSpec);

    submitButton.addEventListener('click', () => {
        try {
            const spec = JSON.parse(input!.value);
            renderTactileChart(spec);
            renderVegaLiteChart(spec);
        } catch (error) {
            console.error('Invalid JSON', error);
        }
    });

    // Bind the downloadSVG function to the download button's click event
    downloadButton.addEventListener('click', downloadSVG);

});
