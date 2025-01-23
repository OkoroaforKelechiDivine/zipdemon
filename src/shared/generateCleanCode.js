const axios = require('axios');

async function generateCleanCode(code) {
    const apiKey = 'AIzaSyCodqT4YwBHTea7CnLojpBO-rz-mn3cEWE';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(apiUrl, {
            contents: [{
                parts: [{
                    text: `Generate clean, concise, and well-structured code using professional and advanced algorithms. Do not change the class name. Simplify the code while ensuring it executes the same functionality. Do not write everything on one line; maintain readability with proper formatting. Do not add or remove anything from the code. Return the updated code as plain text, without formatting or delimiters.:\n${code}`
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
