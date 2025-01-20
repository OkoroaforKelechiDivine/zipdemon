const vscode = require('vscode');

const activate = require('./src/activate');
const deactivate = () => {};

module.exports = {
    activate,
    deactivate
};
