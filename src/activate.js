const vscode = require('vscode');
const { promptToDocumentNewFile, promptToDocumentFileChange } = require('./utils/promptToDocument');

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('zipdemon.generateDocumentation', () => {
            vscode.window.showInformationMessage('ZipDemon Documentation Generator is Active!');
        })
    );

    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*');
    fileWatcher.onDidCreate(uri => promptToDocumentNewFile(uri));
    fileWatcher.onDidChange(uri => promptToDocumentFileChange(uri));

    context.subscriptions.push(fileWatcher);
}

module.exports = activate;
