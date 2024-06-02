import React, { useState, useRef, useEffect } from 'react';
import { sendAudio } from '../api/googlestt';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './speechRec.css';

const SpeechRecComponent = ({ onTranscriptReceived, onListeningStatusChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recorderRef = useRef(null);

  useEffect(() => {
    onListeningStatusChange(isListening);
  }, [isListening, onListeningStatusChange]);

  const handleToggleListening = () => {
    if (isListening) {
      handleStopListening();
    } else {
      handleStartListening();
    }
  };

  const handleStartListening = () => {
    setIsListening(true);
    startListening();
  };

  const handleStopListening = () => {
    setIsListening(false);
    stopListening();
  };

  const startListening = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        console.log('Microphone access granted.');

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const input = audioContext.createMediaStreamSource(stream);
        const recorder = new window.MediaRecorder(stream);
        recorderRef.current = recorder;

        recorder.ondataavailable = async (event) => {
          console.log('Data available from recorder:', event.data);
          const audioData = await convertBlobToBase64(event.data);
          console.log('Base64 audio data:', audioData);

          try {
            const transcript = await sendAudio(audioData);
            console.log('Transcription result:', transcript);
            setTranscript(transcript);
            if (onTranscriptReceived) {
              onTranscriptReceived(transcript);
            }
          } catch (error) {
            console.error('Error transcribing audio:', error);
            setTranscript('Error transcribing audio.');
          }
        };

        recorder.start();
        console.log('Recorder started.');
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
        setTranscript('Error accessing microphone.');
        setIsListening(false);
      });
  };

  const stopListening = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      console.log('Recorder stopped.');
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
    <div style={{ margin: '20px 0' }}>
      <button onClick={handleToggleListening} className="icon-button">
        {isListening ? <i className="fas fa-stop"></i> : <i className="fas fa-microphone"></i>}
      </button>
    </div>
  );
};

export default SpeechRecComponent;
