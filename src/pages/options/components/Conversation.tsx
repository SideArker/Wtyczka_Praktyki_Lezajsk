import { Button, Container, TextField, Grid, FormControl, Paper, Typography } from '@mui/material';
import React from 'react';
import ChatMessage from './Message';
import { useState, useEffect, useRef } from 'react';
import './Conversation.css';

export default function Conversation() {
  const [key, setKey] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [tokens, setTokens] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [model, setModel] = useState('');

  const [textMessage, setMessage] = useState('');

  const handleChange = e => {
    setMessage(e.target.value);
  };

  const SendPropmpt = () => {
    fetch(`https://api.openai.com/v1/chat/completions`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      }),
      body: JSON.stringify({
        model: `${model}`,
        messages: {
          role: 'user',
          content: `${textMessage}`,
        },
      }),
    })
      .then(response => response.json())
      .then(res => console.log(res));
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
    <Container>
      <main>

        {/* {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)} */}
        <ChatMessage message={{ text: 'hdfsafkajsd', isMine: false }} />
        <ChatMessage message={{ text: 'hdfsafkajsd', isMine: true }} />
        <ChatMessage message={{ text: 'hdfsafkajsd', isMine: false }} />
        <ChatMessage message={{ text: 'hdfsafkajsd', isMine: true }} />

        <span></span>

      </main>

      <form>

        <TextField placeholder="say something nice" sx={{
          lineHeight: '1.5',
          width: 'inherit',
          fontSize: '1.5rem',
          bgcolor: 'rgb(58, 58, 58)',
          color: 'white',
          outline: 'none',
          border: 'none',
          // padding: '0 10px',

        }} />

        <Button type="submit" variant='contained' sx={{
          width: '20%',
          bgcolor: 'primary.main',
          mx: 1
        }}>🕊️</Button>

      </form>
    </Container>
  );
}
