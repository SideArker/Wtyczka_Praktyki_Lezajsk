import React from 'react';
import { SettingsForm } from './components/SettingsForms';
import { ThemeProvider, createTheme, Box, Drawer } from '@mui/material';
import Conversation from './components/Conversation';
import TemporaryDrawer from './components/Drawer';
import { useEffect } from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

type Page = 'Chat' | 'Options';

const Options: React.FC = () => {
  const [page, setPage] = React.useState('');

  function CheckData() {
    const storage = chrome.storage.sync;
    storage.get('settingsData', function (data) {
      if (!data.hasOwnProperty('settingsData')) {
        getCurrentPage('Options');
      } else getCurrentPage('Chat');
    });
  }

  const getCurrentPage = (page: Page) => {
    setPage(page);
  };

  useEffect(() => {
    CheckData();
  }, []);

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
