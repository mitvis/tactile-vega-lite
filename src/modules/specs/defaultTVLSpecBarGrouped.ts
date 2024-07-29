const defaultPPI = 224; // default PPI of the display
const minLineWidth = 1; // (mm)  minimum line width


// Grid 
const defaultGridWidth = minLineWidth / 25.4 * defaultPPI; // default grid width


// Ticks
const minTickLength = 6; // (mm) minimum tick length
const defaultTickLength = minTickLength / 25.4 * defaultPPI; // default tick length


// marks
// outline
const defaultStrokeWidth = defaultGridWidth; // default stroke width

const defaultBrailleFont = "Swell Braille";
const defaultBrailleFontSize = 29;

// axis
const defaultXAxisTitlePadding = 20;

const defaultLabelPadding = 10; // default label padding (distance from axis line)

const defaultLegendTitlePadding = 20; // distance between legend title and legend labels
const defaultLegendPadding = 60 // distance between bottom of legend and top of chart 
// probably don't want to hardcode this 
// [TODO] get y position of y axis title, 
// y position of lengend + lengend height, maybe set padding to the difference?? 
const defaultLegendSymbolSize = 3000;  // size of the legend symbols
const defaultLegentColumnPadding = 20; // distance between legend columns
const defaultLegendRowPadding = 20; // distance between legend rows


const defaultSubtitlePadding = 40; // distance between subtitle and title
const defaultTitlePadding = 40;

export const defaultTVLSpecBarGrouped = {
    "mark": {
        "type": "bar",
        "stroke": "black",
        "strokeWidth": defaultStrokeWidth
    },
    "encoding": {
        "x": {
            "axis": {
                "titlePadding": defaultXAxisTitlePadding,
                "labelAngle": 0,
                "labelPadding": defaultLabelPadding,
            }
        },
        "y": {
            "axis": {
                "titleAlign": "left",
                "titleAngle": 0,
                "titleAnchor": "end",
            }
        }
    },
    // config
    "config": {
        "background": "white",
        "view": {
            "stroke": "black",
            "strokeWidth": defaultStrokeWidth
        },
        "title": {
            "font": defaultBrailleFont,
            "fontSize": defaultBrailleFontSize,
            "subtitlePadding": defaultSubtitlePadding,
            "offset": defaultTitlePadding,
            "subtitleFont": defaultBrailleFont,
            "subtitleFontSize": defaultBrailleFontSize,
        },
        "mark": {
            "stroke": "black",
            "strokeWidth": defaultStrokeWidth
        },
        "axis": {
            "labelFont": defaultBrailleFont,
            "labelFontSize": defaultBrailleFontSize,
            "labelAngle": 0,
            "titleFont": defaultBrailleFont,
            "titleFontSize": defaultBrailleFontSize,
            "tickSize": defaultTickLength,
            "tickColor": "black",
            "tickWidth": defaultStrokeWidth,
            "domainColor": "black"
        },
        "legend": {
            "labelFont": defaultBrailleFont,
            "labelFontSize": defaultBrailleFontSize,
            "titleFont": defaultBrailleFont,
            "titleFontSize": defaultBrailleFontSize,
            "titlePadding": defaultLegendTitlePadding,
            "direction": "vertical",
            "orient": "top",
            "padding": defaultLegendPadding,
            "symbolSize": defaultLegendSymbolSize,
            "columnPadding": defaultLegentColumnPadding,
            "rowPadding": defaultLegendRowPadding
        },
        "scale": {
            "barBandPaddingInner": 0.3,
        },
        "padding": {
            "top": 100, "bottom": 100, "left": 200, "right": 200 // padding around the chart, so that nothing gets cut off
        }
    }
}
