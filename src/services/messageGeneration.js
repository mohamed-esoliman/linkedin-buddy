export const generateMessage = async (apiKey, message) => {

    try{

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-0125',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional assistant helping a user to connect with potential contacts on LinkedIn.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
            })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Error: ${response.status} ${response.statusText} - ${errorDetails.error.message}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error(error);
    }
};