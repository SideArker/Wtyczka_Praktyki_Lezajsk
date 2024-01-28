import {
  IconButton,
  Button,
  Box,
  Container,
  TextField,
  Grid,
  FormControl,
  Paper,
  Typography,
  Drawer,
} from '@mui/material';
import React from 'react';
import ChatMessage from './Message';
import { useState, useEffect, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';
import './Conversation.css';
import ClearIcon from '@mui/icons-material/ClearOutlined';

interface Message {
  text: string;
  sender: 'user' | 'assistant';
}

export default function Conversation() {
  const [key, setKey] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [tokens, setTokens] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [model, setModel] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<any>>([]);

  const [dataLoaded, setDataLoaded] = useState(false);

  const sendPrompt = async () => {
    if (prompt === '') return;
    if (key === '') return;
    const userMessage: Message = { text: prompt, sender: 'user' };
    clearSearch();
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          'OpenAI-Organization': organizationId,
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
            ...conversationHistory,
            {
              role: 'user',
              content: `${prompt}`,
            },
          ],
          max_tokens: tokens,
          temperature: temperature,
        }),
      });
      if (response.ok) {
        const data: ChatCompletion = await response.json();
        const botMessage: Message = { text: data.choices[0].message.content, sender: 'assistant' };
        setMessages(prevMessages => [...prevMessages, botMessage]);

        setConversationHistory(prevHistory => [
          ...prevHistory,
          { role: 'user', content: prompt },
          { role: 'assistant', content: data.choices[0].message.content },
        ]);
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
      if (data.hasOwnProperty('settingsData')) {
        setKey(data.settingsData.apiKey);
        setOrganizationId(data.settingsData.organizationId);
        setTokens(data.settingsData.tokensCount);
        setTemperature(data.settingsData.temperature);
        setModel(data.settingsData.modelId);
        setDataLoaded(true);
      }
    });
  }, []);

  const [prompt, setPromptText] = useState('');

  const clearSearch = () => {
    setPromptText('');
  };
  const filterResults = e => {
    setPromptText(e.target.value);
  };

  function keyPress(e) {
    if (e.keyCode == 13) {
      sendPrompt();
    }
  }

  return (
    <Container>
      <Paper className="main">
        {messages.map((message, index) => {
          if (message.sender == 'user') {
            return <ChatMessage message={{ text: message.text, isUser: true }} />;
          } else return <ChatMessage message={{ text: message.text, isUser: false }} />;
        })}
        <span></span>
      </Paper>
      <Box className="form">
        <TextField
          placeholder="Say something nice"
          value={prompt}
          onChange={filterResults}
          onKeyDown={keyPress}
          error={!dataLoaded}
          label={!dataLoaded ? 'Error while loading data. Please check your settings' : ''}
          focused
          InputProps={{
            endAdornment: (
              <IconButton onClick={clearSearch} edge="end">
                <ClearIcon />
              </IconButton>
            ),
          }}
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
          onClick={sendPrompt}
          sx={{
            width: '20%',
            bgcolor: 'primary.main',
            ml: 1,
          }}
          endIcon={<SendIcon />}>
          Send
        </Button>
      </Box>
    </Container>
  );
}
