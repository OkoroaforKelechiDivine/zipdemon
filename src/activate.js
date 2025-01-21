const vscode = require('vscode');
const { promptToDocumentNewFile, promptToDocumentFileChange } = require('./utils/promptToDocument');
const { previewReadme } = require('./utils/previewReadme');

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('zipdemon.generateDocumentation', () => {
            vscode.window.showInformationMessage('zipDemon server is now active and ready to bomb!');
        }),

        vscode.commands.registerCommand('zipdemon.previewReadme', previewReadme)
    );

    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*');
    fileWatcher.onDidCreate(uri => promptToDocumentNewFile(uri));
    fileWatcher.onDidChange(uri => promptToDocumentFileChange(uri));

    context.subscriptions.push(fileWatcher);
}

module.exports = activate;
