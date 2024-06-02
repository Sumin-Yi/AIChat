import axios from 'axios';

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
console.log('Google Cloud API Key:', API_KEY);

export const sendAudio = async (audioData) => {
  if (!API_KEY) {
    throw new Error('Google Cloud API Key is not defined');
  }

  // Construct the request payload
  const requestPayload = {
    config: {
      encoding: 'WEBM_OPUS', // Updated encoding format to match recorded audio
      sampleRateHertz: 48000, // Sample rate in Hertz
      languageCode: 'en-US', // The language of the input audio
    },
    audio: {
      content: audioData.split(',')[1], // Extract the audio content from Base64 data
    },
  };

  console.log('Request Payload:', JSON.stringify(requestPayload, null, 2));

  try {
    // Make the POST request to Google Cloud Speech API
    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`,
      requestPayload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Response from Google Cloud Speech API:', response.data);

    // Check if results array exists and has at least one result
    if (response.data.results && response.data.results.length > 0) {
      // Return the transcription result
      return response.data.results[0].alternatives[0].transcript;
    } else {
      // Handle case where no transcription results are returned
      console.warn('No transcription results returned by the API.');
      return 'No transcription available.';
    }
  } catch (error) {
    // Handle errors appropriately
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);

      // Additional logging of error details
      if (error.response.data.error) {
        console.error('Detailed error message:', error.response.data.error.message);
        console.error('Detailed error code:', error.response.data.error.code);
      }
    } else if (error.request) {
      console.error('Error request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
    throw error;
  }
};
