


function mergeSpec(userSpec: any, defaultSpec: any) {

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
