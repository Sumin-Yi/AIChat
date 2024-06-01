import axios from 'axios';

const API_KEY = process.env.GOOGLE_API_KEY;
console.log('Google Cloud API Key:', API_KEY);

export const sendAudio = async (audioData) => {
    if (!API_KEY) {
        throw new Error('Google Cloud API Key is not defined');
      }
  try {
    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`,
      {
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
        },
        audio: {
          content: audioData.split(',')[1], 
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.results[0].alternatives[0].transcript;
  } catch (error) {
    console.error('Error sending audio:', error.response ? error.response.data : error.message);
    throw error;
  }
};
