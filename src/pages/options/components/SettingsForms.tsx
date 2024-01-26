import {
  Input,
  InputLabel,
  FormControl,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Box,
  MenuItem,
  Button,
  FormHelperText,
  Grid,
  Container,
  makeStyles,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { red } from '@mui/material/colors';

interface IModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

class Settings {
  apiKey: string;
  organizationId: string;
  tokensCount: number;
  temperature: number;
  modelId: string;

  constructor(apiKey: string, organizationId: string, tokensCount: number, temperature: number, modelId: string) {
    this.apiKey = apiKey;
    this.organizationId = organizationId;
    this.tokensCount = tokensCount;
    this.temperature = temperature;
    this.modelId = modelId;
  }
}

const defaultValues = {
  textValue: '',
  radioValue: '',
  checkboxValue: [],
  dateValue: new Date(),
  dropdownValue: '',
  sliderValue: 0,
};

export function SettingsForm() {
  const keyRef = useRef(null);
  const organizationRef = useRef(null);
  const tokenRef = useRef(null);
  const temperatureRef = useRef(null);
  const modelRef = useRef(null);

  const [key, setKey] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [tokens, setTokens] = useState(-1);
  const [temperature, setTemperature] = useState(-1);
  const [model, setModel] = useState('');
  const [errorMessage, ErrorMessage] = useState('');

  const [GptModels, setGptModels] = useState([]);

  function FetchModels(key: string) {
    if (key.length < 1) return;
    fetch(`https://api.openai.com/v1/models`, {
      method: 'get',
      headers: new Headers({
        Authorization: `Bearer ${key}`,
      }),
    })
      .then(response => response.json())
      .then(res => setGptModels(res.data));
  }

  function SaveData(data: Settings) {
    const storage = chrome.storage.sync;
    storage.set({ settingsData: data });
  }

  function LoadData() {
    const storage = chrome.storage.sync;
    storage.get('settingsData', function (data) {
      if (!data.hasOwnProperty('settingsData')) return;
      FetchModels(data.settingsData.apiKey);

      setKey(data.settingsData.apiKey);
      setOrganizationId(data.settingsData.organizationId);
      setTokens(data.settingsData.tokensCount);
      setTemperature(data.settingsData.temperature);
      setModel(data.settingsData.modelId);

      keyRef.current.value = data.settingsData.apiKey;
      organizationRef.current.value = data.settingsData.organizationId;
      tokenRef.current.value = data.settingsData.tokensCount;
      temperatureRef.current.value = data.settingsData.temperature;
      modelRef.current.value = data.settingsData.modelId;

      Validate();
      return;
    });
  }
  function Validate() {
    console.log("tokens", tokens)
    if (temperature == -1) ErrorMessage('Set temperature.');
    else if (tokens == -1) ErrorMessage('Set number of tokens.');
    else if (organizationId == '') ErrorMessage('Organization ID is empty.');
    else if (key == '') ErrorMessage('API key is empty.');
    else {
      ErrorMessage('');
      return true;
    }
    return false;
  }
  function Submit() {
    if (Validate()) {
      onSaveSettings();
    }
  }
  useEffect(() => {
    LoadData();
  }, []);

  const handleDropdownChange = (event: SelectChangeEvent) => {
    setModel(event.target.value);
  };

  const onSaveSettings = () => SaveData(new Settings(key, organizationId, tokens, temperature, model));

  return (
    <Container>
      <Paper
        elevation={3}
        style={{
          display: 'grid',
          gridRowGap: '20px',
          padding: '20px',
          height: '100%',
        }}>
        <Typography variant="h6">Options</Typography>

        <TextField
          variant="standard"
          type="password"
          label="API key"
          inputRef={keyRef}
          onChange={event => setKey(event.target.value)}
          error={key == ''}
        />

        <Typography variant="h6">API Settings</Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <TextField
            sx={{ width: '32%' }}
            variant="standard"
            label="Organization Id"
            onChange={event => setOrganizationId(event.target.value)}
            helperText={'Organization IDs can be found on your organization settings page. completion.'}
            inputRef={organizationRef}
            FormHelperTextProps={{
              style: {
                padding: 0,
              },
            }}
            error={organizationId == ''}
          />
          <TextField
            sx={{ width: '32%' }}
            variant="standard"
            type="number"
            label="Max tokens"
            onChange={event => setTokens(parseFloat(event.target.value))}
            helperText="The maximum number of tokens to generate in the chat completion."
            inputRef={tokenRef}
            FormHelperTextProps={{
              style: {
                padding: 0,
              },
            }}
            error={tokens == -1}
          />
          <TextField
            sx={{ width: '32%' }}
            variant="standard"
            type="number"
            label="Temperature"
            onChange={event => setTemperature(parseFloat(event.target.value))}
            helperText="What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic."
            inputRef={temperatureRef}
            FormHelperTextProps={{
              style: {
                padding: 0,
              },
            }}
            error={temperature == -1}
          />
        </Box>
        <FormControl fullWidth>
          <InputLabel id="ModelLabel">Model</InputLabel>
          <Box
            sx={{
              width: 'inherit',
              display: 'flex',
            }}>
            <Select
              fullWidth
              error={!GptModels}
              placeholder="Select Model"
              variant="outlined"
              labelId="ModelLabel"
              id="ModelLabelSelect"
              value={model}
              label="Model"
              onChange={handleDropdownChange}>
              {GptModels ? (
                GptModels.map((model: IModel) => {
                  if (model.owned_by === 'openai') {
                    return (
                      <MenuItem key={model.id} value={model.id}>
                        {model.id}
                      </MenuItem>
                    );
                  }
                })
              ) : (
                <>
                  <MenuItem>Error while loading models. Please check your API Key</MenuItem>
                </>
              )}
            </Select>
            <Button variant="outlined" sx={{ mx: 2 }} onClick={() => FetchModels(key)}>
              Refresh
            </Button>
          </Box>

          {GptModels ? <></> : <FormHelperText>Error while loading models. Please check your API Key</FormHelperText>}
        </FormControl>

        <Button
          variant="outlined"
          sx={{
            width: '50px',
          }}
          onClick={Submit}
          // color={Validate() ? 'inherit' : 'error'}
        >
          Save
        </Button>
        <FormHelperText
          sx={{
            p: 0,
            color: 'error.main',
          }}>
          {errorMessage}
        </FormHelperText>
      </Paper>
    </Container>
  );
}
