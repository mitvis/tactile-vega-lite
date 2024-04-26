// import all defaultTVL Specs

import { defaultTVLSpecBar } from "../specs/defaultTVLSpecBar"
import { defaultTVLSpecBarGrouped } from "../specs/defaultTVLSpecBarGrouped"
import { defaultTVLSpecLine } from "../specs/defaultTVLSpecLine";
import { defaultTVLSpecScatter } from "../specs/defaultTVLSpecScatter";
import { defaultTVLSpecArc } from "../specs/defaultTVLSpecArc";
// select defaultTVLspec based on mark type 
function selectDefaultSpec(userSpec: any) {

    // Check if mark is a string and equals "line"
    if (typeof userSpec.mark === 'string' && userSpec.mark === "line") {
        return defaultTVLSpecLine;
    }
    // Check if mark is an object, has a "type" property, and the value of "type" is "line"
    else if (typeof userSpec.mark === 'object' && userSpec.mark.type === "line") {
        return defaultTVLSpecLine;
    }

    // repeat for bar 
    if (typeof userSpec.mark === 'string' && userSpec.mark === "bar") {
        if (userSpec.encoding.xOffset && userSpec.encoding.xOffset !== null) {
            return defaultTVLSpecBarGrouped;
        }
        return defaultTVLSpecBar;
    }
    else if (typeof userSpec.mark === 'object' && userSpec.mark.type === "bar") {
        if (userSpec.encoding.xOffset && userSpec.encoding.xOffset !== null) {
            return defaultTVLSpecBarGrouped;
        }
        return defaultTVLSpecBar;
    }

    if (typeof userSpec.mark === 'string' && userSpec.mark === "point") {
        return defaultTVLSpecScatter;
    }
    else if (typeof userSpec.mark === 'object' && userSpec.mark.type === "point") {
        return defaultTVLSpecScatter;;
    }

    if (typeof userSpec.mark === 'string' && userSpec.mark === "arc") {

        return defaultTVLSpecArc;
    }
    else if (typeof userSpec.mark === 'object' && userSpec.mark.type === "arc") {

        return defaultTVLSpecArc;
    }

    if (typeof userSpec.mark === 'string' && (userSpec.mark === "point" || userSpec.mark === "circle")) {

        return defaultTVLSpecScatter;
    }
    else if (typeof userSpec.mark === 'object' && (userSpec.mark.type === "point" || userSpec.mark.type === "circle")) {

        return defaultTVLSpecScatter;
    }
}

export { selectDefaultSpec };