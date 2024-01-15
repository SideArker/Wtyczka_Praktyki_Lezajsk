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
  Grid
} from '@mui/material';
import { useState, useEffect } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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

function SaveData(data: Settings) {
  const storage = chrome.storage.sync;
  storage.set({ settingsData: data });
}

function LoadData() {
  const storage = chrome.storage.sync;
  storage.get('settingsData', function (data) {
    console.log(data);
  });
}

export function SettingsForm() {
  const [model, setModel] = useState('');
  const [GptModels, setGptModels] = useState([]);

  function FetchModels() {
    useEffect(() => {
      fetch('https://api.openai.com/v1/models')
        .then(response => response.json())
        .then(res => setGptModels(res.data));
    }, []);
  }

  FetchModels();

  LoadData();

  const handleDropdownChange = (event: SelectChangeEvent) => {
    setModel(event.target.value as string);
  };

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

      <TextField variant="standard" type="password" label="API key" />
      <Button variant='outlined' sx={{ width: '50px' }}>Apply</Button>

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
          helperText={'Organization IDs can be found on your organization settings page. completion.'}
        />
        <TextField
          sx={{ width: '32%' }}
          variant="standard"
          type="number"
          label="Max tokens"
          helperText="The maximum number of tokens to generate in the chat completion."
        />
        <TextField
          sx={{ width: '32%' }}
          variant="standard"
          type="number"
          label="Temperature"
          helperText="What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the outpu more random, while lower values like 0.2 will make it more focused and deterministic."
        />
      </Box>
      <FormControl fullWidth>
        <InputLabel id="ModelLabel">Model</InputLabel>
        <Grid container>
          <Grid item sx={{width: '90%'}}>

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
                  if (model.owned_by === 'openai' || model.owned_by === 'openai-internal') {
                    return (
                      <MenuItem key={model.id} value={model.id}>
                        {model.id}
                      </MenuItem>
                    );
                  }
                })
              ) : (<></>
                // <MenuItem>Error while loading models. Please check your API Key</MenuItem>
              )}
            </Select>
          </Grid>
          <Grid item alignItems="stretch" style={{ display: "flex" }}>
            <Button variant="outlined" sx={{mx: 2}}>
              Refresh
            </Button>
          </Grid>
        </Grid>

        {GptModels ? <></> : <FormHelperText>Error while loading models. Please check your API Key</FormHelperText>}
      </FormControl>

      <Button variant='outlined' sx={{
        width: '50px'
      }}>Save</Button>
    </Paper>
  );
}
