import vegaEmbed from "vega-embed";
import {Config, TopLevelSpec, compile} from 'vega-lite';
import { modifySvg } from './modules/chartModifier';
import { getBrailleWidthForSelectors } from "./modules/braille/getBrailleWidthForSelectors";
const d3 = require("d3");
import { updateSpecForTactile} from "./modules/updateSpec";

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input') as HTMLInputElement;
    const submitButton = document.getElementById('render') as HTMLButtonElement;

    const defaultSpec: any = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {"url": "https://raw.githubusercontent.com/vega/vega-datasets/main/data/seattle-weather.csv"},
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
        "tactile": true,
    }

    const bubblePlotSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "data": {
          "url": "https://raw.githubusercontent.com/vega/vega-datasets/main/data/disasters.csv"
        },
        "width": 600,
        "height": 400,
        "transform": [
          {"filter": "datum.Entity !== 'All natural disasters'"}
        ],
        "mark": {
          "type": "circle",
          "opacity": 0.8,
          "stroke": "black",
          "strokeWidth": 1
        },
        "encoding": {
          "x": {
            "field": "Year",
            "type": "temporal",
            "axis": {"grid": false}
          },
          "y": {"field": "Entity", "type": "nominal", "axis": {"title": ""}},
          "size": {
            "field": "Deaths",
            "type": "quantitative",
            "title": "Annual Global Deaths",
            "legend": {"clipHeight": 30},
            "scale": {"rangeMax": 5000}
          },
          "color": {"field": "Entity", "type": "nominal", "legend": null}
        },
        "tactile": {
          "brailleFont": "swell-braille",
          "brailleFontSize": 30,
        }
    }
    
    // function to render vega-lite spec
    function renderVegaLiteChart(spec: TopLevelSpec) {
      vegaEmbed("#visual", spec, { renderer: "svg" }).then(result => {
      }).catch(error => console.error(error));
    }
    

    function renderTactileChart(spec: any) {
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


});
