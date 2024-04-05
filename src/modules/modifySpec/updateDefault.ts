import { checkQuantEncoding } from "../utils/checkQuantEncoding";

// dictionary of font properties
const fontProperties = {
    "Swell Braille": 29,
    "California Braille": 29,
    "Braille29": 29,
}

const defaultGridWidth = 1; // default grid width
const defaultPaddingBetweenBars = 0.2; // default padding between bars
const defaultTitleYOffset = -30;

// Function to update all font-related properties in an object
function updateFontAcross(obj: any, userFont: string, userFontSize: number) {
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            updateFontAcross(obj[key], userFont, userFontSize); // Recursively update nested objects
        } else {
            if (key === "labelFont" || key === "titleFont" || key === "font" || key === "subtitleFont") { // Check if the key is related to font settings
                obj[key] = userFont;
            }
            if (key === "labelFontSize" || key === "titleFontSize" || key === "fontSize" || key === "subtitleFontSize") {
                obj[key] = userFontSize;
            }

        }
    });
}

function updateFont(userSpec: any, defaultSpec: any) {
    // update defaultSpec with userSpec font info  
    if (userSpec.config && userSpec.config.text) {
        const userFont = userSpec.config.text.brailleFont;
        // find the corresponding fontSize for the userFont
        const userFontSize = fontProperties[userFont as keyof typeof fontProperties];
        updateFontAcross(defaultSpec, userFont, userFontSize);
    }
    return defaultSpec;
}

function updateAxis(userSpec: any, quantAxis: string, defaultSpec: any) {

    if (userSpec.config && userSpec.config.axis && userSpec.config.axis.grid && userSpec.config.axis.grid === true) {
        defaultSpec.encoding.x.axis.grid = true;
        defaultSpec.encoding.y.axis.grid = true;
    } else {
        if (quantAxis === "x") {
            // append the following axis properties to the defaultSpec
            defaultSpec.encoding.x.axis = {
                "grid": true,
                "gridWidth": defaultGridWidth,
                "gridColor": "black",
                "titlePadding": 10,
                "labelAngle": 0,
                "labelPadding": 10,
                "staggerLabels": "auto",
                "ticks": true,
            };
            defaultSpec.encoding.y.axis = {
                "grid": false,
                "ticks": false,
                "titleAlign": "left",
                "titleAngle": 0,
                "titleAnchor": "end",
                "titleY": defaultTitleYOffset
            };
        }

        if (quantAxis === "y") {
            defaultSpec.encoding.x.axis = {
                "grid": false,
                "ticks": true,
                "titlePadding": 10,
                "labelAngle": 0,
                "labelPadding": 10,
                "staggerLabels": "auto",
            };
            // append the following axis properties to the defaultSpec
            defaultSpec.encoding.y.axis = {
                "grid": true,
                "gridWidth": defaultGridWidth,
                "gridColor": "black",
                "titleAlign": "left",
                "titleAngle": 0,
                "titleAnchor": "end",
                "titleY": defaultTitleYOffset
            };
        }

    }


    return defaultSpec;
}

function updateGroupedBarAxis(quantAxis: string, defaultSpec: any) {
    if (quantAxis === "x") {
        defaultSpec.encoding.yOffset = {
            "scale": {
                "type": "band",
                "padding": defaultPaddingBetweenBars
            }
        }
    }

    if (quantAxis === "y") {
        defaultSpec.encoding.xOffset = {
            "scale": {
                "type": "band",
                "padding": defaultPaddingBetweenBars
            }
        }
    }
    return defaultSpec;
}

function updatePointMarkFill(userSpec: any, defaultSpec: any) {
    if (userSpec.mark.point) {
        defaultSpec.mark = {
            type: "line",
            point: {
                "fill": "black",
                "size": 50
            }
        }
    }

}

function updateDefault(userSpec: any, defaultSpec: any) {
    let quantAxis = "";
    if (userSpec.mark === "point" || userSpec.mark.type === "point" || userSpec.mark === "line" || userSpec.mark.type === "line" || userSpec.mark === "bar" || userSpec.mark.type === "bar") {
        quantAxis = checkQuantEncoding(userSpec);
        defaultSpec = updateAxis(userSpec, quantAxis, defaultSpec);
    }

    defaultSpec = updateFont(userSpec, defaultSpec);

    if (defaultSpec.mark === "bar") {
        if (userSpec.encoding.xOffset || userSpec.encoding.yOffset)
            defaultSpec = updateGroupedBarAxis(quantAxis, defaultSpec);
    }
    if (defaultSpec.mark === "line") {
        updatePointMarkFill(userSpec, defaultSpec);
    }
    return defaultSpec;

}

export { updateDefault };