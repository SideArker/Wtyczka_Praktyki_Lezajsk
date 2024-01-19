import { Button, Container, TextField, Grid, FormControl, Paper, Typography } from '@mui/material';
import React from 'react';
import { ChatMessage, UserMessage } from './Message';
import { useState, useEffect, useRef } from 'react';

export default function Conversation() {
  const [key, setKey] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [tokens, setTokens] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [model, setModel] = useState('');

  const [GptModels, setMessage] = useState([]);

  const [value, setValue] = useState('');
  const handleChange = e => {
    setValue(e.target.value);
  };

  const SendPropmpt = () => {
    fetch(`https://api.openai.com/v1/chat/completions`, {
      method: 'post',
      headers: new Headers({
        Authorization: `Bearer ${key}`,
      }),
      body: JSON.stringify({
        model: `${model}`,
        messages: {
          role: 'user',
          content: `${value}`,
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
    <Paper
      sx={{
        minHeight: '100vh',
        p: 1,
        // width: '50%'
      }}>
      <FormControl fullWidth sx={{}}>
        <Grid container sx={{ m: 2 }}>
          <Grid item sx={{ width: '90%' }}>
            <TextField fullWidth variant="outlined" value={value} onChange={handleChange}></TextField>
          </Grid>
          <Grid item alignItems="stretch" style={{ display: 'flex' }}>
            <Button variant="outlined" sx={{ mx: 2 }} onClick={SendPropmpt}>
              Send
            </Button>
          </Grid>
        </Grid>
        <UserMessage text="Testowa wiadomość użytkownika" />
        <ChatMessage text="Testowa odpowiedź AI" />
      </FormControl>
    </Paper>
  );
}
