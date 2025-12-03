const defaultPPI = 224; // default PPI of the display
const minLineWidth = 1; // (mm)  minimum line width

// ===================================== // 
// ======== Navigational Aids ========== // 
// ===================================== // 


// ======= Gridlines ======= // 
// const defaultGridWidth = minLineWidth / 25.4 * defaultPPI; // default grid width
const defaultGridlineThickness = 1 // gridWidth
const defaultGridlineColor = "black" //gridColor

// ======= Axis ======= // 
const defaultAxisThickness = 2.5
const defaultAxisColor = "black" // domainColor
// Y Axis
const defaultYAxisTitlePadding = 20; // align the start of the title and the start of the axis labels
const defaultYAxisLabelPadding = 20; // default label padding (distance from Y axis line)
const defaultTitleYOffset = -10; // default title y offset from the top of the axis


// X Axis 
const defaultXAxisTitlePadding = 20; // distance between X axis title and X axis labels
const defaultXAxisLabelPadding = 20; // default label padding (distance from X axis line)

// ======= Ticks ======= // 
const minTickLength = 3; // tickSize
const defaultTickLength = minTickLength / 25.4 * defaultPPI; // tickSize
const defaultTickThickness = 2.5 // tickWidth
const defaultTickColor = "black"; // tickColor


// Marks
// outline
const defaultStrokeWidth = 4; // default stroke width


// Braille
const defaultBrailleFont = "Swell Braille";
const defaultBrailleFontSize = 29;




const defaultLegendTitlePadding = 20; // distance between legend title and legend labels
const defaultLegendPadding = 100 // distance between bottom of legend and top of chart 
// probably don't want to hardcode this 
// [TODO] get y position of y axis title, 
// y position of lengend + lengend height, maybe set padding to the difference?? 
const defaultLegendSymbolSize = 3000;  // size of the legend symbols
const defaultLegentColumnPadding = 20; // distance between legend columns
const defaultLegendRowPadding = 20; // distance between legend rows


const defaultLabelPadding = 10; // default label padding (distance from axis line)

export const defaultTVLSpecLine = {
    "mark": "line",
    "encoding": {
        "x": {
            "axis": {
                "titleAnchor": "start",
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
                "titleY": defaultTitleYOffset
            }
        }
    },
    // config
    "config": {
        "background": "white",
        "view": {
            "stroke": "transparent"
        },
        "title": {
            "font": defaultBrailleFont,
            "fontSize": defaultBrailleFontSize,
            "fontWeight": "normal",
            "subtitleFont": defaultBrailleFont,
            "subtitleFontSize": defaultBrailleFontSize,
        },
        "mark": {
            "stroke": "black",
            "strokeWidth": 6,
            "size": 10
        },
        "axis": {
            "titleFont": defaultBrailleFont,
            "titleFontSize": defaultBrailleFontSize,
            "titleFontWeight": "normal",

            "titleAngle": 0,
            "titleAlign": "left",

            "labelFont": defaultBrailleFont,
            "labelFontSize": defaultBrailleFontSize,
            "labelFontWeight": "normal",
            "labelAngle": 0,

            "tickSize": defaultTickLength,
            "tickColor": defaultTickColor,
            "tickWidth": defaultTickThickness,

            "domainWidth": defaultAxisThickness,
            "domainColor": defaultAxisColor,

            "gridWidth": defaultGridlineThickness,
            "gridColor": defaultGridlineColor
        },
        "legend": {
            "labelFont": defaultBrailleFont,
            "labelFontSize": defaultBrailleFontSize,
            "labelFontWeight": "normal",
            "titleFont": defaultBrailleFont,
            "titleFontSize": defaultBrailleFontSize,
            "titleFontWeight": "normal",
            "titlePadding": defaultLegendTitlePadding,
            "direction": "vertical",
            "orient": "top",
            "padding": defaultLegendPadding,
            "symbolSize": defaultLegendSymbolSize,
            "columnPadding": defaultLegentColumnPadding,
            "rowPadding": defaultLegendRowPadding
        },
        "scale": {
            "barBandPaddingInner": 0.2,
        },
        "padding": {
            "top": 100, "bottom": 100, "left": 100, "right": 100
        },
        "style": {
            "dottedGrid": {
                "grid": true,
                "gridCap": "round",
                "gridDash": [2, 20],
                "gridColor": "black",
                "gridOpacity": 1,
                "gridWidth": defaultGridlineThickness,
            },
            "dashedGrid": {
                "grid": true,
                "gridCap": "square",
                "gridDash": [56, 28],
                "gridColor": "black",
                "gridOpacity": 1,
                "gridWidth": defaultGridlineThickness,
            },
            "solidGrid": {
                "grid": true,
                "gridCap": "butt",
                "gridDash": [0],
                "gridColor": "black",
                "gridOpacity": 0.7,
                "gridWidth": defaultGridlineThickness,
            },
            "noGrid": {
                "grid": false,
            },
            "foregroundGrid": {
                "zindex": 1
            },
            "backgroundGrid": {
                "zindex": 0
            }
        },
        "tactileParams": {
            "defaultPPI": defaultPPI,
            "minLineWidth": minLineWidth,
            "defaultGridWidth": defaultGridlineThickness,
            "minTickLength": defaultTickLength,
            "defaultTickLength": defaultTickLength,
        }
    }
}
