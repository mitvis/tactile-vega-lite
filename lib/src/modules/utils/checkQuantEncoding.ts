// function to check which axis is used to encode quatitative information 

export function checkQuantEncoding(spec: any): string {
    if (spec.encoding.x.type === "quantitative") {
        return "x";
    } else if (spec.encoding.y.type === "quantitative") {
        return "y";
    } else {
        return "none";
    }
}