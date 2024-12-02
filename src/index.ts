import vegaEmbed from "vega-embed";
import { modifySvg } from './modules/modifySvg/chartModifier';
import './style.css';
import { elaborateTVLSpec } from "./modules/modifySpec/elaborateSpec";
import { mergeSpec } from "./modules/modifySpec/mergeSpec";
import { selectDefaultSpec } from "./modules/modifySpec/selectDefault";
import { updateDefault } from "./modules/modifySpec/updateDefault";
import { terminateWorker } from "./modules/braille/translateBraille";
import * as monaco from 'monaco-editor';
import { initSvgPatterns } from "./modules/texture/initializeTexture";


document.addEventListener('DOMContentLoaded', () => {

  const submitButton = document.getElementById('render') as HTMLButtonElement;
  const downloadButton = document.getElementById('download') as HTMLButtonElement;
  // const downloadButtonPNG = document.getElementById('downloadPNG') as HTMLButtonElement;
  const editorContainer = document.getElementById('editorContainer') as HTMLDivElement;


  let userTVLSpec: any =
  {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "Lifespan of Common Endangered African Birds",
    "data": {
      "values": [
        { "Bird": "Grey Crowned Crane", "Lifespan": 22, "Condition": "Captive" },
        { "Bird": "Grey Crowned Crane", "Lifespan": 60, "Condition": "Wild" },
        { "Bird": "African Penguin", "Lifespan": 18, "Condition": "Captive" },
        { "Bird": "African Penguin", "Lifespan": 30, "Condition": "Wild" },
        { "Bird": "Hooded Vulture", "Lifespan": 20, "Condition": "Captive" },
        { "Bird": "Hooded Vulture", "Lifespan": 25, "Condition": "Wild" },
        { "Bird": "Northern Bald Ibis", "Lifespan": 12, "Condition": "Captive" },
        { "Bird": "Northern Bald Ibis", "Lifespan": 25, "Condition": "Wild" },
        { "Bird": "Blue Crowned Crane", "Lifespan": 21, "Condition": "Captive" },
        { "Bird": "Blue Crowned Crane", "Lifespan": 25, "Condition": "Wild" }
      ]
    },
    "mark": "bar",
    "encoding": {
      "y": {
        "field": "Bird",
        "type": "nominal",
        "axis": {
          "title": "Types of African Endangered Birds",
          "labelAngle": 0
        },
        "sort": ["Blue Crowned Crane", "Northern Bald Ibis", "Hooded Vulture", "African Penguin", "Grey Crowned Crane"]
      },
      "x": {
        "field": "Lifespan",
        "type": "quantitative",
        "axis": {
          "title": "Lifespan in Years",
          "values": [0, 20, 40, 60],
          "style": ["solidGrid"],
          "tickCount": 8,
          "staggerLabels": true
        },
        "scale": {
          "domain": [0, 70]
        }
      },
      "texture": {
        "field": "Condition",
        "type": "nominal",
        "legend": {
          "title": "Key"
        },
        "scale": {
          "domain": ["Captive", "Wild"],
          "range": ["denseDottedFill", "solidGrayFill"]
        }
      },
      "yOffset": { "field": "Condition" }
    },
    "title": {
      "text": "Lifespan of Common Endangered African Birds"
    },
    "config": {
      "mark": {
        "stroke": "black",
        "strokeWidth": 2
      },
      "legend": {
        "direction": "horizontal",
        "orient": "top"
      },
      "axis": {
        "labelLimit": 0
      }
    }
  }
  // Initialize Monaco Editor
  const editor = monaco.editor.create(editorContainer, {
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

  function renderTactileChart(spec: any) {
    initSvgPatterns();
    let TVLSpec = JSON.parse(JSON.stringify(spec));
    if (TVLSpec.encoding.texture) {
      TVLSpec.encoding.color = TVLSpec.encoding.texture;
      delete TVLSpec.encoding.texture;
    }

    let mergedSpec = TVLSpec;
    let defaultSpec = selectDefaultSpec(TVLSpec);
    let updatedDefaultSpec = updateDefault(TVLSpec, defaultSpec);
    mergedSpec = mergeSpec(TVLSpec, updatedDefaultSpec);

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
