// const defaultPPI = 224; // default PPI of the display
// const minLineWidth = 1; // (mm)  minimum line width


// // Grid 
// const defaultGridWidth = minLineWidth / 25.4 * defaultPPI; // default grid width


// // Ticks
// const minTickLength = 6; // (mm) minimum tick length
// const defaultTickLength = minTickLength / 25.4 * defaultPPI; // default tick length


// // marks
// // outline
// const defaultStrokeWidth = defaultGridWidth * 1.2; // default stroke width

// const defaultBrailleFont = "Swell Braille";
// const defaultBrailleFontSize = 29;

// // axis
// const defaultXAxisTitlePadding = 20;

// const defaultLabelPadding = 10; // default label padding (distance from axis line)

// const defaultLegendTitlePadding = 20; // distance between legend title and legend labels
// const defaultLegendPadding = 60 // distance between bottom of legend and top of chart 
// // probably don't want to hardcode this 
// // [TODO] get y position of y axis title, 
// // y position of lengend + lengend height, maybe set padding to the difference?? 
// const minLegendSymbolWidth = 1 // (inch) minimum width of the legend symbols
// const minLegendSymbolHeight = 1 / 2 // (inch) minimum height of the legend symbols
// // const defaultLegendSymbolSize = defaultPPI * minLegendSymbolHeight;  // size of the legend symbols
// const defaultLegendSymbolSize = 3000;
// const defaultLegentColumnPadding = 20; // distance between legend columns
// const defaultLegendRowPadding = 20; // distance between legend rows


// const defaultSubtitlePadding = 40; // distance between subtitle and title
// const defaultTitlePadding = 40;

// export const defaultTVLSpecBarGrouped = {
//     "mark": {
//         "type": "bar",
//         "stroke": "black",
//         "strokeWidth": defaultStrokeWidth
//     },
//     "encoding": {
//         "x": {
//             "axis": {
//                 "titlePadding": defaultXAxisTitlePadding,
//                 "labelAngle": 0,
//                 "labelPadding": defaultLabelPadding,
//             }
//         },
//         "y": {
//             "axis": {
//                 "titleAlign": "left",
//                 "titleAngle": 0,
//                 "titleAnchor": "end",
//             }
//         }
//     },
//     // config
//     "config": {
//         "background": "white",
//         "view": {
//             "stroke": "black",
//             "strokeWidth": defaultStrokeWidth
//         },
//         "bar": {
//             "binSpacing": 3,
//         },
//         "title": {
//             "font": defaultBrailleFont,
//             "fontSize": defaultBrailleFontSize,
//             "subtitlePadding": defaultSubtitlePadding,
//             "offset": defaultTitlePadding,
//             "subtitleFont": defaultBrailleFont,
//             "subtitleFontSize": defaultBrailleFontSize,
//         },
//         "mark": {
//             "stroke": "black",
//             "strokeWidth": defaultStrokeWidth
//         },
//         "axis": {
//             "labelFont": defaultBrailleFont,
//             "labelFontSize": defaultBrailleFontSize,
//             "labelAngle": 0,
//             "titleFont": defaultBrailleFont,
//             "titleFontSize": defaultBrailleFontSize,
//             "tickSize": defaultTickLength,
//             "tickColor": "black",
//             "tickWidth": defaultStrokeWidth,
//             "domainColor": "black"
//         },
//         "legend": {
//             "labelFont": defaultBrailleFont,
//             "labelFontSize": defaultBrailleFontSize,
//             "titleFont": defaultBrailleFont,
//             "titleFontSize": defaultBrailleFontSize,
//             "titlePadding": defaultLegendTitlePadding,
//             "direction": "vertical",
//             "orient": "top",
//             "padding": defaultLegendPadding,
//             "symbolSize": defaultLegendSymbolSize,
//             "columnPadding": defaultLegentColumnPadding,
//             "rowPadding": defaultLegendRowPadding
//         },
//         "scale": {
//             "barBandPaddingInner": 0.3,
//         },
//         "padding": {
//             "top": 100, "bottom": 100, "left": 200, "right": 200 // padding around the chart, so that nothing gets cut off
//         },
//         "style": {
//             "dottedGrid": {
//                 "grid": true,
//                 "gridCap": "round",
//                 "gridDash": [2, 20],
//                 "gridColor": "black",
//                 "gridOpacity": 1,
//                 "gridWidth": defaultGridWidth,
//             },
//             "dashedGrid": {
//                 "grid": true,
//                 "gridCap": "square",
//                 "gridDash": [56, 28],
//                 "gridColor": "black",
//                 "gridOpacity": 1,
//                 "gridWidth": defaultGridWidth,
//             },
//             "solidGrid": {
//                 "grid": true,
//                 "gridCap": "butt",
//                 "gridDash": [0],
//                 "gridColor": "black",
//                 "gridOpacity": 1,
//                 "gridWidth": defaultGridWidth,
//             },
//             "noGrid": {
//                 "grid": false,
//             },
//             "foregroundGrid": {
//                 "zindex": 1
//             },
//             "backgroundGrid": {
//                 "zindex": 0
//             }
//         },
//         "tactileParams": {
//             "defaultPPI": defaultPPI,
//             "minLineWidth": minLineWidth,
//             "defaultGridWidth": defaultGridWidth,
//             "minTickLength": minTickLength,
//             "defaultTickLength": defaultTickLength,
//         }
//     }
// }
const defaultPPI = 224; // default PPI of the display


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


