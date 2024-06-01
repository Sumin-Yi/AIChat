import React, { useState } from 'react';
import { fetchChatGPTResponse } from './api/openai';
import SpeechRecComponent from './components/speechRec';
import SpeechSynComponent from './components/speechSyn';


const App = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [botResponse, setBotResponse] = useState('');

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
    <div>
      <h1>Ringle</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index} className={message.sender}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      {isLoading && <p>로딩 중...</p>}
      <SpeechRecComponent onTranscriptReceived={handleTranscriptReceived} />
      <SpeechSynComponent text={botResponse} />
    </div>
  );
};

export default App;
