const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const parseJavaScript = require('./src/parsers/parseJavaScript');
const parsePython = require('./src/parsers/parsePython');
const parseJava = require('./src/parsers/parseJava');
const parseCPlusPlus = require('./src/parsers/parseCPlusPlus');
const parseRuby = require('./src/parsers/parseRuby');
const parseGo = require('./src/parsers/parseGo');

function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('zipdemon.showPlayButton', () => {
        createPlayButtonView(context);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('zipdemon.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from ZipDemon!');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('zipdemon.generateDocumentation', () => {
        vscode.window.showInformationMessage('ZipDemon Documentation Generator is Active!');
    }));

    let fileWatcher = vscode.workspace.createFileSystemWatcher('**/*');

    fileWatcher.onDidCreate((uri) => {
        promptToDocumentNewFile(uri);
    });

    context.subscriptions.push(fileWatcher);

    // Add a file change watcher to detect changes in the file content
    vscode.workspace.onDidSaveTextDocument((document) => {
        checkFileContent(document);
    });
}

function createPlayButtonView(context) {
    const panel = vscode.window.createWebviewPanel(
        'playButton',
        'Documentation Generator',
        vscode.ViewColumn.One,
        {}
    );

    panel.webview.html = getWebviewContent();
    panel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'generateDocumentation':
                    const activeTextEditor = vscode.window.activeTextEditor;
                    if (activeTextEditor) {
                        generateDocumentation(activeTextEditor.document.uri.fsPath);
                    } else {
                        vscode.window.showInformationMessage('No active file to document.');
                    }
                    return;
            }
        },
        undefined,
        context.subscriptions
    );
}

function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <body>
        <h1>ZipDemon Documentation Generator</h1>
        <button id="playButton">Generate Documentation</button>
        <script>
            const playButton = document.getElementById('playButton');
            playButton.onclick = () => {
                vscode.postMessage({
                    command: 'generateDocumentation'
                });
            };
        </script>
    </body>
    </html>`;
}

function promptToDocumentNewFile(uri) {
    const filePath = uri.fsPath;
    const fileExtension = path.extname(filePath).toLowerCase();
    const supportedExtensions = ['.js', '.py', '.java', '.cpp', '.rb', '.go'];

    console.log(`File created: ${filePath}, Extension: ${fileExtension}`); // Debugging line

    if (supportedExtensions.includes(fileExtension)) {
        vscode.window.showInformationMessage(
            `A new ${fileExtension} file has been created. Would you like to generate documentation?`,
            'Yes',
            'No'
        ).then(selection => {
            if (selection === 'Yes') {
                generateDocumentation(filePath);
            }
        });
    }
}

// New function to check file content after it's saved
async function checkFileContent(document) {
    const filePath = document.uri.fsPath;
    const fileContent = document.getText();

    if (fileContent.trim()) {
        vscode.window.showInformationMessage(
            `The file has content. Would you like to generate documentation?`,
            'Yes',
            'No'
        ).then(async (selection) => {
            if (selection === 'Yes') {
                await generateDocumentation(filePath);
            }
        });
    }
}
async function generateDocumentation(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    if (!fileContent.trim()) {
        vscode.window.showInformationMessage("The file is empty. Documentation cannot be generated.");
        return;
    }

    const fileExtension = path.extname(filePath).toLowerCase();
    let parsedContent;

    if (fileExtension === '.js' || fileExtension === '.ts') {
        parsedContent = parseJavaScript(fileContent);
    } else if (fileExtension === '.py') {
        parsedContent = parsePython(fileContent);
    } else if (fileExtension === '.java') {
        parsedContent = parseJava(fileContent);
    } else if (fileExtension === '.cpp' || fileExtension === '.h') {
        parsedContent = parseCPlusPlus(fileContent);
    } else if (fileExtension === '.rb') {
        parsedContent = parseRuby(fileContent);
    } else if (fileExtension === '.go') {
        parsedContent = parseGo(fileContent);
    } else {
        vscode.window.showInformationMessage('Unsupported file type for documentation generation.');
        return;
    }

    const parsedData = createDocumentation(parsedContent);

    vscode.window.showInformationMessage(
        `This file has content. Would you like to generate documentation?`,
        'Yes',
        'No'
    ).then(async (selection) => {
        if (selection === 'Yes') {
            const geminiURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
            const apiKey = "GEMINI_API_KEY";  // Replace with your actual API key
            const headers = {
                "Content-Type": "application/json",
            };

            const data = {
                contents: [{
                    parts: [{
                        text: `Write a well-written document based on the following content:\n${parsedData}`
                    }]
                }]
            };

            try {
                let retries = 3;  // Number of retries
                let response;
                while (retries > 0) {
                    try {
                        response = await axios.post(`${geminiURL}?key=${apiKey}`, data, { headers });
                        break;  // Break if request is successful
                    } catch (error) {
                        if (error.response && error.response.status === 429) {
                            // Wait for 5 seconds before retrying if rate limit is hit
                            vscode.window.showInformationMessage("Rate limit reached. Retrying...");
                            await new Promise(resolve => setTimeout(resolve, 5000));  // 5-second delay
                            retries--;
                        } else {
                            throw error;  // Other errors
                        }
                    }
                }

                if (response) {
                    const geminiDocumentation = response.data.contents[0].parts[0].text.trim();
                    const finalDocumentationContent = `${parsedData}\n\n${geminiDocumentation}`;
                    createDocumentationFile(filePath, finalDocumentationContent);
                } else {
                    vscode.window.showInformationMessage("Failed to generate documentation after retries.");
                }

            } catch (error) {
                console.error("Error:", error);
                vscode.window.showInformationMessage("Failed to generate documentation using Gemini API.");
            }
        }
    });
}


function createDocumentation(parsedData) {
    let docContent = '# Documentation\n\n';

    parsedData.classes.forEach((className) => {
        docContent += `## Class: ${className}\n\n`;
    });

    parsedData.functions.forEach((func) => {
        docContent += `- Function: ${func}\n`;
    });

    parsedData.variables.forEach((variable) => {
        docContent += `- Variable: ${variable}\n`;
    });

    return docContent;
}
function createDocumentationFile(filePath, content) {
    const docFolder = path.join(path.dirname(filePath), 'docs');

    const docFileName = `${path.basename(filePath, path.extname(filePath))}_documentation.md`;
    const docFilePath = path.join(docFolder, docFileName);

    fs.writeFileSync(docFilePath, content, 'utf-8');
    vscode.window.showInformationMessage(`Documentation created: ${docFilePath}`);
}
function deactivate() {}

module.exports = {
    activate,
    deactivate
};
