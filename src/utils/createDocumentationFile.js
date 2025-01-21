const fs = require('fs');
const path = require('path');
const { setGeneratedFilePath } = require('../shared/generatedFilePath');
const { previewReadme } = require('./previewReadme');


function createDocumentationFile(filePath, content) {
    const docFolder = path.join(path.dirname(filePath), 'docs');
    if (!fs.existsSync(docFolder)) fs.mkdirSync(docFolder);

    const docFileName = `${path.basename(filePath, path.extname(filePath))}_documentation.md`;
    const docFilePath = path.join(docFolder, docFileName);

    fs.writeFileSync(docFilePath, content, 'utf-8');

    setGeneratedFilePath(docFilePath);

    previewReadme();
}

module.exports = createDocumentationFile;
