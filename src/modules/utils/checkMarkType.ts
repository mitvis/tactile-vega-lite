// function that takes in a vl spec and return a mark type
function checkMarkType(spec: any) {
    if (spec.mark === "arc" || spec.mark.type === "arc") {
        return "arc";
    } else if (spec.mark === "bar" || spec.mark.type === "bar") {
        return "bar";
    } else if (spec.mark === "circle" || spec.mark.type === "circle") {
        return "circle";
    } else if (spec.mark === "line" || spec.mark.type === "line") {
        return "line";
    } else {
        return "unsupported";
    }
}