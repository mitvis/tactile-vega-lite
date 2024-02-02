import vegaEmbed from "vega-embed"
import { TopLevelSpec } from 'vega-lite'; 
import { modifySvg } from './modules/chartModifier';

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input') as HTMLInputElement;
    const view = document.getElementById('view');

    const defaultSpec = {
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
        }
        },
        "tactile": true
    }

    // Function to render the chart
    // bit of a hack: spec shouldn't have type any
    function renderChart(spec: any) {
        vegaEmbed('#view', spec, { renderer: "svg" }).then(result => {
            if (spec.tactile === true) {
                console.log("Modify svg to be tactile compatible");
                modifySvg(result, spec); // Call the function to modify the SVG if tactile is true
            } else {
                console.log("Just render");
            }
        }).catch(error => console.error(error));
    }

    // Render default chart on page load
    renderChart(defaultSpec);

    // Update chart on input change
    input?.addEventListener('input', () => {
        try {
            const spec = JSON.parse(input!.value);
            renderChart(spec); // Use the same function to render updated chart
        } catch (error) {
            console.error('Invalid JSON', error);
            // Optionally, revert to default spec or handle invalid JSON input here
        }
    });

});
