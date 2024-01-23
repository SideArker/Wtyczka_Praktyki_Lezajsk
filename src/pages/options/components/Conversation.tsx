import { Button, Container, TextField, Grid, FormControl, Paper, Typography } from '@mui/material';
import React from 'react';
import ChatMessage from './Message';
import { useState, useEffect, useRef } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'assistant';
}
import './Conversation.css';

export default function Conversation() {
  const [key, setKey] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [tokens, setTokens] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [model, setModel] = useState('');

  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleChange = e => {
    setUserInput(e.target.value);
  };

  const SendPrompt = async () => {
    if (userInput === '') return;
    const userMessage: Message = { text: userInput, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        }),
        body: JSON.stringify({
          model: `${model}`,
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful assistant. Try to mainly speak in english unless prompted directly by a different language.',
            },
            {
              role: 'user',
              content: `${userInput}`,
            },
          ],
        }),
      });
      if (response.ok) {
        const data: ChatCompletion = await response.json();
        const botMessage: Message = { text: data.choices[0].message.content, sender: 'assistant' };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        console.log(botMessage);
      } else {
        console.error('Error calling OpenAI API');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Load data
  useEffect(() => {
    const storage = chrome.storage.sync;
    storage.get('settingsData', function (data) {
      setKey(data.settingsData.apiKey);
      setOrganizationId(data.settingsData.organizationId);
      setTokens(data.settingsData.tokensCount);
      setTemperature(data.settingsData.temperature);
      setModel(data.settingsData.modelId);
    });
  }, []);

  return (
    <Container sx={{ bgcolor: '#282828' }}>
      <main>
        {messages.map((message, index) => {
          if (message.sender == 'user') {
            return <ChatMessage message={{ text: message.text, isUser: true }} />;
          } else return <ChatMessage message={{ text: message.text, isUser: false }} />;
        })}
        <span></span>
      </main>

      <TextField
        placeholder="say something nice"
        onChange={handleChange}
        sx={{
          lineHeight: '1.5',
          width: 'inherit',
          fontSize: '1.5rem',
          bgcolor: 'rgb(58, 58, 58)',
          color: 'white',
          outline: 'none',
          border: 'none',
        }}
      />

      <Button
        type="button"
        variant="contained"
        onClick={SendPrompt}
        sx={{
          width: '20%',
          bgcolor: 'primary.main',
          mx: 1,
        }}>
        🕊️
      </Button>
    </Container>
  );
}
