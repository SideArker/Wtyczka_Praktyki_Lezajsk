import React from 'react';
import '@pages/options/Options.css';
import { SettingsForm } from './components/SettingsForms';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Options: React.FC = () => {
  return <ThemeProvider theme={darkTheme}>
    <Box className="container">
      <SettingsForm />
    </Box>
  </ThemeProvider>;
};

export default Options;
