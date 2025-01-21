const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const generateDocumentation = require('./generateDocumentation');
const { showPreviewButton } = require('./previewReadme');

function promptToDocumentNewFile(uri) {
    handlePrompt(uri, 'A new file has been created. Would you like to generate documentation?');
}

function promptToDocumentFileChange(uri) {
    handlePrompt(uri, 'The file now has content. Would you like to generate documentation?');
}

function handlePrompt(uri, message) {
    const filePath = uri.fsPath;
    const fileExtension = path.extname(filePath).toLowerCase();
    const supportedExtensions = ['.js', '.py', '.java', '.cpp', '.rb', '.go', '.dart', '.php', '.cs', '.ts'];

    if (supportedExtensions.includes(fileExtension)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        if (fileContent.trim().length > 0) {
            vscode.window
                .showInformationMessage(message, 'Yes', 'No')
                .then(selection => {
                    if (selection === 'Yes') {
                        generateDocumentation(filePath);
                        showPreviewButton();
                    }
                }
            );
        }
    }
}

module.exports = { promptToDocumentNewFile, promptToDocumentFileChange };
