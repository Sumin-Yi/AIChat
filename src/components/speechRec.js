import React, { useState, useRef } from 'react';
import { sendAudio } from '../api/googlestt';

const SpeechRecComponent = ({ onTranscriptReceived }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recorderRef = useRef(null);

  const handleStartListening = () => {
    setIsListening(true);
    startListening();
  };

  const handleStopListening = () => {
    setIsListening(false);
    stopListening();
  };

  const startListening = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const input = audioContext.createMediaStreamSource(stream);
      const recorder = new window.MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = async (event) => {
        const audioData = await convertBlobToBase64(event.data);
        const transcript = await sendAudio(audioData);
        setTranscript(transcript);
        onTranscriptReceived(transcript);
      };

      recorder.start();
    });
  };

  const stopListening = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
    }
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div>
      <button onClick={handleStartListening} disabled={isListening}>음성 인식 시작</button>
      <button onClick={handleStopListening} disabled={!isListening}>음성 인식 중지</button>
      <p>{transcript}</p>
    </div>
  );
};

export default SpeechRecComponent;
