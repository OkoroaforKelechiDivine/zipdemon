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
    context.subscriptions.push(vscode.commands.registerCommand('zipdemon.generateDocumentation', () => {  
        vscode.window.showInformationMessage('ZipDemon Documentation Generator is Active!');  
    }));  

    let fileWatcher = vscode.workspace.createFileSystemWatcher('**/*');  
    
    fileWatcher.onDidCreate((uri) => {  
        promptToDocumentNewFile(uri);  
    });  

    context.subscriptions.push(fileWatcher);  
}  

function promptToDocumentNewFile(uri) {  
    const filePath = uri.fsPath;  
    const fileExtension = path.extname(filePath).toLowerCase();  
    const supportedExtensions = ['.js', '.py', '.java', '.cpp', '.rb', '.go'];  
    
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

function generateDocumentation(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
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

    const documentationContent = createDocumentation(parsedContent);
    
    // Call the Gemini API to generate documentation
    axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCodqT4YwBHTea7CnLojpBO-rz-mn3cEWE', {
        contents: [{
            parts: [{
                text: fileContent + '\n\n' + 'Generate a detailed documentation for the above content.'
            }]
        }]
    })
    .then(response => {
        const geminiResponse = response.data;
        // Assuming Gemini returns the documentation in 'text' field of the response
        const geminiGeneratedContent = geminiResponse.contents[0].parts[0].text;

        // Append the Gemini generated content to the documentation
        const fullDocumentationContent = documentationContent + '\n\n## Gemini Generated Documentation\n' + geminiGeneratedContent;

        // Create the markdown file with Gemini's content
        createDocumentationFile(filePath, fullDocumentationContent);
    })
    .catch(error => {
        vscode.window.showErrorMessage('Error generating documentation from Gemini API: ' + error.message);
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

    // Check if the docs folder exists; if not, create it
    if (!fs.existsSync(docFolder)) {
        fs.mkdirSync(docFolder);
    }

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
