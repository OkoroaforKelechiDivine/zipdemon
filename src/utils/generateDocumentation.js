const fs = require('fs').promises;
const path = require('path');
const parseJavaScript = require('../parsers/parseJavaScript');
const parsePython = require('../parsers/parsePython');
const parseJava = require('../parsers/parseJava');
const parseCPlusPlus = require('../parsers/parseCPlusPlus');
const parseRuby = require('../parsers/parseRuby');
const parseDart = require("../parsers/parseDart");
const parseGo = require('../parsers/parseGo');
const parseTypeScript = require('../parsers/parseTypescript');
const parsePHP = require('../parsers/parsePHP');
const parseCSharp = require('../parsers/parseCSharp');
const fetchGeminiExplanation = require('./fetchGeminiExplanation');
const createDocumentation = require('./createDocumentation');
const createDocumentationFile = require('./createDocumentationFile');

async function generateDocumentation(filePath) {
    try {
        if (!filePath) {
            console.error('No file path provided to generateDocumentation.');
            return;
        }

        const fileExtension = path.extname(filePath).toLowerCase();
        const parsers = {
            '.js': parseJavaScript,
            '.py': parsePython,
            '.java': parseJava,
            '.cpp': parseCPlusPlus,
            '.rb': parseRuby,
            '.go': parseGo,
            '.dart': parseDart,
            '.php': parsePHP,
            '.cs': parseCSharp,
            '.ts': parseTypeScript
        };

        const parse = parsers[fileExtension];
        if (!parse) {
            console.error(`Unsupported file type: ${fileExtension}`);
            return;
        }

        let fileContent;
        try {
            fileContent = await fs.readFile(filePath, 'utf-8');
        } catch (err) {
            console.error(`Failed to read file: ${filePath}`, err);
            return;
        }

        let parsedContent;
        try {
            parsedContent = parse(fileContent);
        } catch (err) {
            console.error(`Failed to parse file: ${filePath}`, err);
            return;
        }

        let geminiResponse;
        try {
            geminiResponse = await fetchGeminiExplanation(fileContent);
        } catch (err) {
            console.error('Failed to fetch Gemini explanation.', err);
            geminiResponse = '';
        }

        let documentationContent;
        try {
            documentationContent = createDocumentation(parsedContent, geminiResponse);
        } catch (err) {
            console.error('Failed to create documentation.', err);
            return;
        }

        try {
            await createDocumentationFile(filePath, documentationContent);
        } catch (err) {
            console.error('Failed to write documentation file.', err);
        }
    } catch (err) {
        console.error('Unexpected error in generateDocumentation:', err);
    }
}

module.exports = generateDocumentation;