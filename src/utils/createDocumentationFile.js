const fs = require('fs');
const path = require('path');

function createDocumentationFile(filePath, content) {
    const docFolder = path.join(path.dirname(filePath), 'docs');
    if (!fs.existsSync(docFolder)) fs.mkdirSync(docFolder);

    const docFileName = `${path.basename(filePath, path.extname(filePath))}_documentation.md`;
    fs.writeFileSync(path.join(docFolder, docFileName), content, 'utf-8');
}

module.exports = createDocumentationFile;
