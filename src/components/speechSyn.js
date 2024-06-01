import React, { useEffect } from 'react';
import { fetchTTS } from '../api/googletts';

const SpeechSynComponent = ({ text }) => {
  useEffect(() => {
    const synthesizeSpeech = async () => {
      if (text) {
        try {
          const audioContent = await fetchTTS(text);
          const audio = new Audio('data:audio/mp3;base64,' + audioContent);
          audio.play();
        } catch (error) {
          console.error('Error playing TTS audio:', error);
        }
      }
    };

    synthesizeSpeech();
  }, [text]);

  return null;
};

export default SpeechSynComponent;
