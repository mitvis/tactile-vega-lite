// dictionary of font properties
const fontProperties = {
    "Swell Braille": 29,
    "California Braille": 29,
    "Braille29": 29,
}

function mergeSpec(userSpec: any, defaultSpec: any) {
    // Function to deeply merge two objects
    function deepMerge(target: any, source: any) {
        Object.keys(source).forEach((key) => {
            const targetValue = target[key];
            const sourceValue = source[key];

            if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
                target[key] = targetValue.concat(sourceValue);
            } else if (typeof targetValue === 'object' && typeof sourceValue === 'object') {
                target[key] = deepMerge({ ...targetValue }, sourceValue);
            } else {
                target[key] = sourceValue;
            }
        });
        return target;
    }

    // update defaultSpec with userSpec font info  
    if (userSpec.config && userSpec.config.text) {
        const userFont = userSpec.config.text.brailleFont;
        // find the corresponding fontSize for the userFont
        const userFontSize = fontProperties[userFont as keyof typeof fontProperties];
        updateAcross(defaultSpec, userFont, userFontSize);
    }


    // Function to update all font-related properties in an object
    function updateAcross(obj: any, userFont: string, userFontSize: number) {
        // [NOTE]if there are other things that need to be updated across the spec, do: 
        // add new parameter, userFontSize
        // add new condition, else if (key.includes('FontSize'))
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                updateAcross(obj[key], userFont, userFontSize); // Recursively update nested objects
            } else {
                if (key === "labelFont" || key === "titleFont" || key === "font") { // Check if the key is related to font settings
                    obj[key] = userFont;
                }
                if (key === "labelFontSize" || key === "titleFontSize" || key === "fontSize"){
                    obj[key] = userFontSize;
                }

            }
        });
    }


    let mergedSpec = { ...defaultSpec, ...userSpec };

    Object.keys(defaultSpec).forEach((key) => {
        if (typeof defaultSpec[key] === 'object' && !Array.isArray(defaultSpec[key]) && defaultSpec[key] !== null) {
            // If the key exists in userSpec and is an object, recursively merge
            if (key in userSpec && typeof userSpec[key] === 'object' && !Array.isArray(userSpec[key])) {
                mergedSpec[key] = mergeSpec(userSpec[key], defaultSpec[key]);
            } else if (!(key in userSpec)) {
                // If the key doesn't exist in userSpec, use the defaultSpec's value
                mergedSpec[key] = defaultSpec[key];
            }
        }
    });
    return mergedSpec;
}

export { mergeSpec }
