function parseJava(content) {
    const functionRegex = /public\s+\w+\s+(\w+)\s*\(/g;
    const classRegex = /class\s+(\w+)/g;
    const variableRegex = /(\w+)\s+(\w+)\s*;/g;

    return parseContent(content, functionRegex, classRegex, variableRegex);
}

function parseContent(content, functionRegex, classRegex, variableRegex) {
    const classes = [];
    const functions = [];
    const variables = [];

    let match;
    while ((match = classRegex.exec(content)) !== null) {
        classes.push(match[1]);
    }

    while ((match = functionRegex.exec(content)) !== null) {
        functions.push(match[1]);
    }

    while ((match = variableRegex.exec(content)) !== null) {
        variables.push(match[2]);
    }

    return { classes, functions, variables };
}

module.exports = parseJava;