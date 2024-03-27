import vegaEmbed from "vega-embed";
import { Config, TopLevelSpec, compile } from 'vega-lite';
import { modifySvg } from './modules/modifySvg/chartModifier';
const d3 = require("d3");
// import { updateVLSpec } from "./modules/update/updateSpec";
import './style.css';
import { defaultTVLSpecBar } from "./modules/specs/defaultTVLSpecBar";
import { elaborateTVLSpec } from "./modules/update/elaborateSpec";
import { mergeSpec } from "./modules/modifySpec/mergeSpec";
import { selectDefaultSpec } from "./modules/modifySpec/selectDefault";
import { updateDefault } from "./modules/modifySpec/updateDefault";


document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input') as HTMLInputElement;
    const submitButton = document.getElementById('render') as HTMLButtonElement;
    const downloadButton = document.getElementById('download') as HTMLButtonElement;
    const downloadButtonPNG = document.getElementById('downloadPNG') as HTMLButtonElement;

    const userTVLSpec: any =
    {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {
            "values": [
                { "marsupial": "Possum", "weight": 15 },
                { "marsupial": "Koala", "weight": 27 },
                { "marsupial": "Tasmanian Devil", "weight": 27 },
                { "marsupial": "Kangaroo", "weight": 200 }
            ]
        },
        "title": {
            "text": "Weights of Four Marsupials in Pounds",
        },
        "description": "description of simple bar",
        "mode": "tactile",
        "mark": "bar",
        "encoding": {
            "x": {
                "field": "marsupial",
                "type": "nominal",
                "sort": ["Possum", "Koala", "Tasmanian Devil", "Kangaroo"],
                "title": "Marsupial Species",
            },
            "y": {
                "field": "weight",
                "type": "quantitative",
                "title": "Weight of Adult Male in Pounds"
            }
        }
    }






    // function to render vega-lite spec
    function renderVegaLiteChart(spec: TopLevelSpec) {
        vegaEmbed("#visual", spec, { renderer: "svg" }).then(result => {
        }).catch(error => console.error(error));
    }

    function renderTactileChart(spec: any) {
        let mergedSpec = spec;
        if (spec.mode === "tactile") {
            let defaultSpec = selectDefaultSpec(spec);
            let updatedDefaultSpec = updateDefault(spec, defaultSpec);
            mergedSpec = mergeSpec(spec, updatedDefaultSpec);
        };

        elaborateTVLSpec(mergedSpec).then((elaboratedTVLSpec) => {
            console.log("final updated Spec: ", elaboratedTVLSpec)
            vegaEmbed("#tactile", elaboratedTVLSpec, { renderer: "svg" }).then(result => {
                modifySvg(result, elaboratedTVLSpec);
            }).catch(error => console.error(error));
        });
    };

    renderVegaLiteChart(userTVLSpec);
    renderTactileChart(userTVLSpec);

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
    }


    input.addEventListener('input', () => {
        // format user input to be more readable json format
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
        // render button click event
        try {
            const spec = JSON.parse(input!.value);
            renderTactileChart(spec);
            // remove all the tactile part from the spec and set to a new spec called visualSpec
            renderVegaLiteChart(spec);
        } catch (error) {
            console.error('Invalid JSON', error);
        }
    });

    // Bind the downloadSVG function to the download button's click event
    downloadButton.addEventListener('click', downloadSVG);
    downloadButtonPNG.addEventListener('click', downloadPNG);

});
