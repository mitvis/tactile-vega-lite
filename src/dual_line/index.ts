import vegaEmbed from "vega-embed";
import { modifySvg } from '../modules/modifySvg/chartModifier';
import '../style.css';
import { elaborateTVLSpec } from "../modules/modifySpec/elaborateSpec";
import { mergeSpec } from "../modules/modifySpec/mergeSpec";
import { selectDefaultSpec } from "../modules/modifySpec/selectDefault";
import { updateDefault } from "../modules/modifySpec/updateDefault";
import { terminateWorker } from "../modules/braille/translateBraille";
import * as monaco from 'monaco-editor';
import { initSvgPatterns } from "../modules/texture/initializeTexture";


document.addEventListener('DOMContentLoaded', () => {

    const submitButton = document.getElementById('render') as HTMLButtonElement;
    const downloadButton = document.getElementById('download') as HTMLButtonElement;
    // const downloadButtonPNG = document.getElementById('downloadPNG') as HTMLButtonElement;
    const editorContainer_dual_line = document.getElementById('editorContainer_dual_line') as HTMLDivElement;

    let userTVLSpec: any =
    {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Multi-series line chart showing life expectancy over time for several countries.",
        "data": {
            "url": "https://raw.githubusercontent.com/vega/vega-datasets/main/data/gapminder.json"
        },
        "title": {
            "text": "Average Fertility Rate Over Time for China and Australia"
        },
        "transform": [
            {
                "filter": "datum.country === 'Australia' || datum.country === 'China'"
            }
        ],
        "mark": "line",
        "encoding": {
            "x": {
                "field": "year",
                "type": "ordinal",
                "axis": {
                    "title": "Year"
                }
            },
            "y": {
                "aggregate": "average",
                "field": "fertility",
                "type": "quantitative",
                "axis": {
                    "title": "Fertility Rate",
                    "style": [
                        "noGrid"
                    ]
                }
            },
            "strokeDash": {
                "field": "country",
                "type": "nominal",
                "scale": {
                    "range": ["dashed", "solid"]
                }
            }
        },
        "config": {

        }
    }

    let VLSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Multi-series line chart showing life expectancy over time for several countries.",
        "data": {
            "url": "https://raw.githubusercontent.com/vega/vega-datasets/main/data/gapminder.json"
        },
        "title": {
            "text": "Average Fertility Rate Over Time for China and Australia"
        },
        "transform": [
            {
                "filter": "datum.country === 'Australia' || datum.country === 'China'"
            }
        ],
        "mark": "line",
        "encoding": {
            "x": {
                "field": "year",
                "type": "ordinal",
                "axis": {
                    "title": "Year",
                    "grid": false
                }
            },
            "y": {
                "aggregate": "average",
                "field": "fertility",
                "type": "quantitative",
                "axis": {
                    "title": "Fertility Rate",
                }
            },
            "color": {
                "field": "country"
            }
        },
        "config": {}
    }

    // Initialize Monaco Editor
    const editor = monaco.editor.create(editorContainer_dual_line, {
        value: JSON.stringify(userTVLSpec, null, 2), // Initial value set to userTVLSpec
        language: 'json',
        theme: 'vs-light',
        lineNumbers: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
    });

    // Listen for editor changes and update the input value
    editor.onDidChangeModelContent(() => {
        const editorValue = editor.getValue();
        // parse and validate the JSON as needed
        try {
            JSON.parse(editorValue);
        } catch (error) {
            // Handle JSON parsing errors, perhaps show a message in the UI
            console.error('Invalid JSON:', error);
        }
    });

    // function to render vega-lite spec
    function renderVegaLiteChart(spec: any) {
        // make a copy of the spec and call it vega-lite spec
        let VLSpec = JSON.parse(JSON.stringify(spec));
        // if (VLSpec.tn) {
        //     VLSpec.title.subtitle = VLSpec.tn;
        //     delete VLSpec.tn;
        // }
        if (VLSpec.encoding.texture) {
            VLSpec.encoding.color = VLSpec.encoding.texture;
            delete VLSpec.encoding.texture;
        }
        // VLSpec.encoding.color.scale.range exists 
        if (VLSpec.encoding.color && VLSpec.encoding.color.scale && VLSpec.encoding.color.scale.range) {
            delete VLSpec.encoding.color.scale.range;
        }
        vegaEmbed("#visual", VLSpec, { renderer: "svg" }).then(result => { }).catch(error => console.error(error));
    }

    async function renderTactileChart(spec: any) {
        initSvgPatterns();
        let TVLSpec = JSON.parse(JSON.stringify(spec));
        if (TVLSpec.encoding.texture) {
            TVLSpec.encoding.color = TVLSpec.encoding.texture;
            delete TVLSpec.encoding.texture;
        }

        let mergedSpec = TVLSpec;
        console.log("TVLSpec: ", TVLSpec);
        let defaultSpec = selectDefaultSpec(TVLSpec);
        console.log("defaultSpec: ", defaultSpec);
        let updatedDefaultSpec = updateDefault(TVLSpec, defaultSpec);
        mergedSpec = mergeSpec(TVLSpec, updatedDefaultSpec);

        const elaboratedTVLSpec = await elaborateTVLSpec(mergedSpec);
        console.log("final updated Spec: ", elaboratedTVLSpec);

        const result = await vegaEmbed("#tactile", elaboratedTVLSpec, { renderer: "svg" });
        await modifySvg(result, elaboratedTVLSpec);
        terminateWorker();

        // elaborateTVLSpec(mergedSpec).then((elaboratedTVLSpec) => {
        //     console.log("final updated Spec: ", elaboratedTVLSpec)
        //     vegaEmbed("#tactile", elaboratedTVLSpec, { renderer: "svg" }).then(result => {
        //         await modifySvg(result, elaboratedTVLSpec);
        //         terminateWorker();
        //     }).catch(error => console.error(error));
        // });
    };

    renderVegaLiteChart(VLSpec);
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

    submitButton.addEventListener('click', () => {
        try {
            let spec = JSON.parse(editor.getValue()); // Get value from Monaco Editor
            renderTactileChart(spec);
            renderVegaLiteChart(spec);
        } catch (error) {
            console.error('Invalid JSON', error);
        }
    });

    // Bind the downloadSVG function to the download button's click event
    downloadButton.addEventListener('click', downloadSVG);
    // downloadButtonPNG.addEventListener('click', downloadPNG);

});
