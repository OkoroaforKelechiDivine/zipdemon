function createDocumentation(parsedData, geminiExplanation) {
    let docContent = `## Explanation\n${geminiExplanation}\n\n`;

    parsedData.classes.forEach(className => (docContent += `## Class: ${className}\n\n`));
    parsedData.functions.forEach(func => (docContent += `- Function: ${func}\n`));
    parsedData.variables.forEach(variable => (docContent += `- Variable: ${variable}\n`));

    return docContent;
}

module.exports = createDocumentation;
