export const generateMessage = async (apiKey, user, profile, prompt) => {
    try{
        const name = user.name;
        const description = user.description;

        const receiver = profile.name;
        const receiverPosition = profile.position;
        const receiverCompany = profile.company;

        const message = `Create a professional LinkedIn connection message for ${receiver}. They are working as ${receiverPosition} at ${receiverCompany}. My name is ${name}, and here is a short description about me ${description}.\n Express your desire to connect and learn more. Also, I want you to include the following: ${prompt}`;

        const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: message,
                max_tokens: 100
            })
        });

        const data = await response.json();
        return data.choices[0].text;

    } catch (error) {
        console.error(error);
    }
};