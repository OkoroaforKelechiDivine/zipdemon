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

    fileWatcher.onDidChange((uri) => {
        promptToDocumentFileChange(uri); // Check for content change in the file
    });

    context.subscriptions.push(fileWatcher);  
}  

function promptToDocumentNewFile(uri) {  
    const filePath = uri.fsPath;  
    const fileExtension = path.extname(filePath).toLowerCase();  
    const supportedExtensions = ['.js', '.py', '.java', '.cpp', '.rb', '.go'];  
    
    if (supportedExtensions.includes(fileExtension)) {  
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        if (fileContent.trim().length === 0) {
            // If the file is empty, do not show the information message
            console.log(`The file ${filePath} is empty, no documentation will be generated.`);
            return;
        }

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

function promptToDocumentFileChange(uri) {
    const filePath = uri.fsPath;  
    const fileExtension = path.extname(filePath).toLowerCase();  
    const supportedExtensions = ['.js', '.py', '.java', '.cpp', '.rb', '.go'];

    if (supportedExtensions.includes(fileExtension)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Check if the file was empty before and now has content
        if (fileContent.trim().length > 0) {
            // If file was previously empty, show information message
            vscode.window.showInformationMessage(
                `The ${fileExtension} file now has content. Would you like to generate documentation?`,
                'Yes',
                'No'
            ).then(selection => {
                if (selection === 'Yes') {
                    generateDocumentation(filePath);
                }
            });
        }
    }
}

async function generateDocumentation(filePath) {
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

    const geminiResponse = await fetchGeminiExplanation(fileContent);

    const documentationContent = createDocumentation(parsedContent, geminiResponse);

    // Append the file content to the documentation
    const fullDocumentationContent = documentationContent + '\n\n## File Content\n' + fileContent;

    console.log(`File Content from ${filePath}:\n`, fileContent);

    createDocumentationFile(filePath, fullDocumentationContent);
}

async function fetchGeminiExplanation(fileContent) {
    const apiKey = 'AIzaSyCodqT4YwBHTea7CnLojpBO-rz-mn3cEWE'; // Replace with your actual API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(
            apiUrl,
            {
                contents: [{
                    parts: [{
                        text: `Generate documentation for the following file content:\n${fileContent}`
                    }]
                }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log("I got the response", response);

        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            return response.data.candidates[0].output || 'No explanation generated.';
        } else {
            return 'No response from the Gemini API.';
        }
    } catch (error) {
        console.error('Error fetching explanation from Gemini API:', error);
        return 'Failed to generate explanation due to an error.';
    }
}

function createDocumentation(parsedData, geminiExplanation) {
    let docContent = '# Documentation\n\n';
    docContent += `## AI Explanation\n${geminiExplanation}\n\n`;

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