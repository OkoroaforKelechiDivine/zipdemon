function parseRuby(content) {
    const functionRegex = /def\s+(\w+)\s*\(/g;
    const classRegex = /class\s+(\w+)/g;
    const variableRegex = /(\w+)\s*=\s*/g;

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
        variables.push(match[1]);
    }

    return { classes, functions, variables };
}

module.exports = parseRuby;