const axios = require('axios');

async function fetchGeminiExplanation(fileContent) {
    const apiKey = 'AIzaSyCodqT4YwBHTea7CnLojpBO-rz-mn3cEWE'

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(apiUrl, {
            contents: [{ parts: [{ text: `Generate a professional software engineering documentation and write example of usage if possible:\n${fileContent}` }] }]
        });
        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No explanation generated.';
    } catch (error) {
        console.error('Error fetching explanation:', error);
        return 'Error generating explanation.';
    }
}

module.exports = fetchGeminiExplanation;
