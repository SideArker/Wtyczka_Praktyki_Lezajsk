import React from 'react';
import { SettingsForm } from './components/SettingsForms';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import Conversation from './components/Conversation'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Options: React.FC = () => {
  return <ThemeProvider theme={darkTheme}>
    <Box className="container">
      <SettingsForm />
      <Conversation/>
    </Box>
  </ThemeProvider>;
};

export default Options;
