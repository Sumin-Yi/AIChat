import axios from 'axios';

export const fetchTTS = async (text) => {
  const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
  const requestBody = {
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  console.log('API URL:', apiUrl);
  console.log('Request Body:', requestBody);

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response:', response.data);
    return response.data.audioContent;
  } catch (error) {
    console.error('Error fetching TTS:', error.response ? error.response.data : error.message);
    throw error;
  }
};
