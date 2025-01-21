const fs = require('fs');
const vscode = require('vscode');
const { getGeneratedFilePath } = require('../shared/generatedFilePath');

function showPreviewButton() {
    const previewButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    previewButton.text = '$(eye) zipdemon Document preview';
    previewButton.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    previewButton.command = 'zipdemon.previewReadme';
    previewButton.show();
}

function previewReadme() {
    const generatedFilePath = getGeneratedFilePath();
    if (generatedFilePath && fs.existsSync(generatedFilePath)) {
        vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(generatedFilePath))
            .then(() => {
                vscode.window.showInformationMessage('Document previewed as markdown!');
            }).catch(err => {
                vscode.window.showInformationMessage('Failed to preview document: ' + err.message);
            });
    } else {
        vscode.window.showInformationMessage('No document file generated yet.');
    }
}

module.exports = { showPreviewButton, previewReadme };
