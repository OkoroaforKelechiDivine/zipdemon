const axios = require('axios');

async function fetchGeminiExplanation(fileContent) {
    const apiKey = 'AIzaSyDhR5H4W_yPHJtqE3wx7YAWzC-iqaqyTbs';

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    console.log('\n=== Sending Request to Gemini API ===');
    console.log('API URL:', apiUrl);
    console.log('File Content Preview:\n', fileContent?.slice(0, 300), '...');
    console.log('======================================\n');

    try {
        const response = await axios.post(apiUrl, {
            contents: [
                {
                    parts: [
                        {
                            text: `Create API documentation that is easy for the frontend team to understand. The documentation should detail endpoints, request/response formats, headers, error handling, and any necessary authentication requirements:\n${fileContent}`
                        }
                    ]
                }
            ]
        });

        console.log('\n Response from Gemini API:');
        console.dir(response.data, { depth: null });

        const explanation = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!explanation) {
            console.warn('No explanation found in response. Response format may have changed.');
        }

        return explanation || 'No explanation generated.';
    } catch (error) {
        console.error('\n Error fetching explanation');

        if (error.response) {
            console.error('API responded with an error status:');
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            console.error('📡 No response received from API.');
            console.error('Request:', error.request);
        } else {
            console.error('Something went wrong while setting up the request.');
            console.error('Message:', error.message);
        }

        console.error('Full Error Stack Trace:', error.stack);

        return 'Error generating explanation.';
    }
}

module.exports = fetchGeminiExplanation;