// ===================================== // 
// ============= Braille =============== // 
// ===================================== // 
const defaultBrailleFont = "Swell Braille";
const defaultBrailleFontSize = 24;


// legend
const defaultLegendTitlePadding = 20; // distance between legend title and legend labels
const defaultLegendPadding = 60 // distance between bottom of legend and top of chart 
// probably don't want to hardcode this 
// [TODO] get y position of y axis title, 
// y position of lengend + lengend height, maybe set padding to the difference?? 
const defaultLegendSymbolSize = 3000;  // size of the legend symbols
const defaultLegentColumnPadding = 20; // distance between legend columns
const defaultLegendRowPadding = 20; // distance between legend rows


export const defaultTVLSpecBarGrouped = {
    "mark": {
        "type": "bar",
    },
    "encoding": {
        "x": {
            "axis": {
                "titleAnchor": "start",
                "titlePadding": defaultXAxisTitlePadding,
                "labelPadding": defaultXAxisLabelPadding,
                "staggerLabels": "auto",
            }
        },
        "y": {
            "axis": {
                "titleAnchor": "end",
                "titlePadding": defaultYAxisTitlePadding,
                "titleY": defaultTitleYOffset,
                "labelPadding": defaultYAxisLabelPadding,
                // "style": ["solidGrid", "backgroundGrid"], // by default we assume that quantitative info is plotted on y (i.e. vertical bar chart), and we default to add grid for y axis
            }
        }
    },
    // config
    "config": {
        "background": "white",
        "title": {
            "font": defaultBrailleFont,
            "fontSize": defaultBrailleFontSize,
            "fontWeight": "normal",
            "subtitleFont": defaultBrailleFont,
            "subtitleFontSize": defaultBrailleFontSize,
        },
        "mark": {
            "stroke": "black",
            "strokeWidth": defaultStrokeWidth
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
            "titleFont": defaultBrailleFont,
            "titleFontSize": defaultBrailleFontSize,
            "fontWeight": "normal",
            "titlePadding": defaultLegendTitlePadding,

            "labelFont": defaultBrailleFont,
            "labelFontSize": defaultBrailleFontSize,

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
        },
        "text": {
            "font": defaultBrailleFont,
            "fontSize": defaultBrailleFontSize,
            "fontWeight": "normal",
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
        }
    }
}
