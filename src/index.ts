import vegaEmbed from "vega-embed";
import { Config, TopLevelSpec, compile } from 'vega-lite';
import { modifySvg } from './modules/chartModifier';
const d3 = require("d3");
import { updateVLSpec } from "./modules/update/updateSpec";
import './style.css';


document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input') as HTMLInputElement;
    const submitButton = document.getElementById('render') as HTMLButtonElement;
    const downloadButton = document.getElementById('download') as HTMLButtonElement;
    const downloadButtonPNG = document.getElementById('downloadPNG') as HTMLButtonElement;

    const userTVLSpec: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": { "url": "https://raw.githubusercontent.com/vega/vega-datasets/main/data/movies.json" },
        "mark": "bar",
        "encoding": {
            "x": {
                "bin": true,
                "field": "IMDB Rating"
            },
            "y": { "aggregate": "count" }
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

    function downloadPNG() {
        console.log("fixing png download issue");
        // const svgElement = document.querySelector('#tactile svg');
        // if (!svgElement) {
        //     console.error('SVG not found');
        //     return;
        // }

        // // Serialize the SVG to a string
        // const serializer = new XMLSerializer();
        // const svgString = serializer.serializeToString(svgElement);

        // // Create a Blob object
        // const blob = new Blob([svgString], { type: 'image/svg+xml' });

        // // Create a download link and trigger the download
        // const link = document.createElement('a');
        // link.href = URL.createObjectURL(blob);
        // link.download = 'tactile-visualization.png'; // Name of the file to download
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    }


    input.addEventListener('input', () => {
        const value = input.value.trim();

        try {
            // Attempt to parse the JSON input
            const parsed = JSON.parse(value);
            // Reformat and set back into the textarea with indentation
            input.value = JSON.stringify(parsed, null, 2);
        } catch (error) {
            // If there's a parsing error, do not attempt to format
            console.error("Invalid JSON input");
        }
    });

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
    downloadButtonPNG.addEventListener('click', downloadPNG);

});
