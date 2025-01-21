const fs = require('fs');
const path = require('path');
const parseJavaScript = require('../parsers/parseJavaScript');
const parsePython = require('../parsers/parsePython');
const parseJava = require('../parsers/parseJava');
const parseCPlusPlus = require('../parsers/parseCPlusPlus');
const parseRuby = require('../parsers/parseRuby');
const parseDart = require("../parsers/parseDart");
const parseGo = require('../parsers/parseGo');
const parsePHP = require('../parsers/parsePHP');
const parseCSharp = require('../parsers/parseCSharp');
const fetchGeminiExplanation = require('./fetchGeminiExplanation');
const createDocumentation = require('./createDocumentation');
const createDocumentationFile = require('./createDocumentationFile');

async function generateDocumentation(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const fileExtension = path.extname(filePath).toLowerCase();
    const parsers = {
        '.js': parseJavaScript,
        '.py': parsePython,
        '.java': parseJava,
        '.cpp': parseCPlusPlus,
        '.rb': parseRuby,
        '.go': parseGo,
        '.dart' : parseDart,
        '.php' : parsePHP,
        '.cs' : parseCSharp
    };

    const parse = parsers[fileExtension];
    if (!parse) {
        console.log('Unsupported file type.');
        return;
    }

    const parsedContent = parse(fileContent);
    const geminiResponse = await fetchGeminiExplanation(fileContent);
    const documentationContent = createDocumentation(parsedContent, geminiResponse);

    createDocumentationFile(filePath, documentationContent + `\n\n## File Content\n${fileContent}`);
}

module.exports = generateDocumentation;
