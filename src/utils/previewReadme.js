const fs = require('fs');
const vscode = require('vscode');
const { getGeneratedFilePath } = require('../shared/generatedFilePath');

let currentPreview; // Keep track of the current preview

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
        const fileUri = vscode.Uri.file(generatedFilePath);
        if (currentPreview) {
            currentPreview.dispose();
        }

        vscode.window.showTextDocument(fileUri).then((editor) => {
            vscode.commands.executeCommand('markdown.showPreviewToSide', fileUri).then(() => {
                currentPreview = vscode.window.createTextEditorDecorationType({
                    isWholeLine: false,
                });
                vscode.window.showInformationMessage('Document previewed as markdown!');
            }).catch(err => {
                vscode.window.showInformationMessage('Failed to preview document: ' + err.message);
            });
        }).catch(err => {
            vscode.window.showInformationMessage('Failed to open file for editing: ' + err.message);
        });
    } else {
        vscode.window.showInformationMessage('No document file generated yet.');
    }
}

module.exports = { showPreviewButton, previewReadme };
