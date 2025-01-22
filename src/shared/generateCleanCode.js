const axios = require('axios');

async function generateCleanCode(code) {
    const apiKey = 'AIzaSyCodqT4YwBHTea7CnLojpBO-rz-mn3cEWE';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(apiUrl, {
            contents: [{
                parts: [{
                    text: `Generate clean, well-structured code with improved naming conventions and simplifications, while maintaining all existing functionality. Do not add or remove anything from the code. Return only the cleaned-up code as plain text, without any formatting or delimiters (no backticks, tags, or additional characters):\n${code}`
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
