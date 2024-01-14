import React from 'react';
import '@pages/options/Options.css';
import {SettingsForm} from './components/SettingsForms';

const Options: React.FC = () => {
  return <div className="container">
    <SettingsForm/>
  </div>;
};

export default Options;
