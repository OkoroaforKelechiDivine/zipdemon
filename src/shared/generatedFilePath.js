const fs = require('fs');

let generatedFilePath = '';

function setGeneratedFilePath(path) {
    generatedFilePath = path;
}

function getGeneratedFilePath() {
    return generatedFilePath;
}

module.exports = { setGeneratedFilePath, getGeneratedFilePath };
