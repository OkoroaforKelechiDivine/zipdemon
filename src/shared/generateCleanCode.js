const axios = require('axios');

async function generateCleanCode(code) {
    const apiKey = 'AIzaSyCodqT4YwBHTea7CnLojpBO-rz-mn3cEWE';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(apiUrl, {
            contents: [{
                parts: [{
                    text: `Generate clean code with better naming, simplification, and improvements. Please provide only the code without any code block delimiters (no backticks, no programming language tags, just plain code):\n${code}`
                }]
            }]
        });

        const cleanCode = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (cleanCode) {
            return cleanCode.trim();
        } else {
            return 'No clean code generated.';
        }
    } catch (error) {
        console.error('Error fetching clean code:', error);
        return 'Error generating clean code.';
    }
}

module.exports = { generateCleanCode };
