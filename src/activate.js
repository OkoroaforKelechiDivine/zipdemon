const vscode = require('vscode');
const { promptToDocumentNewFile, promptToDocumentFileChange } = require('./utils/promptToDocument');
const { previewReadme } = require('./utils/previewReadme');
const { generateCleanCode } = require('./shared/generateCleanCode');

async function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('zipdemon.generateDocumentation', () => {
            vscode.window.showInformationMessage('zipDemon server is now active and ready to bomb!');
        }),
        
        vscode.commands.registerCommand('zipdemon.previewReadme', previewReadme),
        vscode.commands.registerCommand('zipdemon.generateCleanCode', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const selection = editor.selection;
                const selectedText = editor.document.getText(selection);

                if (selectedText.trim()) {
                    
                    const cleanCode = await generateCleanCode(selectedText);
                    if (cleanCode) {
                        editor.edit(editBuilder => {
                            editBuilder.replace(selection, cleanCode);
                        });
                    }
                }
            }
        })
    );

    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*');
    fileWatcher.onDidCreate(uri => promptToDocumentNewFile(uri));
    fileWatcher.onDidChange(uri => promptToDocumentFileChange(uri));

    context.subscriptions.push(fileWatcher);
}

module.exports = activate;