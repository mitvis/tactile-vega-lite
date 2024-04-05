import vegaEmbed from "vega-embed";
import { TopLevelSpec } from 'vega-lite';
import { modifySvg } from './modules/modifySvg/chartModifier';
const d3 = require("d3");
import './style.css';
import { elaborateTVLSpec } from "./modules/modifySpec/elaborateSpec";
import { mergeSpec } from "./modules/modifySpec/mergeSpec";
import { selectDefaultSpec } from "./modules/modifySpec/selectDefault";
import { updateDefault } from "./modules/modifySpec/updateDefault";
import { terminateWorker } from "./modules/braille/translateBraille";
import * as monaco from 'monaco-editor';
// or import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// if shipping only a subset of the features & languages is desired

// monaco.editor.create(document.getElementById('container'), {
//   value: 'console.log("Hello, world")',
//   language: 'javascript'
// });


document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input') as HTMLInputElement;
  const submitButton = document.getElementById('render') as HTMLButtonElement;
  const downloadButton = document.getElementById('download') as HTMLButtonElement;
  const downloadButtonPNG = document.getElementById('downloadPNG') as HTMLButtonElement;
  const editorContainer = document.getElementById('editorContainer') as HTMLDivElement;

  const userTVLSpec: any = {
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
      "text": "Weights of Four Marsupials in Pounds"
    },
    "description": "description of simple bar",
    "mode": "tactile",
    "mark": "bar",
    "encoding": {
      "x": {
        "field": "marsupial",
        "type": "nominal",
        "sort": ["Possum", "Koala", "Tasmanian Devil", "Kangaroo"],
        "title": "Marsupial Species"
      },
      "y": {
        "field": "weight",
        "type": "quantitative",
        "title": "Weight of Adult Male in Pounds"
      }
    }
  }


  // Initialize Monaco Editor
  const editor = monaco.editor.create(editorContainer, {
    value: JSON.stringify(userTVLSpec, null, 2), // Initial value set to userTVLSpec
    language: 'json',
    theme: 'vs-light',
    lineNumbers: 'on',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
  });

  // Listen for editor changes and update the input value
  editor.onDidChangeModelContent(() => {
    const editorValue = editor.getValue();
    // parse and validate the JSON as needed
    try {
      const parsedSpec = JSON.parse(editorValue);
      // Do something with the parsed spec, e.g., store it, validate it, etc.
    } catch (error) {
      // Handle JSON parsing errors, perhaps show a message in the UI
      console.error('Invalid JSON:', error);
    }
  });




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
        terminateWorker();
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

  submitButton.addEventListener('click', () => {
    try {
      const spec = JSON.parse(editor.getValue()); // Get value from Monaco Editor
      renderTactileChart(spec);
      renderVegaLiteChart(spec);
    } catch (error) {
      console.error('Invalid JSON', error);
    }
  });

  // Bind the downloadSVG function to the download button's click event
  downloadButton.addEventListener('click', downloadSVG);
  downloadButtonPNG.addEventListener('click', downloadPNG);

});
