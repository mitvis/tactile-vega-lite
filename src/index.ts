import vegaEmbed from "vega-embed";
import { Config, TopLevelSpec, compile } from 'vega-lite';
import { modifySvg } from './modules/chartModifier';
import { getBrailleWidthForSelectors } from "./modules/braille/getBrailleWidthForSelectors";
const d3 = require("d3");
import { updateVLSpec } from "./modules/update/updateSpec";

document.addEventListener('DOMContentLoaded', () => {

    const input = document.getElementById('input') as HTMLInputElement;
    const submitButton = document.getElementById('render') as HTMLButtonElement;
    const downloadButton = document.getElementById('download') as HTMLButtonElement;

    const userTVLSpec: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Stock prices of 5 Tech Companies over Time.",
        "data": { "url": "https://raw.githubusercontent.com/vega/vega-datasets/main/data/stocks.csv" },
        "mark": {
            "type": "line",
            "point": true
        },
        "encoding": {
            "x": { "timeUnit": "year", "field": "date" },
            "y": { "aggregate": "mean", "field": "price", "type": "quantitative" },
            "color": { "field": "symbol", "type": "nominal" }
        },
        "tactile": true
    }



    console.log("userTVLSpec: ", userTVLSpec);

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
        let elaboratedTVLSpec = populateDefaultTactileSpec(spec);
        console.log("elaboratedTVLSpec: ", elaboratedTVLSpec);
        // updates vega lite spec to optimize for tactile representation
        updateVLSpec(elaboratedTVLSpec).then((updatedVLSpec) => {
            console.log("final updated Spec: ", updatedVLSpec)
            vegaEmbed("#tactile", updatedVLSpec, { renderer: "svg" }).then(result => {
                modifySvg(result, updatedVLSpec);
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

    renderVegaLiteChart(userTVLSpec);
    renderTactileChart(userTVLSpec);

    // Bind the downloadSVG function to the download button's click event
    downloadButton.addEventListener('click', downloadSVG);

});
