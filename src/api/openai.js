import axios from 'axios';

const apiKey = process.env.OPENAI_API_KEY;

export const fetchChatGPTResponse = async (message) => {
  const response = await axios.post(
    'https://api.openai.com/v1/engines/davinci-codex/completions',
    {
      prompt: message,
      max_tokens: 150,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    }
  );
  return response.data.choices[0].text;
};
