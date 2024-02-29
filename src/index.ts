import vegaEmbed from "vega-embed";
import { Config, TopLevelSpec, compile } from 'vega-lite';
import { modifySvg } from './modules/chartModifier';
import { getBrailleWidthForSelectors } from "./modules/braille/getBrailleWidthForSelectors";
const d3 = require("d3");
import { updateSpecForTactile } from "./modules/update/updateSpec";

document.addEventListener('DOMContentLoaded', () => {

    const input = document.getElementById('input') as HTMLInputElement;
    const submitButton = document.getElementById('render') as HTMLButtonElement;
    const downloadButton = document.getElementById('download') as HTMLButtonElement;

    // const defaultSpec: any = {
    //     "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    //     "data": { "url": "https://raw.githubusercontent.com/vega/vega-datasets/main/data/seattle-weather.csv" },
    //     "mark": "bar",
    //     "encoding": {
    //         "x": {
    //             "timeUnit": "month",
    //             "field": "date",
    //             "type": "ordinal",
    //             "title": "Month of the year"
    //         },
    //         "y": {
    //             "aggregate": "count",
    //             "type": "quantitative"
    //         },
    //         "color": {
    //             "field": "weather",
    //             "type": "nominal",
    //             "scale": {
    //                 "domain": ["sun", "fog", "drizzle", "rain", "snow"],
    //                 "range": ["#e7ba52", "#c7c7c7", "#aec7e8", "#1f77b4", "#9467bd"]
    //             },
    //             "title": "Weather type"
    //         },
    //     },
    //     "tactile": {
    //         "grid": false,
    //     }
    // }

    const defaultSpec: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "A simple donut chart with embedded data.",
        "data": {
          "values": [
            {"category": 1, "value": 4},
            {"category": 2, "value": 6},
            {"category": 3, "value": 10},
            {"category": 4, "value": 3},
            {"category": 5, "value": 7},
            {"category": 6, "value": 8}
          ]
        },
        "mark": {"type": "arc", "innerRadius": 50},
        "encoding": {
          "theta": {"field": "value", "type": "quantitative"},
          "color": {"field": "category", "type": "nominal"}
        },
        "tactile": true
       }
       


// Function to merge default and user-specified tactile settings
function mergeTactileSettings(defaultSettings: any, userSettings: any) {
    return {
        ...defaultSettings,
        ...userSettings,
        braille: {
            ...defaultSettings.braille,
            ...(userSettings.braille || {}),
        },
        colorToTexture: {
            ...defaultSettings.colorToTexture,
            ...(userSettings.colorToTexture || {}),
        },
        grid: userSettings.grid !== undefined ? userSettings.grid : defaultSettings.grid,
    };
}

// Function to populate default tactile spec, preserving user-specified attributes
function populateDefaultTactileSpec(spec: any) {
    // Define default tactile settings
    const defaultTactileSpec = {
        braille: {
            brailleFont: "Swell Braille",
            brailleFontSize: 30,
            brailleTranslationTable: "en-ueb-g2.ctb",
        },
        colorToTexture: {
            enabled: true,
        },
        grid: false, // Default no grids
    };

    if (typeof spec.tactile === 'object') {
        // Merge user-specified tactile settings with defaults
        spec.tactile = mergeTactileSettings(defaultTactileSpec, spec.tactile);
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
        // updates the spec for tactile representation
        updateSpecForTactile(spec).then((updatedSpec) => {
            console.log("updated Spec: ", updatedSpec)
            vegaEmbed("#tactile", updatedSpec, { renderer: "svg" }).then(result => {
                if (spec.tactile !== undefined && spec.tactile !== null) {
                    modifySvg(result, spec); // Call the function to modify the SVG if tactile is true
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

    submitButton.addEventListener('click', () => {
        try {
            const spec = JSON.parse(input!.value);
            renderTactileChart(spec);
            // remove all the tactile part from the spec and set to a new spec called visualSpec
            let visualSpec = JSON.parse(JSON.stringify(spec));
            delete visualSpec.tactile;
            renderVegaLiteChart(visualSpec);
        } catch (error) {
            console.error('Invalid JSON', error);
        }
    });

    renderVegaLiteChart(defaultSpec);
    renderTactileChart(defaultSpec);

    // Bind the downloadSVG function to the download button's click event
    downloadButton.addEventListener('click', downloadSVG);

});
