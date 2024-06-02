import React, { useState, useEffect } from 'react';
import { fetchChatGPTResponse } from './api/openai';
import SpeechRecComponent from './components/speechRec';
import SpeechSynComponent from './components/speechSyn';
import './App.css'; 

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [botResponse, setBotResponse] = useState('');
  const [showButton, setShowButton] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const handleInitialMessage = async () => {
    const initialMessage = 'We are going to make a conversation about some topic. You will go first, suggest a topic and start with hello.';
    setIsLoading(true);
    const response = await fetchChatGPTResponse(initialMessage);
    setIsLoading(false);

    const botMessage = { text: response, sender: 'bot' };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setBotResponse(response);
    setShowButton(false);
  };

  useEffect(() => {
    if (botResponse) {
      // Any additional logic you want to add when botResponse changes
    }
  }, [botResponse]);

  const handleTranscriptReceived = async (transcript) => {
    const userMessage = { text: transcript, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setIsLoading(true);
    const response = await fetchChatGPTResponse(transcript);
    setIsLoading(false);

    const botMessage = { text: response, sender: 'bot' };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
    setBotResponse(response);
  };

  return (
    <div className="app">
      <h1 className='header'>Ringle Talk</h1>
      <div className="separator"></div>
      <div className="chat-container">
      {showButton && (
          <div className="button-container">
            <button className="button" onClick={handleInitialMessage}>Start Conversation</button>
          </div>
        )}
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div >
      <div className="separator"></div>
      <div style={{ margin: '20px 0' }}>
        {isLoading && <p className="loading">Thinking...</p>}
        {isListening && <p className="listening">Listening...</p>}
      </div>
      <SpeechRecComponent 
        onTranscriptReceived={handleTranscriptReceived} 
        onListeningStatusChange={setIsListening} 
      />
      <SpeechSynComponent text={botResponse} />
    </div>
  );
};

export default App;
