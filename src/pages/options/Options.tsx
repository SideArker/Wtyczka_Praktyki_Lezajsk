import React from 'react';
import { SettingsForm } from './components/SettingsForms';
import { ThemeProvider, createTheme, Box, Drawer } from '@mui/material';
import Conversation from './components/Conversation';
import TemporaryDrawer from './components/Drawer';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Options: React.FC = () => {
  const [page, setPage] = React.useState('');

  const getCurrentPage = page => {
    console.log('Data received in parent:', page);
    setPage(page);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box className="container">
        <TemporaryDrawer pageCallback={getCurrentPage} />
        {page === 'Options' ? <SettingsForm /> : <Conversation />}
      </Box>
    </ThemeProvider>
  );
};

export default Options;
