const vscode = require('vscode');  
const fs = require('fs');  
const path = require('path');  

const parseJavaScript = require('./src/parsers/parseJavaScript');  
const parsePython = require('./src/parsers/parsePython');  
const parseJava = require('./src/parsers/parseJava');  
const parseCPlusPlus = require('./src/parsers/parseCPlusPlus');  
const parseRuby = require('./src/parsers/parseRuby');  
const parseGo = require('./src/parsers/parseGo');  

function activate(context) {  
    vscode.workspace.onDidCreateFiles((event) => {  
        console.log('Files created:', event.files);  
        event.files.forEach((file) => {  
            vscode.window.showInformationMessage(`File created: ${file.fsPath}`);  
            promptForDocumentation(file.fsPath);  
        });  
    });  

    // Register the 'zipdemon.helloWorld' command  
    context.subscriptions.push(vscode.commands.registerCommand('zipdemon.helloWorld', () => {  
        vscode.window.showInformationMessage('Hello World from ZipDemon!');  
    }));  

    // Register the 'zipdemon.generateDocumentation' command  
    context.subscriptions.push(vscode.commands.registerCommand('zipdemon.generateDocumentation', () => {  
        vscode.window.showInformationMessage('ZipDemon Documentation Generator is Active!');  
    }));  
}  

function promptForDocumentation(filePath) {  
    console.log('Prompting for documentation for file:', filePath); // Log the file path being prompted for  
    vscode.window.showInformationMessage('Would you like to generate documentation for ' + filePath + '?');  
    vscode.window.showQuickPick(['Yes', 'No'], {  
        placeHolder: 'Do you want to generate documentation for this file?',  
    }).then((selection) => {  
        console.log('User selected:', selection); // Log the user's selection  
        if (selection === 'Yes') {  
            generateDocumentation(filePath);  
        }  
    });  
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
    createDocumentationFile(filePath, documentationContent);  
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