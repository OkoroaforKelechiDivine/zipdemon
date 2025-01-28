const axios = require('axios');

async function fetchGeminiExplanation(fileContent) {
    const apiKey = 'AIzaSyCodqT4YwBHTea7CnLojpBO-rz-mn3cEWE'

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(apiUrl, {
            contents: [{ parts: [{ text: `Create API documentation that is easy for the frontend team to understand. The documentation should detail endpoints, request/response formats, headers, error handling, and any necessary authentication requirements:\n${fileContent}` }] }]
        });
        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No explanation generated.';
    } catch (error) {
        console.error('Error fetching explanation:', error);
        return 'Error generating explanation.';
    }
}

module.exports = fetchGeminiExplanation;
