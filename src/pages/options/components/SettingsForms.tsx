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
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import openai from 'openai';

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
  const [tokens, setTokens] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [model, setModel] = useState('');

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
      console.log(data);

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
    });
  }

  useEffect(() => {
    LoadData();
  }, []);

  const handleDropdownChange = (event: SelectChangeEvent) => {
    setModel(event.target.value);
  };

  function saveApiKey() {
    setKey(keyRef.current.value);
    SaveData(new Settings(key, organizationId, tokens, temperature, model));
  }

  const onSaveSettings = () => SaveData(new Settings(key, organizationId, tokens, temperature, model));

  return (
    <Paper
      elevation={3}
      style={{
        display: 'grid',
        gridRowGap: '20px',
        padding: '20px',
        height: '100%',
      }}>
      <Typography variant="h6">Options</Typography>

      <TextField variant="standard" type="password" label="API key" inputRef={keyRef} />
      <Button variant="outlined" sx={{ width: '50px' }} onClick={saveApiKey}>
        Apply
      </Button>

      <Typography>API Settings</Typography>
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
        />
        <TextField
          sx={{ width: '32%' }}
          variant="standard"
          type="number"
          label="Max tokens"
          onChange={event => setTokens(parseFloat(event.target.value))}
          helperText="The maximum number of tokens to generate in the chat completion."
          inputRef={tokenRef}
        />
        <TextField
          sx={{ width: '32%' }}
          variant="standard"
          type="number"
          label="Temperature"
          onChange={event => setTemperature(parseFloat(event.target.value))}
          helperText="What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the outpu more random, while lower values like 0.2 will make it more focused and deterministic."
          inputRef={temperatureRef}
        />
      </Box>
      <FormControl fullWidth>
        <InputLabel id="ModelLabel">Model</InputLabel>
        <Grid container>
          <Grid item sx={{ width: '90%' }}>
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
          </Grid>
          <Grid item alignItems="stretch" style={{ display: 'flex' }}>
            <Button variant="outlined" sx={{ mx: 2 }} onClick={() => FetchModels(key)}>
              Refresh
            </Button>
          </Grid>
        </Grid>

        {GptModels ? <></> : <FormHelperText>Error while loading models. Please check your API Key</FormHelperText>}
      </FormControl>

      <Button
        variant="outlined"
        sx={{
          width: '50px',
        }}
        onClick={onSaveSettings}>
        Save
      </Button>
    </Paper>
  );
}
